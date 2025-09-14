import { ArrowUpRight, EnvelopeSimple, InstagramLogo, XLogo } from '@phosphor-icons/react';
import React, { useState } from 'react';
import FooterLogo from "@/assets/images/footerLogo.png"
import Image from 'next/image';
import EnquiryModelWindow from './window/EnquiryForm';

type FooterProps = {
    bannerDisplayed?: "subscribe" | "enquire"; // Define layout options
};


const Footer: React.FC<FooterProps> = ({ bannerDisplayed = "subscribe" }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const openWindow = () => {
        setIsDrawerOpen(true);
    }
    const closeDrawer = () => {
        setIsDrawerOpen(false);
    };

    return (
        <footer className="bg-gray-900 text-white py-12">
            {/* Conditional rendering based on bannerDisplayed prop */}            {bannerDisplayed === "enquire" ? (
                /* Enquire Section */
                <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center mb-12 space-y-4 md:space-y-0">
                    <h2 className="text-2xl md:text-3xl font-bold text-center md:text-left">Enquire now for this trip</h2>
                    <div className="flex justify-center items-center w-full md:w-auto mt-4 md:mt-0">
                        <a onClick={openWindow} className="text-heavy-metal bg-milk-white rounded-full p-2 flex justify-center items-center cursor-pointer hover:scale-110 transition-transform">
                            <ArrowUpRight size={32} weight="regular" />
                        </a>
                    </div>
                    <EnquiryModelWindow isOpen={isDrawerOpen} onClose={closeDrawer} />
                </div>
            ) : (
                /* Newsletter Section (default) */
                <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center mb-12 space-y-6 md:space-y-0">
                    <h2 className="text-2xl md:text-3xl font-bold text-center md:text-left">Subscribe to our newsletter</h2>
                    <div className="flex flex-col sm:flex-row justify-center items-center w-full md:w-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="px-6 py-3 w-full sm:w-64 md:w-80 rounded-full sm:rounded-l-full sm:rounded-r-none bg-white text-gray-900 border-none focus:outline-none mb-4 sm:mb-0"
                        />
                        <button 
                            className="bg-gray-900 text-white px-8 py-3 w-full sm:w-auto rounded-full sm:rounded-l-none sm:rounded-r-full hover:bg-gray-800 transition-colors"
                            style={{ boxShadow: '0 4px 30px rgba(255, 255, 255, 0.7)' }}>
                            Subscribe
                        </button>
                    </div>
                </div>
            )}


            <hr className='mx-8' />            {/* Footer Content */}
            <div className="container flex flex-col md:flex-row justify-between items-start mx-auto px-4 md:px-8 gap-8 md:gap-12 mt-8">
                {/* Company Info */}
                <div className="w-full md:w-1/3 mb-8 md:mb-0 md:pr-4 lg:pr-[8rem]">
                    <Image
                        src={FooterLogo}
                        alt="WaytoIndia Logo"
                        className="mb-4"
                    />
                    <p className="text-sm">
                        Way to India has created a niche for itself in the travel industry in India by providing customized tour options to discerning tourists.
                    </p>
                    <p className="text-xs mt-8 text-left">© 2014 - 2024 WaytoIndia. All Rights Reserved.</p>
                </div>

                {/* Links Section */}
                <div className="flex flex-wrap w-full md:w-2/3">
                    {/* Resources */}
                    <div className="w-1/2 sm:w-1/3 mb-6 md:mb-0">
                        <h3 className="font-bold mb-4 md:mb-6 text-lg">Resources</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-gray-400">Hotels</a></li>
                            <li><a href="#" className="hover:text-gray-400">Tours and Packages</a></li>
                            <li><a href="#" className="hover:text-gray-400">Air Charter Facility</a></li>
                            <li><a href="#" className="hover:text-gray-400">Transportation</a></li>
                            <li><a href="#" className="hover:text-gray-400">Plan My Tour</a></li>
                        </ul>
                    </div>

                    <div className="w-1/2 sm:w-1/3 mb-6 md:mb-0">
                        <h3 className="font-bold mb-4 md:mb-6 text-lg">About</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-gray-400">Our Services</a></li>
                            <li><a href="#" className="hover:text-gray-400">Recognition and Awards</a></li>
                            <li><a href="#" className="hover:text-gray-400">Our Partners</a></li>
                            <li><a href="#" className="hover:text-gray-400">Contact Us</a></li>
                            <li><a href="#" className="hover:text-gray-400">Help & FAQ</a></li>
                        </ul>
                    </div>

                    <div className="w-1/2 sm:w-1/3 mb-6 md:mb-0">
                        <h3 className="font-bold mb-4 md:mb-6 text-lg">Get Involved</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-gray-400">Subscribe our Newsletter</a></li>
                            <li><a href="#" className="hover:text-gray-400">Volunteer</a></li>
                            <li><a href="#" className="hover:text-gray-400">Careers</a></li>
                            <li><a href="#" className="hover:text-gray-400">Feedback</a></li>
                        </ul>
                    </div>

                    {/* Social Icons */}
                    <div className="flex flex-row md:flex-col justify-center w-1/2 sm:w-full md:justify-start items-center md:items-start mt-4 md:mt-8 gap-4 md:gap-2">
                        <a href="#" className="text-milk-white hover:text-gray-400 hover:scale-110">
                            <XLogo size={32} />
                        </a>
                        <a href="#" className="text-milk-white hover:text-gray-400 hover:scale-110">
                            <InstagramLogo size={32} />
                        </a>
                        <a href="#" className="text-milk-white hover:text-gray-400 hover:scale-110">
                            <EnvelopeSimple size={32} />
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
