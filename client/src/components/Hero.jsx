import React from 'react'
import {assets} from "../assets/assets.js";

const Hero = () => {
    return (
        <div className='flex flex-col sm:flex-row border border-gray-400'>
        {/*    Left Side Hero */}
            <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
                <div className='text-[#414141]'>
                    <div className='flex items-center gap-2'>
                        <p className='w-8 md:w-11 h-0.5 bg-[#414141]'></p>
                        <p className='font-medium text-sm md:text-base'>SUMMER SALE</p>
                    </div>
                    <h1 className='spectral-sc-light text-3xl sm:py-3 lg:text-5xl leading-relaxed'>UP TO 50% OFF</h1>
                    <div className='flex items-center gap-2'>
                        <p className='font-semibold text-sm md:text-base'>SHOP NOW</p>
                        <p className='w-8 md:w-11 h-0.5 bg-[#414141]'></p>
                    </div>
                    <div className='flex flex-row items-center justify-center gap-10'>
                        <button className='border-2 px-2 py-1 hover:bg-black hover:text-white cursor-pointer'>Men's</button>
                        <button className='border-2 px-2 py-1 hover:bg-black hover:text-white cursor-pointer'>Women's</button>

                    </div>
                </div>

            </div>
        {/*    Right Side Hero */}
            <img className='w-full sm:w-1/2' src={assets.HeroImage} alt='Hero Image' />
        </div>
    )
}
export default Hero
