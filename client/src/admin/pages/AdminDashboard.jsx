import React, {useEffect, useMemo, useState} from 'react'
import Notifications from "../components/Notifications.jsx";
import RevenueCard from "../components/RevenueCard.jsx";
import {useSelector} from "react-redux";
import {selectToken} from "../../redux/features/authSlice.js";
import {fetchAdminOrders} from "../utils/fetchAdminOrders.js";
import {filterOrdersByRange, getRevenueStats} from "../utils/orderAnalytics.js";
import CustomDateRangeModal from "../components/CustomDateRangeModal.jsx";

const AdminDashboard = () => {
    const token = useSelector(selectToken);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedRange, setSelectedRange] = useState('month');
    const [customRangeModalOpen, setCustomRangeModalOpen] = useState(false)
    const [draftCustomRange, setDraftCustomRange] = useState(undefined)
    const [customRange, setCustomRange] = useState(undefined)

    useEffect(() => {
        const loadOrders = async () => {
            try{
                const fetchedOrders = await fetchAdminOrders(token)
                setOrders(fetchedOrders)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
        if(!token){
            setLoading(false)
            setError("You must be logged in as an admin to load orders")
        }
        loadOrders();
    },[token])

    const filteredOrders = useMemo(() => {
        return filterOrdersByRange(orders, selectedRange,customRange)
    }, [orders, selectedRange,customRange])

    const revenueStats = useMemo(() => {
        return getRevenueStats(filteredOrders)
    }, [filteredOrders])

    const openCustomRangeModal = () => {
        setDraftCustomRange(customRange)
        setCustomRangeModalOpen(true)
    }

    const closeCustomRangeModal = () => {
        setCustomRangeModalOpen(false)
    }

    const applyCustomRange = () => {
        if (!draftCustomRange?.from || !draftCustomRange?.to) return
        setCustomRange(draftCustomRange)
        setSelectedRange('custom')
        setCustomRangeModalOpen(false)
    }

    if (loading) {
        return <div className="p-6">Loading dashboard...</div>
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>
    }


    return (
        <div className="mx-5">
            <div className="mb-6">
                <h1 className="text-2xl font-medium">Dashboard</h1>
            </div>
            <Notifications/>
            <RevenueCard
                selectedRange={selectedRange}
                setSelectedRange={setSelectedRange}
                revenue={revenueStats.revenue}
                orderCount={revenueStats.orderCount}
                averageOrderValue={revenueStats.averageOrderValue}
                onOpenCustomRange={openCustomRangeModal}
                customRange={customRange}
            />
            <CustomDateRangeModal
                open={customRangeModalOpen}
                range={draftCustomRange}
                onChange={setDraftCustomRange}
                onApply={applyCustomRange}
                onClose={closeCustomRangeModal}
            />

        </div>
    )
}
export default AdminDashboard
