export const isSameDay = (dateA, dateB) => {
    const a = new Date(dateA)
    const b = new Date(dateB)

    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    )
}

export const isSameWeek = (dateA, dateB) => {
    const a = new Date(dateA)
    const b = new Date(dateB)

    const startOfWeek = new Date(b)
    const day = startOfWeek.getDay()
    const diff = day === 0 ? 6 : day - 1
    startOfWeek.setDate(startOfWeek.getDate() - diff)
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(endOfWeek.getDate() + 7)

    return a >= startOfWeek && a < endOfWeek
}

export const isSameMonth = (dateA, dateB) => {
    const a = new Date(dateA)
    const b = new Date(dateB)

    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth()
    )
}

export const isSameYear = (dateA, dateB) => {
    const a = new Date(dateA)
    const b = new Date(dateB)

    return a.getFullYear() === b.getFullYear()
}

export const isWithinCustomRange = (date, range) => {
    if (!range?.from || !range?.to) return false

    const current = new Date(date)
    const from = new Date(range.from)
    const to = new Date(range.to)

    from.setHours(0, 0, 0, 0)
    to.setHours(23, 59, 59, 999)

    return current >= from && current <= to
}

export const filterOrdersByRange = (orders = [], range = 'month', customRange) => {
    const now = new Date()

    return orders.filter((order) => {
        if (order.status === 'Cancelled') return false
        if (!order.createdAt) return false

        switch (range) {
            case 'day':
                return isSameDay(order.createdAt, now)
            case 'week':
                return isSameWeek(order.createdAt, now)
            case 'year':
                return isSameYear(order.createdAt, now)
            case 'custom':
                return isWithinCustomRange(order.createdAt, customRange)
            case 'month':
            default:
                return isSameMonth(order.createdAt, now)
        }
    })
}

export const getRevenueStats = (orders = []) => {
    const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0)
    const orderCount = orders.length
    const averageOrderValue = orderCount > 0 ? revenue / orderCount : 0

    return {
        revenue,
        orderCount,
        averageOrderValue,
    }
}