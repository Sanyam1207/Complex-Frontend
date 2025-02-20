"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
});

interface SignUpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
    // If not open, don't render anything
    if (!isOpen) return null;

    // Local state for form inputs (controlled components)
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Handle form submission
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Here, you'd typically send the data to your server or handle validation
        console.log("Full Name:", fullName);
        console.log("Email:", email);
        console.log("Password:", password);

        // Clear form or close modal, etc., if you want
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${inter.className}`}>
            {/* Overlay / Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative z-50 w-[36rem] py-6 rounded-2xl bg-white px-28 shadow-lg">
                {/* Close Button (top-right) */}
                <div className="absolute top-4 px-2 py-1 right-4 border rounded-full text-gray-500 hover:text-gray-800">
                    <button
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>


                {/* Star Icon (top-left) */}
                <div className="absolute top-4 left-4">
                    <Image
                        src="/icons/stars.svg"
                        alt="Star"
                        width={24}
                        height={24}
                    />
                </div>

                {/* Title */}
                <h2 className="text-4xl font-semibold text-black text-center mt-4 mb-6">
                    Let’s Create Account Together!
                </h2>

                {/* Form */}
                <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
                    {/* Full Name */}
                    <label htmlFor="fullname" className="text-sm text-[#2C3C4E]">
                        Full Name
                    </label>
                    <input
                        id="fullname"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full rounded-md border bg-[#F4F4F4] p-2 outline-none text-[#2C3C4E]"
                    />

                    {/* Email */}
                    <label htmlFor="email" className="text-sm text-[#2C3C4E]">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-md border bg-[#F4F4F4] p-2 outline-none text-[#2C3C4E]"
                    />

                    {/* Password */}
                    <label htmlFor="password" className="text-sm text-[#2C3C4E]">
                        Create Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-md border bg-[#F4F4F4] p-2 outline-none text-[#2C3C4E]"
                    />

                    {/* Submit Button */}
                    <br />
                    <button
                        type="submit"
                        className="w-full rounded-3xl bg-black py-3 text-white font-semibold hover:bg-gray-800 transition"
                    >
                        Create account
                    </button>
                </form>

                {/* Continue With (Social) */}
                <div className="mt-6 text-center">
                    <p className="mb-2 text-sm text-gray-600">Continue with</p>
                    <div className="flex items-center justify-center space-x-4">
                        {/* Apple */}
                        <div className="flex flex-col items-center space-y-1">
                            <button className="border border-[#E3E2E0] w-[3.813rem] h-[3rem] rounded-3xl flex items-center justify-center hover:opacity-80 transition">
                                <Image
                                    src="/icons/applelogo.svg"
                                    alt="Apple"
                                    width={24}
                                    height={24}
                                />
                            </button>
                            <span className="text-[#2C3C4E] text-[0.875rem]">Apple</span>
                        </div>

                        {/* Facebook */}
                        <div className="flex flex-col items-center space-y-1">
                            <button className="border border-[#E3E2E0] w-[3.813rem] h-[3rem] rounded-3xl flex items-center justify-center hover:opacity-80 transition">
                                <Image
                                    src="/icons/facebooklogo.svg"
                                    alt="Facebook"
                                    width={24}
                                    height={24}
                                />
                            </button>
                            <span className="text-[#2C3C4E] text-[0.875rem]">Facebook</span>
                        </div>

                        {/* Google */}
                        <div className="flex flex-col items-center space-y-1">
                            <button className="border border-[#E3E2E0] w-[3.813rem] h-[3rem] rounded-3xl flex items-center justify-center hover:opacity-80 transition">
                                <Image
                                    src="/icons/googlelogo.svg"
                                    alt="Google"
                                    width={24}
                                    height={24}
                                />
                            </button>
                            <span className="text-[#2C3C4E] text-[0.875rem]">Google</span>
                        </div>
                    </div>
                </div>

                {/* Terms & Privacy */}
                <p className="mt-6 text-center text-xs text-gray-500">
                    By continuing, you agree to our{" "}
                    <a href="#" className="underline">
                        Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="underline">
                        Privacy Policy
                    </a>
                    .
                </p>
            </div>
        </div>
    );
};

export default SignUpModal;
