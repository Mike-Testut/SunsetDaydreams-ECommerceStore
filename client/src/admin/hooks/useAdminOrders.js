import {useEffect, useState} from 'react'
import {fetchAdminOrders} from "../utils/fetchAdminOrders.js";
import {API_URL} from "../../config/api.js";

export const useAdminOrders = (token) => {
    const  [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [updatingOrderId, setUpdatingOrderId] = useState('')

    useEffect(() => {
        const loadOrders = async () => {
            try{
                setLoading(true)
                setError('')
                const fetchedOrders = await fetchAdminOrders(token)
                setOrders(fetchedOrders)
            }
            catch(error){
                console.log('Could not fetch admin orders:', error)
                setError(error.message || 'Something went wrong loading orders')
            } finally {
                setLoading(false)
            }
        }
        if(!token){
            setLoading(false)
            setError('You must be logged in as an administrator')
        }
        loadOrders()
    },[token])

    const handleStatusChange = async (orderId, newStatus) => {
        try{
            setUpdatingOrderId(orderId)
            setError('')

            const response = await fetch(`${API_URL}/api/order/admin/${orderId}/status`,{
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            })
            let data
            try {
                data = await response.json()
            } catch {
                throw new Error('Server returned an invalid response')
            }

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to update order status')
            }

            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            )
        } catch (error) {
            console.log('Could not update order status:', error)
            setError(error.message || 'Something went wrong updating the order')
        } finally {
            setUpdatingOrderId('')
        }
    }
    return {
        orders,
        loading,
        error,
        updatingOrderId,
        handleStatusChange,
    }
}


