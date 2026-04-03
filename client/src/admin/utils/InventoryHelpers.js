export const DEFAULT_INVENTORY = [
    { size: "XS", quantity: 0 },
    { size: "S", quantity: 0 },
    { size: "M", quantity: 0 },
    { size: "L", quantity: 0 },
    { size: "XL", quantity: 0 },
    { size: "XXL", quantity: 0 },
];

export const getTotalStock =(inventory=[])=>{
    return inventory.reduce((sum, item)=>sum+item.quantity,0)
}