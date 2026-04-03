import React from 'react'

const InventoryModal = ({
                            open,
                            product,
                            inventoryDraft,
                            onClose,
                            onQuantityChange,
                            onSave,
                        }) => {
    if (!open || !product) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-3 text-sm text-gray-500 hover:text-black"
                >
                    ✕
                </button>

                <h2 className="text-xl font-medium mb-2">Restock Inventory</h2>
                <p className="text-sm text-gray-500 mb-4">{product.name}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {inventoryDraft.map((item) => (
                        <div key={item.size} className="flex flex-col gap-1">
                            <label className="text-sm font-medium">{item.size}</label>
                            <input
                                type="number"
                                min="0"
                                value={item.quantity}
                                onChange={(e) => onQuantityChange(item.size, e.target.value)}
                                className="border rounded px-3 py-2"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onSave}
                        className="bg-black text-white px-4 py-2 rounded text-sm"
                    >
                        Save Inventory
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="border px-4 py-2 rounded text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default InventoryModal