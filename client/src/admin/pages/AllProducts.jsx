import React, { useEffect, useMemo, useState } from 'react'
import { selectToken } from "../../redux/features/authSlice.js"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { API_URL } from "../../config/api.js"
import { usePagination } from "../../hooks/usePagination.js"
import PageChanger from "../../components/PageChanger.jsx"
import { sortProducts } from "../../utils/sortProducts.js"
import InventoryModal from "../components/InventoryModal.jsx"

const AllProducts = () => {
    const token = useSelector(selectToken)
    const navigate = useNavigate()

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [deletingProductID, setDeletingProductID] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState('All')
    const [subCategoryFilter, setSubCategoryFilter] = useState('All')
    const [sortOption, setSortOption] = useState('newest')
    const [inventoryModalOpen, setInventoryModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [inventoryDraft, setInventoryDraft] = useState([])
    const [savingInventory, setSavingInventory] = useState(false)

    const productsPerPage = 10

    const openInventoryModal = (product) => {
        setSelectedProduct(product)
        setInventoryDraft(product.inventory || [])
        setInventoryModalOpen(true)
    }

    const closeInventoryModal = () => {
        setInventoryModalOpen(false)
        setSelectedProduct(null)
        setInventoryDraft([])
    }

    const updateDraftQuantity = (size, value) => {
        const parsedValue = Math.max(0, Number(value) || 0)

        setInventoryDraft((prev) =>
            prev.map((item) =>
                item.size === size
                    ? { ...item, quantity: parsedValue }
                    : item
            )
        )
    }

    const handleSaveInventory = async (product) => {
        try {
            setSavingInventory(true)

            const response = await fetch(`${API_URL}/api/products/update/${product._id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: (() => {
                    const payload = new FormData()
                    payload.append('name', product.name)
                    payload.append('description', product.description)
                    payload.append('price', product.price)
                    payload.append('category', product.category)
                    payload.append('subcategory', product.subcategory)
                    payload.append('inventory', JSON.stringify(inventoryDraft))
                    payload.append('bestseller', String(product.bestseller))
                    payload.append('existingImages', JSON.stringify(product.images || []))
                    return payload
                })(),
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                setError(data.message || 'Failed to update inventory')
                return
            }

            setProducts((prev) =>
                prev.map((item) =>
                    item._id === product._id ? data.product : item
                )
            )

            closeInventoryModal()
        } catch (error) {
            console.log(error)
            setError('Something went wrong updating inventory')
        } finally {
            setSavingInventory(false)
        }
    }

    const getTotalStock = (inventory = []) => {
        return inventory.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
    }

    const getInventoryDisplay = (inventory = []) => {
        if (!inventory.length) return '-'

        return inventory
            .map((item) => `${item.size}: ${item.quantity}`)
            .join(' | ')
    }

    const categoryOptions = useMemo(() => {
        const categories = products
            .map((product) => product.category)
            .filter(Boolean)

        return ['All', ...new Set(categories)]
    }, [products])

    const subCategoryOptions = useMemo(() => {
        const filteredProducts =
            categoryFilter === 'All'
                ? products
                : products.filter((product) => product.category === categoryFilter)

        const subCategories = filteredProducts
            .map((product) => product.subcategory)
            .filter(Boolean)

        return ['All', ...new Set(subCategories)]
    }, [products, categoryFilter])

    useEffect(() => {
        setSubCategoryFilter('All')
    }, [categoryFilter])

    const filteredProducts = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase()

        const result = products.filter((product) => {
            const matchesSearch =
                !normalizedSearch ||
                product.name?.toLowerCase().includes(normalizedSearch) ||
                product.category?.toLowerCase().includes(normalizedSearch) ||
                product.subcategory?.toLowerCase().includes(normalizedSearch)

            const matchesCategory =
                categoryFilter === 'All' || product.category === categoryFilter

            const matchesSubCategory =
                subCategoryFilter === 'All' || product.subcategory === subCategoryFilter

            return matchesSearch && matchesCategory && matchesSubCategory
        })

        return sortProducts(result, sortOption)
    }, [products, searchTerm, categoryFilter, subCategoryFilter, sortOption])

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/api/products/all`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })

                let data
                try {
                    data = await response.json()
                } catch {
                    setError('Server returned invalid response')
                    return
                }

                if (!response.ok || !data.success) {
                    setError("Failed to fetch products")
                    return
                }

                setProducts(data.products || [])
            } catch (error) {
                console.log(error)
                setError('Something went wrong loading products')
            } finally {
                setLoading(false)
            }
        }

        if (!token) {
            setLoading(false)
            setError('You must be logged in as an admin')
            return
        }

        fetchProducts()
    }, [token])

    const handleDeleteProduct = async (productId) => {
        const confirmed = window.confirm('Are you sure you want to delete this product?')
        if (!confirmed) return

        try {
            setDeletingProductID(productId)

            const response = await fetch(`${API_URL}/api/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await response.json()

            if (!response.ok || !data.success) {
                setError(data.message || 'Failed to delete product')
                return
            }

            setProducts((prev) => prev.filter((product) => product._id !== productId))
        } catch (error) {
            console.log('Could not delete product:', error)
            setError('Something went wrong deleting the product')
        } finally {
            setDeletingProductID('')
        }
    }

    const {
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedItems,
        resetPage,
    } = usePagination(filteredProducts, productsPerPage)

    useEffect(() => {
        resetPage()
    }, [searchTerm, categoryFilter, subCategoryFilter, sortOption, resetPage])

    if (loading) {
        return <div className="p-6">Loading products...</div>
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>
    }

    return (
        <div className="w-full max-w-7xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-medium">Products</h1>

                <Link
                    to="/admin/addproduct"
                    className="border px-4 py-2 rounded text-sm hover:bg-black hover:text-white transition w-full sm:w-auto text-center"
                >
                    Add Product
                </Link>
            </div>

            <div className="mb-5 sm:mb-6 flex flex-col xl:flex-row gap-3">
                <input
                    type="text"
                    placeholder="Search by name, category, or subcategory"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border rounded px-3 py-2 text-sm w-full lg:w-96"
                />

                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="border rounded px-3 py-2 text-sm w-full lg:w-52"
                >
                    {categoryOptions.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <select
                    value={subCategoryFilter}
                    onChange={(e) => setSubCategoryFilter(e.target.value)}
                    className="border rounded px-3 py-2 text-sm w-full lg:w-52"
                >
                    {subCategoryOptions.map((subcategory) => (
                        <option key={subcategory} value={subcategory}>
                            {subcategory}
                        </option>
                    ))}
                </select>

                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="border rounded px-3 py-2 text-sm w-full lg:w-52"
                >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                </select>
            </div>

            <p className="text-sm text-gray-500 mb-4">
                Showing {filteredProducts.length} of {products.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>

            {filteredProducts.length === 0 ? (
                <div className="border rounded-lg p-6 bg-white text-gray-600">
                    No products found.
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {paginatedItems.map((product) => {
                        const totalStock = getTotalStock(product.inventory)

                        return (
                            <div
                                key={product._id}
                                className="border rounded-lg p-4 bg-white shadow-sm flex flex-col sm:flex-row gap-4"
                            >
                                <img
                                    src={product.images?.[0]}
                                    alt={product.name}
                                    className="w-24 h-24 object-cover rounded border"
                                />

                                <div className="flex-1">
                                    <p className="font-medium text-lg">{product.name}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {product.category} · {product.subcategory}
                                    </p>
                                    <p className="text-sm text-gray-700 mt-2">${product.price?.toFixed(2)}</p>
                                    <p
                                        className={`text-sm font-medium mt-2 ${
                                            totalStock === 0 ? 'text-red-500' : 'text-green-600'
                                        }`}
                                    >
                                        {totalStock === 0 ? 'Out of Stock' : `In Stock (${totalStock})`}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Inventory: {getInventoryDisplay(product.inventory)}
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 sm:self-start">
                                    <button
                                        type="button"
                                        onClick={() => openInventoryModal(product)}
                                        className="border px-4 py-2 rounded text-sm hover:bg-gray-100 transition w-full sm:w-auto"
                                    >
                                        Restock
                                    </button>

                                    <button
                                        type="button"
                                        className="border px-4 py-2 rounded text-sm hover:bg-gray-100 transition cursor-pointer w-full sm:w-auto"
                                        onClick={() => navigate(`/admin/products/${product._id}`)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDeleteProduct(product._id)}
                                        disabled={deletingProductID === product._id}
                                        className="border border-red-500 text-red-500 px-4 py-2 rounded text-sm hover:bg-red-500 hover:text-white transition cursor-pointer disabled:opacity-50 w-full sm:w-auto"
                                    >
                                        {deletingProductID === product._id ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        )
                    })}

                    {totalPages > 1 && (
                        <PageChanger
                            totalPages={totalPages}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    )}
                </div>
            )}

            <InventoryModal
                open={inventoryModalOpen}
                product={selectedProduct}
                inventoryDraft={inventoryDraft}
                onClose={closeInventoryModal}
                onQuantityChange={updateDraftQuantity}
                onSave={() => handleSaveInventory(selectedProduct)}
                saving={savingInventory}
            />
        </div>
    )
}

export default AllProducts