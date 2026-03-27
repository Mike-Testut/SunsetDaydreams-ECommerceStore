import React from 'react'
import {Link, useLocation, useNavigate} from "react-router-dom";
import LoginForm from "../components/LoginForm.jsx";
import Title from "../components/Title.jsx";
import {assets} from "../assets/assets.js";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/account/home'

    return (
        <div className="flex flex-col items-center  ">
            <div className='text-center py-8 text-3xl'>
                <Title text1='Login'/>
            </div>
            <div className='text-center pb-5 text-xl'>
                <p>Login and get rewarded</p>
                <div className='flex gap-5 text-sm my-5'>
                    <div className='max-w-25'>
                        <img src={assets.loyalty_points} alt='loyalty points' className='w-14 justify-self-center mb-2' />
                        <p>points on every purchase</p>
                    </div>
                    <div className='max-w-25'>
                        <img src={assets.loyalty_bday} alt='birthday rewards' className='w-14 justify-self-center mb-2' />
                        <p>exclusive birthday rewards</p>
                    </div>
                    <div className='max-w-25 '>
                        <img src={assets.loyalty_shipping} alt='shipping rewards' className='w-14 justify-self-center mb-2' />
                        <p>expedited shipping</p>
                    </div>
                </div>
            </div>
            <LoginForm formType = 'login' onSuccess={() => navigate(from, { replace: true })}/>
            <div className='text-center py-8'>
                <Link to="/account/signup" className='underline hover:font-semibold'>No Account? Sign Up Here</Link>
            </div>
        </div>
    )
}
export default Login
