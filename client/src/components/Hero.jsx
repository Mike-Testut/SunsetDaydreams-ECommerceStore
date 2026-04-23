import React from 'react'
import {assets} from "../assets/assets.js";
import {useNavigate} from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col sm:flex-row border border-gray-300 mt-6 sm:mt-10 overflow-hidden">
            <div className="w-full sm:w-1/2 flex items-center justify-center px-6 py-10 sm:py-0">
                <div className="text-[#414141] text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                        <p className="w-8 md:w-11 h-0.5 bg-[#414141]"></p>
                        <p className="font-medium text-xs sm:text-sm md:text-base tracking-wide">SUMMER SALE</p>
                    </div>

                    <h1 className="spectral-sc-light text-3xl sm:text-4xl lg:text-5xl leading-tight py-3">
                        UP TO 50% OFF
                    </h1>

                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-6">
                        <p className="font-semibold text-sm md:text-base">SHOP NOW</p>
                        <p className="w-8 md:w-11 h-0.5 bg-[#414141]"></p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                        <button
                            onClick={() => navigate('/clothing/mens')}
                            className="border-2 px-4 py-2 w-full sm:w-auto hover:bg-black hover:text-white cursor-pointer"
                        >
                            Men's
                        </button>
                        <button
                            onClick={() => navigate('/clothing/womens')}
                            className="border-2 px-4 py-2 w-full sm:w-auto hover:bg-black hover:text-white cursor-pointer"
                        >
                            Women's
                        </button>
                    </div>
                </div>
            </div>

            <img className="w-full sm:w-1/2 object-cover" src={assets.HeroImage} alt="Hero Image" />
        </div>
    )
}
export default Hero
