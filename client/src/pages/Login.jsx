import React from 'react'
import {Link} from "react-router-dom";
import LoginForm from "../components/LoginForm.jsx";
import Title from "../components/Title.jsx";

const Login = () => {
    return (
        <div className="flex flex-col items-center">
            <div className='text-center py-8 text-3xl'>
                <Title text1='Login'/>
            </div>
            <LoginForm loginOrSignUp = 'login'/>
            <div className='text-center py-8'>
                <Link to="/account/signup" className='underline'>No Account? Sign Up Here</Link>
            </div>
        </div>
    )
}
export default Login
