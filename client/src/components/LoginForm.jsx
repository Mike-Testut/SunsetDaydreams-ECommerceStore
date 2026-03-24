import React from 'react'


const LoginForm = (loginOrSignUp) => {

    return (
        <form className='w-full flex flex-col gap-4 items-center '>
            <input placeholder='name' className='border border-gray-300 rounded py-2.5 px-3.5 w-1/3 col-span-2' />
            <input placeholder='email' className='border border-gray-300 rounded py-2.5 px-3.5 w-1/3 col-span-2' />
            <input placeholder='password' className='border border-gray-300 rounded py-2.5 px-3.5 w-1/3 col-span-2' />
            <input placeholder='confirm password' className='border border-gray-300 rounded py-2.5 px-3.5 w-1/3 col-span-2' />
            <button className='border-black border py-2 px-8 hover:bg-black hover:text-white ease-in-out cursor-pointer'>Login</button>
        </form>
    )
}
export default LoginForm
