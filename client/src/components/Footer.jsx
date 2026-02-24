import React from 'react'
import {assets} from "../assets/assets.js";

const Footer = () => {
    return (
        <div>
            <hr/>
            <div className="flex flex-col sm:grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-14 my-10 mt-15 text-sm">
                <div className="flex items-center justify-center">
                    <img src={assets.LogoBlackOutline} className='w-32' alt="LogoBlack" />
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>Contact</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>Live Chat</li>
                        <li>Email</li>
                    </ul>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>Company</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>Home</li>
                        <li>About Us</li>
                        <li>Careers</li>
                        <li>Privacy Policy</li>
                        <li>FAQs</li>
                    </ul>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>Socials</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>Instagram</li>
                        <li>TikTok</li>
                        <li>Twitter</li>
                        <li>Snapchat</li>
                        <li>Youtube</li>
                    </ul>
                </div>
            </div>
            <div>
                <hr />
                <p className='py-5 text-sm text-center'>Copyright 2026 Sunset Daydreams Co.</p>
            </div>
        </div>
    )
}
export default Footer
