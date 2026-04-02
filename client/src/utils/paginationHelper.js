import {useMemo} from "react";

export const usePagination = (items, itemsPerPage,currentPage) => {
    const totalPages = Math.ceil(items.length / itemsPerPage)
    const paginatedItems = useMemo(()=>{
        const startIndex = (currentPage -1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage

        return items.slice(startIndex, endIndex)
    },[currentPage, itemsPerPage, items])
    return {totalPages, paginatedItems}
}