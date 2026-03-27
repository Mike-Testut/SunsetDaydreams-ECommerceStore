import React, {useState} from 'react'
import {Link, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setCredentials} from "../redux/features/authSlice.js";
import { API_URL } from '../config/api'


const LoginForm = ({formType, onSuccess }) => {
    const dispatch = useDispatch();
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        name:'',
        email:'',
        password:'',
        confirmPassword:'',
    })

    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')
        setLoading(true)

        try{
            const endpoint =
                formType === 'login'
                    ? `${API_URL}/api/user/login`
                    : `${API_URL}/api/user/register`
            const payload =
                formType === "login"
                    ? {
                        email: formData.email,
                        password: formData.password,
                    }
                    : {
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                        confirmPassword: formData.confirmPassword,
                    }
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            const data = await response.json();

            if (!response.ok || !data.success) {
                setError(data.message || data.error || 'Authentication failed')
                setLoading(false)
                return
            }

            if (!data.token || !data.user) {
                setError('Invalid server response')
                setLoading(false)
                return
            }
            dispatch(
                setCredentials({
                    token: data.token,
                    user: data.user,
                })
            )
            if (onSuccess) {
                onSuccess()
            }
            navigate('/account/home')

        } catch(error){
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4 items-center '>
            {
            formType === "signup" && (
                <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder='name'
                    className='border border-gray-300 rounded py-2.5 px-3.5 w-1/3 col-span-2'
                />
            )}
            <input
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                type='email'
                placeholder='email'
                className='border border-gray-300 rounded py-2.5 px-3.5 w-1/3 col-span-2'
            />
            <input
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
                type='password'
                placeholder='password'
                className='border border-gray-300 rounded py-2.5 px-3.5 w-1/3 col-span-2'
            />
            {
                formType === "signup" &&
                <input
                    required
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    type='password'
                    placeholder='confirm password'
                    className='border border-gray-300 rounded py-2.5 px-3.5 w-1/3 col-span-2'
                />
            }
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {
                formType === "login" &&
                <Link to="/login" className='w-1/3 underline text-gray-500 text-xs text-end hover:text-black '>Forgot Password?</Link>
            }
            <button type='submit' className='border-black border py-2 px-8 hover:bg-black hover:text-white ease-in-out cursor-pointer'>
                {loading ? 'Loading...' : formType === 'login' ? 'Log In' : 'Sign Up'}
            </button>
        </form>
    )
}
export default LoginForm
