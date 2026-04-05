import React from 'react'
import {DayPicker} from "react-day-picker";
import 'react-day-picker/dist/style.css'

const formatRangeLabel = (range) => {
    if(!range?.from && !range?.to) return "No range selected"
    if (range?.from && !range?.to) return range.from.toLocaleDateString()
    return `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
}

const CustomDateRangeModal = ({
                                  open,
                                  range,
                                  onChange,
                                  onApply,
                                  onClose,
                              }) => {
    if(!open) return null
    const canApply = !!range?.from && !!range?.to

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
             onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 relative"
                 onClick={(e) => e.stopPropagation()}
                 >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-3 text-sm text-gray-500 hover:text-black"
                >
                    x
                </button>
                <h2 className="text-xl font-medium mb-2">Select Custom Date Range</h2>
                <p className="text-sm text-gray-500 mb-4">{formatRangeLabel(range)}</p>
                <div className="flex justify-center">
                    <DayPicker
                        mode="range"
                        selected={range}
                        onSelect={onChange}
                        numberOfMonths={2}
                    />
                </div>
                <div className="flex gap-3 mt-6 justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="border px-4 py-2 rounded text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onApply}
                        disabled={!canApply}
                        className="bg-black text-white px-4 py-2 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        Apply Range
                    </button>
                </div>
            </div>

        </div>
    )
}
export default CustomDateRangeModal
