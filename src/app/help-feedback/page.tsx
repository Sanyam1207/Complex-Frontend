'use client'
import Navbar from '@/components/NavBar';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function HelpFeedback() {
    const router = useRouter();
    return (
        <>
            {/* ==================== MOBILE VIEW ==================== */}
            <div className={`${inter.className} md:hidden min-h-screen bg-[#1F1F21]`}>
                {/* Top bar: black with back arrow + title */}
                <div className="bg-[#1F1F21] h-14 p-14 flex items-center justify-center relative">
                    <button onClick={() => {router.back()}} className="absolute left-6 top-10 rounded-full bg-[#353537] p-3">
                        <Image
                            src="/icons/backarrow.svg"
                            width={12}
                            height={12}
                            alt="Back"
                        />
                    </button>
                    <h1 className="text-white text-lg font-medium">
                        Help & feedback
                    </h1>
                </div>

                {/* White container with rounded top corners */}
                <div className="px-6 py-4 rounded-t-3xl bg-white h-screen space-y-4">
                    {/* Reason for your feedback */}
                    <div>
                        <label className="block my-4 text-sm font-medium text-[#2C3C4E]">
                            Reason for your feedback
                        </label>
                        <select
                            className="w-full border  rounded-md px-4 py-4 text-sm 
                         focus:outline-none focus:ring-1 focus:border-dashed"
                        >
                            <option>Select</option>
                            <option>Bug report</option>
                            <option>Feature request</option>
                            <option>Other</option>
                        </select>
                    </div>

                    {/* Add details */}
                    <div className='my-3'>
                        <label className="block my-3 text-sm font-medium text-[#2C3C4E]">
                            Add details
                        </label>
                        <textarea
                            placeholder="Add additional information"
                            className="w-full h-24 border border-gray-300 rounded-md px-4 py-2 text-sm 
                         focus:outline-none focus:ring-1 focus:ring-[#0A84FF] resize-none"
                        />
                    </div>

                    {/* Send button */}
                    <br />
                    <button
                        type="button"
                        className="w-full bg-black text-white text-sm font-medium py-3 rounded-full hover:bg-gray-900"
                    >
                        Send
                    </button>
                    <br /> <br />

                    {/* Informational text */}
                    <p className="text-sm text-[#2C3C4E] leading-5">
                        Thanks for reaching out. If you do have a specific question or need help resolving a problem,
                        you can contact us to connect with our support team.
                        <br />
                        Reach-out:{" "}
                        <a
                            href="mailto:customerservice@fmr.ca"
                            className="text-[#0A84FF] underline"
                        >
                            customerservice@fmr.ca
                        </a>
                        <br />
                        We will try our best to get back to you as soon as possible.
                    </p>
                </div>
            </div>

            {/* ==================== DESKTOP VIEW ==================== */}
            <div className='hidden md:block'>
                <Navbar />
                <div className={`${inter.className} hidden md:flex bg-white min-h-screen text-[#2C3C4E]`}>

                    {/* Center the form vertically and horizontally */}
                    <div className="flex flex-col w-full">
                        {/* Optional: If you have a nav bar or header, put it here */}
                        <div className="max-w-md w-full mx-auto px-4 py-12">
                            {/* Reason for your feedback */}
                            <label className="block mb-2 text-sm font-medium text-[#2C3C4E]">
                                Reason for your feedback
                            </label>
                            <select
                                className="w-full mb-4 border border-gray-300 rounded-md px-3 py-4 text-sm
                         focus:outline-none focus:ring-1 focus:ring-[#0A84FF]"
                            >
                                <option>Select</option>
                                <option>Bug report</option>
                                <option>Feature request</option>
                                <option>Other</option>
                            </select>

                            {/* Add details */}
                            <label className="block mb-2 text-sm font-medium ">
                                Add details
                            </label>
                            <textarea
                                placeholder="Add additional information"
                                className="w-full h-24 mb-4 border border-gray-300 bg-[#F4F4F4] rounded-md px-4 py-2 text-sm
                         focus:outline-none focus:ring-1 focus:ring-[#0A84FF] resize-none"
                            />

                            {/* Send button */}
                            <br /> 
                            <button
                                type="button"
                                className="w-full bg-black text-white text-sm font-medium py-3 rounded-full hover:bg-gray-900 mb-4"
                            >
                                Send
                            </button>
                            <br /> 
                            {/* Informational text */}
                            <p className="text-sm  leading-5">
                                Thanks for reaching out. If you do have a specific question or need help resolving a problem,
                                you can contact us to connect with our support team.
                                <br />
                                Reach-out:{" "}
                                <a
                                    href="mailto:customerservice@fmr.ca"
                                    className="text-[#0A84FF] underline"
                                >
                                    customerservice@fmr.ca
                                </a>
                                <br />
                                We will try our best to get back to you as soon as possible.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
