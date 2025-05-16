"use client"; // If using Next.js 13 app router; remove if using pages router
import LogoutModal from "@/components/LogoutModal";
import MobileBottomTabs from "@/components/MobileBottomTabs";
import api from "@/lib/axios";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { openPopup, closePopup } from "@/redux/slices/showPopups";
import OnBoardingPopup from "@/components/OnboardingPopup";
import LoginModal from "@/components/LoginPopup";
import SignUpModal from "@/components/RegisterPopup";
import ForgotPasswordModal from "@/components/ForgotPassword";

const inter = Inter({
    subsets: ["latin"],
})

export interface User {
    _id: string;
    email: string;
    fullName: string;
    profilePicture: string;
    wishlist: string[]; // Assuming IDs of wishlisted items
    listingsCreated: string[]; // Assuming IDs of created listings
    accountActivity: boolean;
    listingActivity: boolean;
    phoneNumber: number;
    messages: boolean;
    languages: string[];
    gender: 'male' | 'female' | 'rather not say' | string;
    role: 'user' | 'admin' | string;
    isActive: boolean;
    lastLogin: string; // ISO date string
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number; // MongoDB version key
    displayName: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [user, setUser] = useState<User>();
    const [isTokenValid, setIsTokenValid] = useState<boolean>(false);

