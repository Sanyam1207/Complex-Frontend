"use client";

import { selectIsPopupOpen, closePopup, openPopup } from "@/redux/slices/showPopups";
import { RootState } from "@/redux/store/store";
import { Inter, Knewave } from "next/font/google";
import Image from "next/image";
import React from "react";
import { useSelector, useDispatch } from "react-redux";

const inter = Inter({
    subsets: ["latin"],
});
const knewave = Knewave({
    subsets: ["latin"],
    weight: ["400"],
})

const OnBoardingPopup: React.FC = () => {
    const dispatch = useDispatch();
    const [error, setError] = React.useState<string | null>(null);
    console.log(error)
    const isOpen = useSelector((state: RootState) => selectIsPopupOpen(state, 'onboarding'));

    const handleClose = () => {
        dispatch(closePopup('onboarding'));
    };

    const handleOpenLogin = () => {
        dispatch(closePopup('onboarding'));
        dispatch(openPopup('login'));
    };

    const handleOpenSignup = () => {
        dispatch(closePopup('onboarding'));
        dispatch(openPopup('signup'));
    };

    // Early return based on isOpen AFTER all hooks have been called
    if (!isOpen) return null;

    // Handle form submission
    const handleGoogleLogin = async () => {
        console.log("Google login clicked");
        console.log(process.env.API_URL)

        setError('');

        try {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) { // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${inter.className}`}>
            {/* Overlay / Backdrop */}
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose} />

            {/* =======================
          DESKTOP VIEW
      ======================= */}
            <div className="hidden md:block relative z-50 w-[36rem] rounded-2xl bg-white px-28 py-10 shadow-lg">
                {/* Desktop view content will go here */}
            </div>

            {/* =======================
          MOBILE VIEW
      ======================= */}
            <div className="block md:hidden absolute bottom-0 z-50 w-full max-w-md mx-auto rounded-t-2xl bg-white px-6 py-8 shadow-lg">
                {/* Close Button */}
                <div className="absolute top-4 right-4">
                    <button onClick={handleClose} aria-label="Close" className="text-gray-500 hover:text-gray-800">
                        <Image src={'/icons/closeicon.svg'} alt="close" height={28} width={28} />
                    </button>
                </div>

                <div className="absolute top-7 left-7">
                    <button onClick={handleClose} aria-label="Close" className="text-gray-500 hover:text-gray-800">
                        <Image src={'/icons/stars.svg'} alt="close" height={28} width={28} />
                    </button>
                </div>

                {/* Star Icon and Logo */}
                <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center justify-center space-x-2">
                        <div className="text-3xl h-4 w-4 bg-[#0A84FF] rounded-full"></div>
                        <span className={`${knewave.className} font-normal text-[#0A84FF] text-xl`}>Findmyrentals</span>
                    </div>
                </div>

                {/* Title */}
                <div className="mb-6 text-center">
                    <h2 className="text-base font-medium mb-2 text-[#2C3C4E]">
                        Log in or sign up to continue:
                    </h2>
                    <p className="text-sm font-normal text-[rgba(44,60,78,0.80)]">
                        To send your message, please log in or <br /> create an account.
                    </p>
                </div>

                {/* Google Sign In Button */}
                <button onClick={() => handleGoogleLogin()} className="w-full flex items-center justify-center space-x-2 rounded-full bg-[#1F1F21] text-white py-3 px-4 mb-8">
                    <span className="bg-white rounded-full p-1">
                        <Image src={'/icons/googlelogo.svg'} alt="google Logo" height={24} width={24} />
                    </span>
                    <span className="text-sm w-full font-semibold text-white">Continue with Google</span>
                </button>

                {/* Other Login Options */}
                <div className="flex justify-center space-x-6 mb-8">
                    {/* Apple */}
                    <div className="flex flex-col items-center">
                        <button className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">
                            <Image src={'/icons/applelogo.svg'} alt="google Logo" height={24} width={24} />
                        </button>
                        <span className="text-sm text-[#2C3C4E] mt-1">Apple</span>
                    </div>

                    {/* Facebook */}
                    <div className="flex flex-col items-center">
                        <button className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">
                            <Image src={'/icons/facebooklogo.svg'} alt="google Logo" height={24} width={24} />
                        </button>
                        <span className="text-sm text-[#2C3C4E] mt-1">Facebook</span>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col items-center">
                        <button onClick={handleOpenLogin} className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#0A84FF" />
                            </svg>
                        </button>
                        <span className="text-sm text-[#2C3C4E] mt-1">Email</span>
                    </div>
                </div>

                {/* Other Ways to Sign Up */}
                <div className="text-center mb-6">
                    <p className="text-[#2C3C4E] text-sm">
                        Other ways to <span onClick={handleOpenSignup} className="text-[#0A84FF] font-medium cursor-pointer">Sign up</span>
                    </p>
                </div>

                {/* Terms & Privacy */}
                <p className="text-[10px] text-[#2C3C4E] font-light text-center mt-6">
                    By continuing in, you agree to our <a href="#" className="text-gray-500">Terms of Service</a> and <a href="#" className="text-gray-500">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
};

export default OnBoardingPopup;