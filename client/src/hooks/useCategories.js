import { useEffect, useState } from 'react'
import { API_URL } from '../config/api.js'

export const useCategories = () => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await fetch(`${API_URL}/api/categories`)
                const data = await response.json()

                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'Failed to load categories')
                }

                setCategories(data.categories || [])
            } catch (error) {
                console.log('Could not fetch categories:', error)
                setError(error.message || 'Something went wrong loading categories')
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    return {
        categories,
        loading,
        error,
    }
}