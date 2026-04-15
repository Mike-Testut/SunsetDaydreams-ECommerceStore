import React from 'react'
import {Link} from "react-router-dom";

const ErrorPage = () => {
    return (
        <div className="p-5 flex flex-col items-center justify-center bg-white">
            <h1 className='text-lg'>Sorry the page you are looking for does not exist</h1>
            <Link to="/">Go back to home</Link>
        </div>
    )
}
export default ErrorPage
