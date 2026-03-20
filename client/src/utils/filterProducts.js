
export const filterProducts = (products,query) => {
    const normalizedQuery = query.trim().toLowerCase();

    if(!normalizedQuery) return [];

    return products.filter((item)=> {
        const nameMatch = item.name.toLowerCase().includes(normalizedQuery);
        const descriptionMatch = item.description.toLowerCase().includes(normalizedQuery);
        const categoryMatch = item.category.toLowerCase().includes(normalizedQuery);
        const subcategoryMatch = item.subcategory.toLowerCase().includes(normalizedQuery);
        return nameMatch || descriptionMatch || categoryMatch || subcategoryMatch;
    })

}