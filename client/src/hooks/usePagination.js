import {useCallback, useEffect, useMemo, useState} from "react";

export const usePagination = (items, itemsPerPage=10) => {
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage))

    useEffect(() => {
        if(currentPage > totalPages) {
            setCurrentPage(totalPages)
        }
    },[currentPage, totalPages])

    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return items.slice(startIndex, startIndex + itemsPerPage)
    }, [items, itemsPerPage, currentPage])


    const goToPage = useCallback((page) => {
        if (page < 1 || page > totalPages) return
        setCurrentPage(page)
    }, [totalPages])

    const nextPage = useCallback(() => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    }, [totalPages])

    const prevPage = useCallback(() => {
        setCurrentPage((prev) => Math.max(prev - 1, 1))
    }, [])

    const resetPage = useCallback(() => {
        setCurrentPage(1)
    }, [])

    return {
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedItems,
        goToPage,
        nextPage,
        prevPage,
        resetPage,
    }
}