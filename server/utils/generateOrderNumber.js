export const generateOrderNumber = () => {
    const timestampPart = Date.now().toString().slice(-8)
    const randomPart = Math.floor(1000 + Math.random() * 9000)
    return `SD-${timestampPart}-${randomPart}`
}