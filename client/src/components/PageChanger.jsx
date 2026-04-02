import {useEffect} from "react";

const PageChanger = ({totalPages, currentPage, setCurrentPage}) => {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }, [currentPage])

    const handlePrev = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1))
    }
    const handleNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
    }
    return (
            <div className="flex items-center justify-center gap-4 mt-8">
                <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className="border px-4 py-2 rounded text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                <p className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                </p>

                <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="border px-4 py-2 rounded text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
    )
}
export default PageChanger
