import React, {useState} from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router'
import {Link} from "react-router-dom";


const NavBar = () => {
  const [visible,setVisible] = useState(false);
  return (
    <div className='flex items-center justify-between py-5 font-medium border-b-2 bg-white'>
      <img src={assets.Logo2} className='w-36' alt="Logo" />
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
        <div className='group relative'>
          <img src={assets.ProfileIcon} alt='profile icon' className='w-6 cursor-pointer'/>
          <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
            <div className='flex flex-col items-center gap-2 w-36 py-3 bg-slate-100 text-gray-500 rounded'>
              <p className='cursor-pointer hover:text-black'>My Profile</p>
              <p className='cursor-pointer hover:text-black'>Orders</p>
              <p className='cursor-pointer hover:text-black'>Logout</p>
            </div>
          </div>
        </div>
        <Link to='/cart' className='relative'>
          <img src={assets.CartIcon} alt='search icon' className='w-6 cursor-pointer' />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>1</p>
        </Link>
        <img onClick={()=>setVisible(true)} src={assets.MenuIcon} className='w-6 cursor-pointer sm:hidden' />
      </div>
    {/*  Sidebar Menu for small screens*/}
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
        <div className='flex flex-col text-gray-600'>
          <div onClick={()=>setVisible(false)} className='flex items-center gap-2 p-2 cursor-pointer'>
            <img className='h-6' src={assets.BackIcon} alt='back' />
            <p>Back</p>
          </div>
          <NavLink onClick={()=>setVisible(false)} to='/' className='py-2 pl-6 border'>Home</NavLink>
          <NavLink onClick={()=>setVisible(false)} to='/mens' className='py-2 pl-6 border'>Mens</NavLink>
          <NavLink onClick={()=>setVisible(false)} to='/womens' className='py-2 pl-6 border'>Womens</NavLink>
          <NavLink onClick={()=>setVisible(false)} to='/sale' className='py-2 pl-6 border'>Sale</NavLink>
        </div>
      </div>
    </div>
  )
}

export default NavBar