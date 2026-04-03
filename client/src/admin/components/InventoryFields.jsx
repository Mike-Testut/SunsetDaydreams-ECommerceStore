import React from "react";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

const InventoryFields = ({ inventory = [], setFormData }) => {
    const getQuantity = (size) => {
        const item = inventory.find((entry) => entry.size === size);
        return item ? item.quantity : 0;
    };

    const handleQuantityChange = (size, value) => {
        const parsedValue = Math.max(0, Number(value) || 0);

        setFormData((prev) => {
            const existingInventory = prev.inventory || [];
            const existingItem = existingInventory.find((item) => item.size === size);

            let updatedInventory;

            if (existingItem) {
                updatedInventory = existingInventory.map((item) =>
                    item.size === size
                        ? { ...item, quantity: parsedValue }
                        : item
                );
            } else {
                updatedInventory = [
                    ...existingInventory,
                    { size, quantity: parsedValue },
                ];
            }

            return {
                ...prev,
                inventory: updatedInventory,
            };
        });
    };

    return (
        <div className="flex flex-col gap-3">
            <label className="text-sm font-medium">Inventory by Size</label>

            <div className="flex">
                {SIZE_OPTIONS.map((size) => (
                    <div key={size} className=" p-3 flex flex-col gap-2 text-center">
                        <p className="text-sm font-medium">{size}</p>
                        <input
                            type="number"
                            min="0"
                            max="9999"
                            value={getQuantity(size)}
                            onChange={(e) => handleQuantityChange(size, e.target.value)}
                            className="border border-gray-300 rounded px-1 w-fit"
                            placeholder="0"
                        />
                    </div>
                ))}
            </div>

            <p className="text-xs text-gray-500">
                Set quantity to 0 for sold out sizes.
            </p>
        </div>
    );
};

export default InventoryFields;