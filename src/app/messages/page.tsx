import Navbar from '@/components/NavBar'
import Image from 'next/image'
import React from 'react'

const page = () => {
    return (
        <>
            <Navbar />
            <div className="bg-[#1c1c1c] flex h-screen text-[#2C3C4E] flex-col pt-10">
                <div className="flex flex-row justify-between  px-14 items-center">

                    {/* Left Section: Search Bar & Sort Button */}
                    <div className="flex flex-row space-x-3">
                        {/* Search Bar */}
                        <div
                            className={`
              flex items-center
              justify-center
              bg-[#2F2F2F]
              rounded-full
              px-4 py-2
              w-[20.18rem]
            `}
                        >
                            <div className="bg-[#1c1c1c] p-2 rounded-full">
                                <Image
                                    src="/icons/firrsearch.png"
                                    height={15.43}
                                    width={15.43}
                                    alt="search-icon"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Search location"
                                className="
                ml-2 w-full
                border-none outline-none
                bg-transparent
                text-[14px] text-white placeholder-white
              "
                            />
                        </div>

                        {/* Sort Button */}
                        <div>
                            <button className="bg-[#2F2F2F] text-white px-6 py-2 rounded-full">
                                Sort
                            </button>
                        </div>
                    </div>

                    {/* Middle Section: Address & Rounded Image */}
                    <div className="flex flex-row items-center space-x-3">

                        <Image
                            src="/icons/similarlisting.png"
                            height={32}
                            width={32}
                            alt="user-avatar"
                            className="rounded-full"
                        />
                        <span className="text-white text-sm">2958 Main Street</span>
                    </div>

                    {/* View Button */}
                    <div>
                        <button className="bg-[#2F2F2F] text-white px-6 py-2 rounded-full">
                            View
                        </button>
                    </div>

                    {/* Renter / Landlord Buttons */}
                    <div className="flex flex-row items-center space-x-2">
                        <button className="bg-[#2F2F2F] text-white px-6 py-2 rounded-full">
                            Renter
                        </button>
                        <button className="bg-[#2F2F2F] text-white px-6 py-2 rounded-full">
                            Landlord
                        </button>
                    </div>
                </div>

                {/* main section div yaha pr hai  */}
                <div className='flex h-screen mt-10 px-10 bg-white rounded-t-3xl flex-row justify-between'>

                    {/*show all chats section*/}
                    <div className='w-full flex justify-center flex-row'>
                        {/* show all chats section */}
                        <div className="h-full overflow-y-auto p-5">
                            {/* John Doe (special snippet + Unread badge) */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    {/* Avatar */}
                                    <div className="w-10 h-10 relative">
                                        <Image
                                            src="/icons/usericon.png"
                                            alt="avatar"
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-full"
                                        />
                                    </div>
                                    {/* Name & snippet */}
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">John Doe</span>
                                        <span className="text-xs text-gray-500">Hi, my name is John Do...</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs text-gray-500">Just now</span>
                                    <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                                        Unread
                                    </span>
                                </div>
                            </div>

                            {/* Sachin Tendulkar */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 relative">
                                        <Image
                                            src="/icons/usericon.png"
                                            alt="avatar"
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-full"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">Sachin Tendulkar</span>
                                        <span className="text-xs text-gray-500">
                                            This is the count of total char . . .
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="text-xs text-gray-500">Just now</span>
                                    <span className="text-xs text-gray-500">45</span>
                                    {/* Star icon */}
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.184 6.728a1 
                1 0 00.95.69h7.063c.969 0 1.371 1.24.588 
                1.81l-5.72 4.088a1 1 0 00-.364 
                1.118l2.183 6.728c.3.921-.755 
                1.688-1.54 1.118l-5.72-4.088a1 1 0 
                00-1.176 0l-5.72 4.088c-.784.57-1.84-.197-1.54-1.118l2.183-6.728a1 
                1 0 00-.364-1.118l-5.72-4.088c-.783-.57-.38-1.81.589-1.81h7.062a1 
                1 0 00.951-.69l2.184-6.728z"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Rohit Sharma */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 relative">
                                        <Image
                                            src="/icons/usericon.png"
                                            alt="avatar"
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-full"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">Rohit Sharma</span>
                                        <span className="text-xs text-gray-500">
                                            This is the count of total char . . .
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-500">Just now</span>
                                    <span className="text-xs text-gray-500">45</span>
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        {/* same star path as above */}
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.184 6.728a1 
                1 0 00.95.69h7.063c.969 0 1.371 1.24.588 
                1.81l-5.72 4.088a1 1 0 00-.364 
                1.118l2.183 6.728c.3.921-.755 
                1.688-1.54 1.118l-5.72-4.088a1 1 0 
                00-1.176 0l-5.72 4.088c-.784.57-1.84-.197-1.54-1.118l2.183-6.728a1 
                1 0 00-.364-1.118l-5.72-4.088c-.783-.57-.38-1.81.589-1.81h7.062a1 
                1 0 00.951-.69l2.184-6.728z"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Repeat similarly for Virat Kohli, KL Rahul, Shreyash Iyer, Hardik Pandya, 
            Washington Sunder, Jasprit Bumrah, Harbajan Singh, etc. */}

                        </div>
                    </div>

                    {/* opened current chat */}
                    <div className="w-full flex flex-col justify-between border-x border-gray-200">
                        {/* Chat Messages */}
                        <div className="p-4 overflow-y-auto flex flex-col space-y-6">
                            {/* Left Bubble (black) */}
                            <div className="max-w-[60%]">
                                <div className="bg-[#353537] text-white rounded-lg px-4 py-2">
                                    Hello, Is this available.
                                </div>
                                <span className="text-xs text-gray-500">2:50 pm</span>
                            </div>

                            {/* Right Bubble (light background) */}
                            <div className="max-w-[60%] ml-auto text-right">
                                <div className="bg-gray-100 text-black rounded-lg px-4 py-2 inline-block">
                                    Hello, Is this available.
                                </div>
                                <span className="text-xs text-gray-500 block mt-1">2:50 pm</span>
                            </div>
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t bg-[#F4F4F4] py-10 border-gray-200">
                            <div className="flex items-center space-x-2">
                                {/* Plus Icon (attach files, etc.) */}
                                <button className="bg-white py-2 px-3 rounded-full">
                                    +
                                </button>

                                {/* Text Input */}
                                <input
                                    type="text"
                                    placeholder="Type your message"
                                    className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none"
                                />

                                {/* Send Button */}
                                <button className="bg-blue-500 text-white rounded-full p-3">
                                    {/* Example arrow icon (SVG) */}
                                    <Image src={'/icons/send.svg'} width={20} height={20} alt='Send' />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* complete your profile */}
                    <div className="w-full flex justify-center flex-col p-6">
                        {/* Section Title */}
                        <div className='flex flex-col items-center justify-center'>
                            <h2 className="text-lg font-medium mb-4">Candidate Profile</h2>

                            {/* Avatar + Name */}
                            <div className="flex flex-col items-center mb-6">
                                {/* Example gradient background for avatar placeholder */}
                                <div className="w-24 h-24 rounded-full bg-gradient-to-b from-pink-400 to-pink-200 flex items-center justify-center mb-2">
                                    <Image
                                        src="/icons/profile.svg"
                                        alt="John Doe"
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                </div>
                                <p className="font-medium text-base">John Doe</p>
                            </div>
                        </div>



                        <div className='w-5/6'>
                            {/* Gender */}
                            <div className="mb-8">
                                <p className="text-sm font-medium">
                                    <span className="">Gender:</span> Male
                                </p>
                            </div>

                            {/* Languages */}
                            <div className="mb-8">
                                <p className="text-sm font-medium mb-3">Languages:</p>
                                <div className="flex flex-wrap gap-2">
                                    {["French", "Hindi", "Gujarati", "Punjabi", "Mandarin", "Telugu"].map(
                                        (lang) => (
                                            <span
                                                key={lang}
                                                className="px-4 py-2 rounded-full text-sm border border-gray-500"
                                            >
                                                {lang}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* About */}
                            <div>
                                <p className="text-sm font-medium mb-2">About John Doe:</p>
                                <p className="text-sm ">
                                    Once you login, you will find the messages here. I am looking for 2
                                    Bedroom apartment for rent can you please help me to find this
                                    character limit. let it flow down
                                </p>
                                <p className="text-sm  mt-3">
                                    Incase if its second paragraph how thats going to look.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default page