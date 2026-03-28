import React, { useState } from 'react'
import {NavLink, Link, useNavigate} from 'react-router-dom'
import { useDispatch, useSelector} from 'react-redux'
import { assets } from '../assets/assets'
import { toggleShowSearch, selectCartCount } from '../redux/features/shopSlice'
import {logout, selectCurrentUser, selectIsAuthenticated} from "../redux/features/authSlice.js";

const NavBar = () => {
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const navigate = useNavigate()

  const cartCount = useSelector(selectCartCount)

  const handleLogout = () => {
    navigate('/',{replace: true})
    setTimeout(() => {
      dispatch(logout())
    }, 1)
  }


  return (
      <div className="flex items-center justify-between py-5 font-medium border-b-2 bg-white">
        <Link to="/">
          <img src={assets.Logo2} className="w-36" alt="Logo" />
        </Link>

        <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
          <NavLink to="/" className="flex flex-col items-center gap-1">
            <p className="hover:text-black">Home</p>
            <hr className="w-3/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>

          <NavLink to="/clothing/mens" className="flex flex-col items-center gap-1">
            <p className="hover:text-black">Mens</p>
            <hr className="w-3/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>

          <NavLink to="/clothing/womens" className="flex flex-col items-center gap-1">
            <p className="hover:text-black">Womens</p>
            <hr className="w-3/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>

          <NavLink to="/sale" className="flex flex-col items-center gap-1">
            <p className="hover:text-black">Sale</p>
            <hr className="w-3/4 border-none h-[1.5px] bg-gray-700 hidden" />
          </NavLink>
        </ul>

        <div className="flex items-center gap-6">
          {isAuthenticated ? <p>Hi, {user.name.split(" ")[0]}!</p>:<></>}
          <img
              onClick={() => dispatch(toggleShowSearch())}
              src={assets.SearchIcon}
              alt="search icon"
              className="w-5 cursor-pointer"
          />
          <div className="group relative">
            <Link to={isAuthenticated ? `/account/home` : `/account/login`}>
              <img src={assets.ProfileIcon} alt="profile icon" className="w-6 cursor-pointer" />
            </Link>
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50">
              <div className="flex flex-col items-center gap-2 w-36 py-3 bg-slate-100 text-gray-500 rounded">
                {isAuthenticated ?
                    <>
                      <button onClick={()=>navigate("/account/home")}>
                        <p className="cursor-pointer hover:text-black">My Profile</p>
                      </button>
                      <button onClick={()=>navigate("/account/orders")}>
                        <p className="cursor-pointer hover:text-black">Orders</p>
                      </button>
                      <button onClick={handleLogout}>
                        <p className="cursor-pointer hover:text-black">Logout</p>
                      </button>

                    </>
                  :
                    <Link to={'/account/login'} >
                      <p className="cursor-pointer hover:text-black">Log In</p>
                    </Link>
                }
              </div>
            </div>
          </div>

          <Link to="/cart" className="relative">
            <img src={assets.CartIcon} alt="cart icon" className="w-6 cursor-pointer" />
            <p className="absolute -right-1.25 -bottom-1.25 w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {cartCount}
            </p>
          </Link>

          <img
              onClick={() => setVisible(true)}
              src={assets.MenuIcon}
              className="w-6 cursor-pointer sm:hidden"
              alt="menu"
          />
        </div>

        <div
            className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
                visible ? 'w-full' : 'w-0'
            }`}
        >
          <div className="flex flex-col text-gray-600">
            <div onClick={() => setVisible(false)} className="flex items-center gap-2 p-2 cursor-pointer">
              <img className="h-6" src={assets.BackIcon} alt="back" />
              <p>Back</p>
            </div>
            <NavLink onClick={() => setVisible(false)} to="/" className="py-2 pl-6 border">
              Home
            </NavLink>
            <NavLink onClick={() => setVisible(false)} to="/clothing/mens" className="py-2 pl-6 border">
              Mens
            </NavLink>
            <NavLink onClick={() => setVisible(false)} to="/clothing/womens" className="py-2 pl-6 border">
              Womens
            </NavLink>
            <NavLink onClick={() => setVisible(false)} to="/sale" className="py-2 pl-6 border">
              Sale
            </NavLink>
          </div>
        </div>
      </div>
  )
}

export default NavBar