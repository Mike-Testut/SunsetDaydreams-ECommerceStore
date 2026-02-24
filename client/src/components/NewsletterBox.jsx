import React,{useState} from 'react'

const NewsletterBox = () => {
    const[subscribed, setSubscribed] = useState(false);
    const onSubmitHandler = (e) => {
        e.preventDefault();
        setSubscribed(true);
    }
    return (!subscribed ?
        <div className="text-center">
            <p className='text-2xl font-medium text-gray-800'>Subscribe now for 20% off your first order</p>
            <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3 text-gray-400'>
                <input className='w-full sm:flex-1 outline-none' type='email' placeholder='Enter your email address' required/>
                <button type='submit' className='bg-black text-white text-xs px-10 py-4'>SUBSCRIBE</button>
            </form>
        </div> :
            <div className="text-center p-5">
                <p className='text-2xl font-medium text-gray-800'>You're Subscribed! Check your email for 20% off!</p>
            </div>
    )
}
export default NewsletterBox
