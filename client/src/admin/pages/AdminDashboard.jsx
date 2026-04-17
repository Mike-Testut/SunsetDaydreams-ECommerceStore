import React, {useEffect, useMemo, useState} from 'react'
import Notifications from "../components/Notifications.jsx";
import RevenueCard from "../components/RevenueCard.jsx";
import {useSelector} from "react-redux";
import {selectToken} from "../../redux/features/authSlice.js";
import {fetchAdminOrders} from "../utils/fetchAdminOrders.js";
import {filterOrdersByRange, getRevenueStats} from "../utils/orderAnalytics.js";
import CustomDateRangeModal from "../components/CustomDateRangeModal.jsx";
import {
    fetchAdminNotifications,
    markAdminNotificationAsRead,
    markAllAdminNotificationsAsRead
} from "../utils/fetchAdminNotifications.js";

const AdminDashboard = () => {
    const token = useSelector(selectToken);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedRange, setSelectedRange] = useState('month');
    const [customRangeModalOpen, setCustomRangeModalOpen] = useState(false)
    const [draftCustomRange, setDraftCustomRange] = useState(undefined)
    const [customRange, setCustomRange] = useState(undefined)
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            setError("You must be logged in as an admin to load dashboard");
            return;
        }

        const loadDashboardData = async () => {
            try {
                const [fetchedOrders, notificationData] = await Promise.all([
                    fetchAdminOrders(token),
                    fetchAdminNotifications(token, { unreadOnly: true, limit: 10 }),
                ]);

                setOrders(fetchedOrders);
                setNotifications(notificationData.notifications);
                setUnreadCount(notificationData.unreadCount);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();

        const intervalId = setInterval(loadDashboardData, 30000);

        return () => clearInterval(intervalId);
    }, [token]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await markAdminNotificationAsRead(token, notificationId);

            setNotifications((currentNotifications) =>
                currentNotifications.filter(
                    (notification) => notification._id !== notificationId
                )
            );

            setUnreadCount((currentCount) => Math.max(currentCount - 1, 0));
        } catch (error) {
            setError(error.message);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAdminNotificationsAsRead(token);
            setNotifications([]);
            setUnreadCount(0);
        } catch (error) {
            setError(error.message);
        }
    };

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
            <Notifications
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
            />
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