    useLayoutEffect(() => {
        const getDetails = async () => {
            try {
                const response = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-details`)
                console.log(response)
                if (response.data.success) {
                    setUser(response.data.user)
                    console.log(`User details: ${JSON.stringify(response.data.user.profilePicture)}`)
                    setIsTokenValid(true)
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.log(error)
                setIsTokenValid(false)
            }
        }

        // Check if token exists in localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            setIsTokenValid(false);
            return;
        } else {
            getDetails()
        }
    }, [])

    // Function to handle logout
    const handleLogout = () => {
        dispatch(openPopup('logout'));
    };

    // Function to perform actual logout
    const performLogout = () => {
        // Add your logout logic here
        localStorage.removeItem('token');
        router.push('/login');
    };
    const handleOpenSignup = () => {
        dispatch(closePopup('onboarding'));
        dispatch(openPopup('signup'));
    };

    // Function to handle unauthenticated clicks
    const handleUnauthenticatedClick = () => {
        dispatch(openPopup('onboarding'));
    };

    return (
        <div className={`min-h-screen max-h-screen bg-[#1F1F21] ${inter.className}`}>
            {/* -- 1) TOP BLACK SECTION -- */}
            <div className="bg-[#1F1F21] px-6 pt-8 py-6 text-white relative">
                {/* Top label: "Profile" (centered) */}
                <p className="text-center text-sm font-medium">Profile</p>

                {/* User Info Row */}
                <div onClick={() => isTokenValid ? router.push('/personal-details') : handleUnauthenticatedClick()} className="mt-4 flex items-center justify-between">
                    {/* Avatar placeholder */}
                    <div className={`flex items-center ${!isTokenValid ? 'w-full' : ''}`}>
                        {isTokenValid ? (
                            <>
                                <div className="w-14 h-14 flex items-center justify-center rounded-full" >
                                    {user?.profilePicture ? (
                                        <Image
                                            src={user.profilePicture}
                                            height={120}
                                            width={120}
                                            className="w-14 h-14 flex items-center justify-center rounded-full object-cover"
                                            alt="profile"
                                            onError={(e) => {
                                                // Fallback to placeholder if image fails to load
                                                e.currentTarget.src = '/icons/personaldetailplaceholder.svg';
                                            }}
                                        />
                                    ) : (
                                        // Placeholder when profilePicture is not available
                                        <div className="w-14 h-14 bg-gray-300 flex items-center justify-center rounded-full">
                                            <span className="text-gray-500 text-2xl">
                                                {user?.fullName?.charAt(0) || "?"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {/* Name & Details */}
                                <div className="ml-3">
                                    <p className="text-base font-semibold">{user?.fullName}</p>
                                    <p className="text-sm font-normal">Login details</p>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col justify-center items-center w-full">
                                {/* Key Icon */}
                                <div className="flex w-[90px] h-[90px] bg-[#343437] rounded-full items-center justify-center">
                                    <Image
                                        src="/icons/keydoorlogout.png"
                                        alt="Key Icon"
                                        width={97}
                                        height={97}
                                        className="w-[97px] h-[97px]"
                                    />
                                </div>

                                <p className="text-[16px] mb-4 mt-4 text-center w-full">Log in or sign up to continue</p>

                                <button
                                    className="w-full rounded-full bg-white py-4 text-black font-semibold hover:bg-gray-800 transition"
                                >
                                    Log In
                                </button>

                                <p className="text-[14px] mt-4 text-center w-full">
                                    Don&apos;t have an account?
                                    <span onClick={handleOpenSignup} className="text-[#0A84FF]"> Sign up</span>
                                </p>

                            </div>
                        )}
                    </div>

                    {/* Arrow on the right - only show when token is valid */}
                    {isTokenValid && (
                        <div className="bg-[#353537] rounded-full h-8 w-8 flex items-center justify-center">
                            <Image src={'/icons/forwardarrow.svg'} alt="go" height={20} width={20} />
                        </div>
                    )}
                </div>
            </div>

            {/* -- 2) MAIN WHITE CARD WITH ROUNDED TOP -- */}
            <div className="bg-white h-full text-[#2C3C4E] rounded-t-3xl  pt-2 px-6">
                {/* A) Create Listing */}
                <div onClick={() => isTokenValid ? router.push('/create-listing') : handleUnauthenticatedClick()} className="flex items-center justify-between py-5">
                    <div className="flex items-center">
                        {/* Icon circle (plus sign) */}
                        <div className="w-12 h-12 flex items-center justify-center bg-[#0A84FF] rounded-full mr-3">
                            <Image alt="create listing" src={'/icons/createlisting.svg'} width={27} height={12} />
                        </div>
                        <div>
                            <p className="text-sm text-[#2C3C4E] font-semibold">Create listing</p>
                            <p className="text-xs text-[#2C3C4E] font-normal">List your space and start earning.</p>
                        </div>
                    </div>
                    {/* Arrow */}
                    <div className="rounded-full bg-[#F4F4F4] p-2">
                        <Image src={'/icons/forward.svg'} alt="goto" height={20} width={20} />
                    </div>
                </div>
                <hr />

                {/* B) Renters Profile - only show when token is valid */}
                {isTokenValid && (
                    <>
                        <div className="flex items-center justify-between py-5">
                            <div className="flex items-center">
                                {/* Icon circle (user) */}
                                <div className="w-12 h-12 flex items-center justify-center bg-[#F4F4F4] rounded-full mr-3">
                                    <Image src={'/icons/profileuser.svg'} alt="profile" height={27} width={27} />
                                </div>
                                <div>
                                    <p onClick={() => { router.push('/about') }} className="text-sm text-[#2C3C4E] font-semibold">About you</p>
                                    <p className="text-xs  text-[#2C3C4E] font-normal">Complete your profile to stand out.</p>
                                </div>
                            </div>
                            {/* Arrow */}
                            <div className="rounded-full bg-[#F4F4F4] p-2">
                                <Image src={'/icons/forward.svg'} alt="goto" height={20} width={20} />
                            </div>
                        </div>
                        <hr />
                    </>
                )}

                {/* Divider: "Settings" Label */}
                <p className="my-6 text-sm font-semibold text-[#2C3C4E]">Settings</p>

                {/* C) Notifications */}
                <div onClick={() => isTokenValid ? router.push("/notifications") : handleUnauthenticatedClick()} className="flex items-center justify-between py-5">
                    <div className="flex items-center">
                        {/* Bell icon */}
                        <div className="w-12 h-12 p-3 flex items-center justify-center bg-[#F4F4F4] rounded-full mr-3">
                            <Image height={27} width={27} src="/icons/notification.svg" alt="notification" />
                        </div>
                        <p className="text-sm font-medium">Notifications</p>
                    </div>
                    <div className="rounded-full bg-[#F4F4F4] p-2">
                        <Image src={'/icons/forward.svg'} alt="goto" height={20} width={20} />
                    </div>
                </div>
                <hr />

                {/* D) Terms & conditions */}
                <div onClick={() => { router.push('/terms-and-conditions') }} className="flex items-center justify-between py-5">
                    <div className="flex items-center">
                        {/* Document icon */}
                        <div className="w-12 p-3 h-12 flex items-center justify-center bg-[#F4F4F4] rounded-full mr-3">
                            <Image alt="terms and conditions" src={'/icons/termsandconditions.svg'} height={27} width={27} />
                        </div>
                        <p className="text-sm font-medium">Terms & conditions</p>
                    </div>
                    <div className="rounded-full bg-[#F4F4F4] p-2">
                        <Image src={'/icons/forward.svg'} alt="goto" height={20} width={20} />
                    </div>
                </div>
                <hr />

                {/* E) Help & feedback */}
                <div onClick={() => { router.push('/help-feedback') }} className="flex items-center justify-between py-5">
                    <div className="flex items-center">
                        {/* Mail icon */}
                        <div className="w-12 h-12 p-3 flex items-center justify-center bg-[#F4F4F4] rounded-full mr-3">
                            <Image alt="help and feedback" src={'/icons/helpandfeedback.svg'} height={27} width={27} />
                        </div>
                        <p className="text-sm font-medium">Help & feedback</p>
                    </div>
                    <div className="rounded-full bg-[#F4F4F4] p-2">
                        <Image src={'/icons/forward.svg'} alt="goto" height={20} width={20} />
                    </div>
                </div>
                <hr />

                {/* -- 3) LOGOUT BUTTON -- only show when token is valid */}
                {isTokenValid && (
                    <div className="flex justify-center mt-6 mb-6">
                        <button
                            onClick={handleLogout}
                            className="bg-[#0A84FF] text-white px-6 py-3 rounded-full text-sm font-semibold"
                        >
                            Logout
                        </button>
                    </div>
                )}

                {/* Modals */}
                <LogoutModal onConfirm={performLogout} />
                <OnBoardingPopup />
                <LoginModal />
                <SignUpModal />
                <ForgotPasswordModal />
            </div>

            <MobileBottomTabs />
        </div>
    );
}