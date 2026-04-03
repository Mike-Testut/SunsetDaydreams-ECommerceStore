const sortMap = {
    'oldest': (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    'newest': (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    'price-low': (a, b) => a.price - b.price,
    'price-high': (a, b) => b.price - a.price,
    'name-asc': (a, b) => (a.name || '').localeCompare(b.name || ''),
    'name-desc': (a, b) => (b.name || '').localeCompare(a.name || ''),
}

export const sortProducts = (products = [], sortOption = 'newest') => {
    const sorted = [...products]
    const sorter = sortMap[sortOption] || sortMap['newest']
    return sorted.sort(sorter)
}