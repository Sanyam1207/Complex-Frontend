'use client'
import Navbar from '@/components/NavBar';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ["100", "200", "300", "400", "500", "600"] });

export default function PersonalDetails() {
    const router = useRouter();
    return (
        <>
            {/* ==================== MOBILE VIEW (Android-style) ==================== */}
            <div className={`${inter.className} flex flex-col md:hidden bg-black h-screen w-full`}>
                {/* Top bar: Back arrow + Title */}
                <div className="flex flex-col items-center justify-center px-4 py-3 pt-6">
                    <button onClick={() => { router.back() }} className='absolute top-[18px] left-7 rounded-full bg-[#353537]'>
                        <Image
                            src="/icons/backbuttonn.svg"
                            alt="Back"
                            width={34}
                            height={34}
                            className=''
                        />
                    </button>
                    <h1 className="text-white text-sm font-medium">
                        Personal details
                    </h1>

                    <div className="relative w-24 h-24 mb-4  mt-2">
                        {/* Large circle with a placeholder face */}
                        <div className="w-24 h-24 rounded-full  flex items-center p-0 justify-center overflow-hidden">
                            <Image src={"/icons/personaldetailplaceholder.svg"} alt='placeholder' height={120} width={120} className='h-full w-full' />
                        </div>
                        {/* Small camera/plus icon circle on the bottom-right */}
                        <div className="absolute flex items-center justify-center bottom-1 right-1 w-6 h-6 rounded-full bg-white ">
                            <Image
                                src="/icons/addprofilepic.svg"
                                alt="camera"
                                width={24}
                                height={24}
                                className='h-[34.3px]  object-cover'
                            />
                        </div>

                    </div>


                    {/* Heading under the profile picture */}
                    <p className=" font-medium text-sm mb-5 text-white">
                        Add your profile picture
                    </p>
                </div>

                {/* White container with rounded top corners */}
                <div className="bg-white overflow-y-scroll h-full rounded-t-3xl p-4 flex flex-col items-center">
                    {/* Profile picture container */}


                    {/* Form fields */}
                    <div className="w-full mt-6">
                        {/* Full name */}
                        <label className="block mb-4 text-sm font-medium text-[#2C3C4E]">
                            Full name
                        </label>
                        <input
                            type="text"
                            placeholder="Pratik Parmar"
                            className="mb-7 bg-[#F4F4F4] text-[#2C3C4E] placeholder:text-[#2C3C4E] font-medium placeholder:font-medium w-full rounded-lg focus:border-none focus:outline-none px-5 py-4 text-sm "
                        />

                        {/* Email */}
                        <label className="block mb-4 text-sm font-medium text-[#2C3C4E]">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Pratikparmar@fmr.ca"
                            className="mb-7 bg-[#F4F4F4] text-[#2C3C4E] placeholder:text-[#2C3C4E] font-medium placeholder:font-medium w-full rounded-lg focus:border-none focus:outline-none px-5 py-4 text-sm "
                        />

                        {/* Change password */}
                        <label className="block mb-4 text-sm font-medium text-[#2C3C4E]">
                            Change password
                        </label>
                        <input
                        placeholder='findmyrentals'
                            type="password"
                            className="mb-7 bg-[#F4F4F4] text-[#2C3C4E] placeholder:text-[#2C3C4E] font-medium placeholder:font-medium w-full rounded-lg focus:border-none focus:outline-none px-5 py-4 text-sm "
                        />

                        {/* Phone number */}
                        <label className="block mb-4 text-sm font-medium text-[#2C3C4E]">
                            Phone number
                        </label>
                        <input
                            type="tel"
                            placeholder="647-772-4334"
                            className="mb-7 bg-[#F4F4F4] text-[#2C3C4E] placeholder:text-[#2C3C4E] font-medium placeholder:font-medium w-full rounded-lg focus:border-none focus:outline-none px-5 py-4 text-sm 
                         "
                        />

                        {/* Save button */}
                        <button
                            type="button"
                            className="w-full bg-black text-white text-sm font-medium py-3 rounded-full hover:bg-gray-900"
                        >
                            Save
                        </button>
                    </div>

                    {/* Delete account link */}
                    <button
                        type="button"
                        className="mt-6 text-sm text-[#de4b4b]"
                    >
                        Delete account
                    </button>
                </div>
            </div>

            {/* ==================== DESKTOP VIEW (Unchanged) ==================== */}
            <div className="hidden md:block bg-black">
                <Navbar />

                <div className={`${inter.className} min-h-screen bg-white flex flex-col rounded-t-3xl items-center justify-center p-4`}>
                    {/* Profile picture container */}
                    <div className="relative w-24 h-24">
                        {/* Large circle with a placeholder face */}
                        <div className="w-24 h-24 rounded-full bg-pink-200 flex items-center justify-center overflow-hidden">
                            <Image src={"/icons/personaldetailplaceholder.svg"} alt='placeholder' height={120} width={120} className='h-full' />
                        </div>

                        {/* Small camera icon circle on top-right corner */}
                        <div className="absolute top-[4.3rem] right-1 w-6 h-6 rounded-full bg-[#0A84FF] flex items-center justify-center border-2 border-white">
                            <Image
                                src={"/icons/profile.svg"}
                                alt="camera"
                                width={12}
                                height={12}
                            />
                        </div>
                    </div>

                    {/* Heading under the profile picture */}
                    <p className="mt-3 text-lg font-medium text-black">
                        Add your profile picture
                    </p>

                    {/* Form fields */}
                    <div className="w-full max-w-xs mt-6">
                        {/* Full name */}
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="Prahlix Parmar"
                            className="mb-7 bg-[#F4F4F4] w-full border rounded-md px-4 py-3 text-sm 
                         focus:outline-dashed"
                        />

                        {/* Email */}
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Prahlixparmar@lfma.ca"
                            className="mb-7 bg-[#F4F4F4] w-full border rounded-md px-4 py-3 text-sm 
                         focus:outline-dashed"
                        />

                        {/* Change password */}
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Change password
                        </label>
                        <input
                            type="password"
                            className="mb-7 bg-[#F4F4F4] w-full border rounded-md px-4 py-3 text-sm 
                         focus:outline-dashed"
                        />

                        {/* Phone number */}
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Phone number
                        </label>
                        <input
                            type="tel"
                            placeholder="+1 555 555 5555"
                            className="mb-7 bg-[#F4F4F4] w-full border rounded-md px-4 py-3 text-sm 
                         focus:outline-dashed"
                        />

                        {/* Save button */}
                        <button
                            type="button"
                            className="w-full bg-black text-white text-sm font-medium py-3 rounded-full hover:bg-gray-900"
                        >
                            Save
                        </button>
                    </div>

                    {/* Delete account link */}
                    <button
                        type="button"
                        className="mt-6 text-sm text-[#0A84FF] hover:text-red-500"
                    >
                        Delete account
                    </button>
                </div>
            </div>
        </>
    );
}
