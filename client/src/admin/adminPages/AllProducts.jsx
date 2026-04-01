import React, {useEffect, useMemo, useState} from 'react'
import {selectToken} from "../../redux/features/authSlice.js";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {API_URL} from "../../config/api.js";

const AllProducts = () => {
    const token = useSelector(selectToken)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [deletingProductID, setDeletingProductID] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [categoryFilter, setCategoryFilter] = useState('All')
    const [subCategoryFilter, setSubCategoryFilter] = useState('All')

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

        return products.filter((product) => {
            const matchesSearch =
                !normalizedSearch ||
                product.name?.toLowerCase().includes(normalizedSearch) ||
                product.category?.toLowerCase().includes(normalizedSearch) ||
                product.subCategory?.toLowerCase().includes(normalizedSearch)

            const matchesCategory =
                categoryFilter === 'All' || product.category === categoryFilter

            const matchesSubCategory =
                subCategoryFilter === 'All' || product.subCategory === subCategoryFilter

            return matchesSearch && matchesCategory && matchesSubCategory
        })
    }, [products, searchTerm, categoryFilter, subCategoryFilter])

    useEffect(() => {
        const fetchProducts = async () => {
            try{
                const response = await fetch(`${API_URL}/api/products/all`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })
                let data
                try{
                    data = await response.json()
                } catch{
                    setError('Server returned invalid response')
                }
                if(!response.ok || !data.success){
                    setError("Failed to fetch products")
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
    },[token])

    const handleDeleteProduct = async (productId) => {
        const confirmed = window.confirm("Are you sure you want to delete this product?")
        if(!confirmed) return
        try{
            setDeletingProductID(productId)

            const response = await fetch(`{API_URL}/api/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
            let data
            try{
                data = await response.json()
            } catch{
                setError('Server returned invalid response')
            }
            if(!response.ok || !data.success){
                setError("Failed to delete product")
            }
            setProducts((prev)=>prev.filter(product => product.id !== productId))
        } catch(error){
            console.log(error)
            setError("Something went wrong deleting product")
        } finally {
            setDeletingProductID("")
        }
    }

    if (loading) {
        return <div className="p-6">Loading products...</div>
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>
    }

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h1 className="text-2xl font-medium">Products</h1>

                <Link
                    to="/admin/addproduct"
                    className="border px-4 py-2 rounded text-sm hover:bg-black hover:text-white transition"
                >
                    Add Product
                </Link>
            </div>

            <div className="mb-6 flex flex-col lg:flex-row gap-4">
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
                            Category - {category}
                        </option>
                    ))}
                </select>

                <select
                    value={subCategoryFilter}
                    onChange={(e) => setSubCategoryFilter(e.target.value)}
                    className="border rounded px-3 py-2 text-sm w-full lg:w-52"
                >
                    {subCategoryOptions.map((subCategory) => (
                        <option key={subCategory} value={subCategory}>
                            Subcategory - {subCategory}
                        </option>
                    ))}
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
                    {filteredProducts.map((product) => (
                        <div
                            key={product._id}
                            className="border rounded-lg p-4 bg-white shadow-sm flex flex-col md:flex-row md:items-center gap-4"
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
                                <p className="text-xs text-gray-500 mt-1">
                                    Sizes: {product.sizes?.join(', ') || '-'}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    className="border px-4 py-2 rounded text-sm hover:bg-gray-100 transition"
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDeleteProduct(product._id)}
                                    disabled={deletingProductID === product._id}
                                    className="border border-red-500 text-red-500 px-4 py-2 rounded text-sm hover:bg-red-500 hover:text-white transition disabled:opacity-50"
                                >
                                    {deletingProductID === product._id ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
export default AllProducts
