import React from 'react'

const AdminStatsCards = ({
  summaryStats,
  statusFilter,
  setStatusFilter,
}) => {
    const getStatCardClasses = (filterValue) => {
        const isActive = statusFilter === filterValue

        if (!isActive) {
            switch (filterValue) {
                case 'Order Placed':
                    return 'border rounded-lg p-4 shadow-sm text-left transition cursor-pointer bg-white' +
                        ' text-gray-800 border-gray-300'

                case 'Processing':
                    return 'border rounded-lg p-4 shadow-sm text-left transition cursor-pointer bg-white' +
                        ' text-blue-800 border-blue-300'

                case 'Shipped':
                    return 'border rounded-lg p-4 shadow-sm text-left transition cursor-pointer bg-white' +
                        ' text-purple-800 border-purple-300'

                case 'Delivered':
                    return 'border rounded-lg p-4 shadow-sm text-left transition cursor-pointer' +
                        ' bg-white text-green-800 border-green-300'

                case 'Cancelled':
                    return 'border rounded-lg p-4 shadow-sm text-left transition cursor-pointer bg-white text-red-800' +
                        ' border-red-300'

                case 'All':
                default:
                    return 'border rounded-lg p-4 shadow-sm text-left transition cursor-pointer bg-white text-gray-900 hover:border-black'
            }
        }

        switch (filterValue) {
            case 'Order Placed':
                return 'border rounded-lg p-4 shadow-sm text-left transition cursor-pointer bg-gray-300' +
                    ' text-gray-800 border-gray-400'

            case 'Processing':
                return 'border rounded-lg p-4 shadow-sm text-left transition cursor-pointer bg-blue-100' +
                    ' text-blue-800 border-blue-400'

            case 'Shipped':
                return 'border rounded-lg p-4 shadow-sm text-left transition cursor-pointer bg-purple-100' +
                    ' text-purple-800 border-purple-400'

            case 'Delivered':
                return 'border rounded-lg p-4 shadow-sm text-left transition cursor-pointer bg-green-100' +
                    ' text-green-800 border-green-400'

            case 'Cancelled':
                return 'border rounded-lg p-4 shadow-sm text-left transition cursor-pointer bg-red-100 text-red-800' +
                    ' border-red-400'

            case 'All':
            default:
                return 'border rounded-lg p-4 shadow-sm text-left transition cursor-pointer bg-black text-white border-black'
        }
    }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <button
        type="button"
        onClick={() => setStatusFilter('All')}
        className={getStatCardClasses('All')}
      >
        <p className="text-sm opacity-70">Total Orders</p>
        <p className="text-2xl font-medium mt-1">{summaryStats.total}</p>
      </button>

      <button
        type="button"
        onClick={() => setStatusFilter('Order Placed')}
        className={getStatCardClasses('Order Placed')}
      >
        <p className="text-sm opacity-70">Order Placed</p>
        <p className="text-2xl font-medium mt-1">{summaryStats.orderPlaced}</p>
      </button>

      <button
        type="button"
        onClick={() => setStatusFilter('Processing')}
        className={getStatCardClasses('Processing')}
      >
        <p className="text-sm opacity-70">Processing</p>
        <p className="text-2xl font-medium mt-1">{summaryStats.processing}</p>
      </button>

      <button
        type="button"
        onClick={() => setStatusFilter('Shipped')}
        className={getStatCardClasses('Shipped')}
      >
        <p className="text-sm opacity-70">Shipped</p>
        <p className="text-2xl font-medium mt-1">{summaryStats.shipped}</p>
      </button>

      <button
        type="button"
        onClick={() => setStatusFilter('Delivered')}
        className={getStatCardClasses('Delivered')}
      >
        <p className="text-sm opacity-70">Delivered</p>
        <p className="text-2xl font-medium mt-1">{summaryStats.delivered}</p>
      </button>

      <button
        type="button"
        onClick={() => setStatusFilter('Cancelled')}
        className={getStatCardClasses('Cancelled')}
      >
        <p className="text-sm opacity-70">Cancelled</p>
        <p className="text-2xl font-medium mt-1">{summaryStats.cancelled}</p>
      </button>
    </div>
  )
}

export default AdminStatsCards