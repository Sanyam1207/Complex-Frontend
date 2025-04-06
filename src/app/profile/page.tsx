"use client"; // If using Next.js 13 app router; remove if using pages router
import LogoutModal from "@/components/LogoutModal";
import MobileBottomTabs from "@/components/MobileBottomTabs";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
const inter = Inter({
    subsets: ["latin"],
})
export default function ProfilePage() {
    const router = useRouter();
    const [logoutModal, setLogoutModal] = useState(false);

    return (
        <div className={`min-h-screen bg-[#1F1F21] ${inter.className}`}>
            {/* -- 1) TOP BLACK SECTION -- */}
            <div className="bg-[#1F1F21] px-6 pt-8 py-6 text-white relative">
                {/* Top label: "Profile" (centered) */}
                <p className="text-center text-sm font-medium">Profile</p>

                {/* User Info Row */}
                <div onClick={() => router.push('/personal-details')} className="mt-4 flex items-center justify-between">
                    {/* Avatar placeholder */}
                    <div className="flex items-center">

                        <div className="w-12 h-12 bg-gray-300 rounded-full" />
                        {/* Name & Details */}
                        <div className="ml-3">
                            <p className="text-base font-semibold">John Doe</p>
                            <p className="text-sm font-normal">Personal details</p>
                        </div>

                    </div>

                    {/* Arrow on the right */}
                    <div className="bg-[#353537] rounded-full h-8 w-8 flex items-center justify-center">
                        <Image src={'/icons/forwardarrow.svg'} alt="go" height={20} width={20} />
                    </div>
                </div>
            </div>

            {/* -- 2) MAIN WHITE CARD WITH ROUNDED TOP -- */}
            <div className="bg-white h-[80vh] text-[#2C3C4E] rounded-t-3xl  pt-2 px-6">
                {/* A) Create Listing */}
                <div onClick={() => { router.push('/create-listing') }} className="flex items-center justify-between py-5">
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

                {/* B) Renters Profile */}
                <div className="flex items-center justify-between py-5">
                    <div className="flex items-center">
                        {/* Icon circle (user) */}
                        <div className="w-12 h-12 flex items-center justify-center bg-[#F4F4F4] rounded-full mr-3">
                            <Image src={'/icons/profileuser.svg'} alt="profile" height={27} width={27} />
                        </div>
                        <div>
                            <p className="text-sm text-[#2C3C4E] font-semibold">Renters profile</p>
                            <p className="text-xs  text-[#2C3C4E] font-normal">Complete your profile to stand out.</p>
                        </div>
                    </div>
                    {/* Arrow */}
                    <div className="rounded-full bg-[#F4F4F4] p-2">
                        <Image src={'/icons/forward.svg'} alt="goto" height={20} width={20} />
                    </div>
                </div>
                

                {/* Divider: "Settings" Label */}
                <p className="my-6 text-sm font-semibold text-[#2C3C4E]">Settings</p>

                {/* C) Notifications */}
                <div onClick={() => { router.push("/notifications") }} className="flex items-center justify-between py-5">
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
                <div onClick={() => { router.push('/home') }} className="flex items-center justify-between py-5">
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

                {/* -- 3) LOGOUT BUTTON -- */}
                <div onClick={() => { setLogoutModal(true) }} className="flex justify-center mt-6 mb-6">
                    <button className="bg-[#0A84FF] text-white px-6 py-3 rounded-full text-sm font-semibold">
                        Logout
                    </button>
                </div>

                {
                    logoutModal && (
                        <LogoutModal isOpen={logoutModal} onClose={() => { setLogoutModal(false) }} onConfirm={() => { alert('logged out') }} />
                    )
                }
            </div>

            <MobileBottomTabs />
        </div>
    );
}
