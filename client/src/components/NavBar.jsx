import React from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router'


const NavBar = () => {
  return (
    <div className='flex items-center justify-between py-5 font-medium border-b-2 bg-white'>
      <img src={assets.Logo} className='w-36' alt="Logo" />
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1'>
          <p className='hover:text-black'>Home</p>
          <hr className='w-3/4 border-none h-[1.5px] bg-gray-700 hidden'></hr>
        </NavLink>
        <NavLink to='/mens' className='flex flex-col items-center gap-1'>
          <p className='hover:text-black'>Mens</p>
          <hr className='w-3/4 border-none h-[1.5px] bg-gray-700 hidden'></hr>
        </NavLink>
        <NavLink to='/womens' className='flex flex-col items-center gap-1'>
          <p className='hover:text-black'>Womens</p>
          <hr className='w-3/4 border-none h-[1.5px] bg-gray-700 hidden' ></hr>
        </NavLink>
        <NavLink to='/sale' className='flex flex-col items-center gap-1'>
          <p className='hover:text-black'>SALE</p>
          <hr className='w-3/4 border-none h-[1.5px] bg-gray-700 hidden' ></hr>
        </NavLink>
      </ul>
      <div className='flex items-center gap-6'>
        <img src={assets.SearchIcon} alt='search icon' className='w-5 cursor-pointer' />
        <img src={assets.CartIcon} alt='search icon' className='w-5 cursor-pointer' />
        
      </div>
    </div>
  )
}

export default NavBar