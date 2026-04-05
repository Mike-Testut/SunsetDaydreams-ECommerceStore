import React from 'react'

const RANGE_LABELS = {
    day: 'Today',
    week: 'This Week',
    month: 'This Month',
    year: 'This Year',
    custom: 'Custom Dates'
}
const formatCustomRange = (range) => {
    if(!range?.from || !range?.to) return 'Choose date range'
    return `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
}

const RevenueCard = ({
                         selectedRange,
                         setSelectedRange,
                         revenue,
                         orderCount,
                         averageOrderValue,
                         onOpenCustomRange,
                         customRange
                     }) => {
        const tabs = ['day', 'week', 'month', 'year']
    return (
        <div className="border rounded-xl bg-white shadow-sm p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                <div>
                    <h2 className="text-lg font-medium">Revenue</h2>
                    <p className="text-sm text-gray-500">
                        {selectedRange === 'custom'
                            ? formatCustomRange(customRange)
                            : RANGE_LABELS[selectedRange]}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {tabs.map((tab)=>(
                        <button
                        key={tab}
                        type="button"
                        onClick={() => setSelectedRange(tab)}
                        className={`px-3 py-1.5 rounded text-sm border transition ${selectedRange === tab ? 
                            'bg-black text-white border-black' :
                            'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }` }
                        >
                            {RANGE_LABELS[tab]}
                        </button>
                        ))}
                    <button
                        type="button"
                        onClick={onOpenCustomRange}
                        className={`px-3 py-1.5 rounded text-sm border transition ${
                            selectedRange === 'custom'
                                ? 'bg-black text-white border-black'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                    >
                        Custom Range
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Revenue</p>
                    <p className="text-2xl font-semibold">${revenue.toFixed(2)}</p>
                </div>

                <div className="border rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Orders</p>
                    <p className="text-2xl font-semibold">{orderCount}</p>
                </div>

                <div className="border rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Avg Order Value</p>
                    <p className="text-2xl font-semibold">${averageOrderValue.toFixed(2)}</p>
                </div>
            </div>
        </div>
    )
}
export default RevenueCard
