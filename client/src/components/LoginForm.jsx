import React from 'react'
import {Link, useNavigate} from "react-router-dom";


const LoginForm = ({formType}) => {
    
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        switch(formType){
            case "login":
                e.preventDefault();
                navigate("/account/home")
                break
            case "signup":
                e.preventDefault();
                return
        }
    }

    return (
        <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4 items-center '>
            {
                formType === "signup" &&
                (<input required placeholder='name' className='border border-gray-300 rounded py-2.5 px-3.5 w-1/3 col-span-2' />)
            }
            <input required type='email' placeholder='email' className='border border-gray-300 rounded py-2.5 px-3.5 w-1/3 col-span-2' />
            <input required type='password' placeholder='password' className='border border-gray-300 rounded py-2.5 px-3.5 w-1/3 col-span-2' />
            {
                formType === "signup" &&
                <input required type='password' placeholder='confirm password' className='border border-gray-300 rounded py-2.5 px-3.5 w-1/3 col-span-2' />
            }
            {
                formType === "login" &&
                <Link to="/login" className='w-1/3 underline text-gray-500 text-xs text-end hover:text-black '>Forgot Password?</Link>
            }
            <button type='submit' className='border-black border py-2 px-8 hover:bg-black hover:text-white ease-in-out cursor-pointer'>
                {formType === "login" ? 'Log in' : 'Sign Up'}
            </button>
        </form>
    )
}
export default LoginForm
