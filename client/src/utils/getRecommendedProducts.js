
export const getRecommendedProducts = (currentProduct, products, limit=4) => {
    if(!currentProduct || !products?.length) return []

    return products
        .filter((product) => product._id !== currentProduct._id)
        .map((product) => {
            let score = 0

            if (product.subcategory === currentProduct.subcategory) score += 5
            if (product.category === currentProduct.category) score += 3
            if (product.bestseller) score += 2

            const currentPrice = Number(currentProduct.price || 0)
            const productPrice = Number(product.price || 0)
            const priceDifference = Math.abs(currentPrice - productPrice)

            if (priceDifference <= 10) score += 1

            return { product, score }
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((item) => item.product)
}