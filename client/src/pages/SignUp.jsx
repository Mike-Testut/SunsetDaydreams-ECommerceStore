import React from 'react'
import Title from "../components/Title.jsx";
import LoginForm from "../components/LoginForm.jsx";
import {Link} from "react-router-dom";

const SignUp = () => {
    return (
        <div className="flex flex-col items-center  ">
            <div className='text-center py-8 text-3xl'>
                <Title text1='Account' text2='Sign Up'/>
            </div>
            <LoginForm formType='signup' />
            <div className='text-center py-8'>
                <Link to="/account/login" className='underline hover:font-semibold'>Already have an account? Log in here</Link>
            </div>
        </div>
    )
}
export default SignUp
