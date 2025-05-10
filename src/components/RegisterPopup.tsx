"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { closePopup, selectIsPopupOpen } from "@/redux/slices/showPopups";
import { RootState } from "@/redux/store/store";
import { AnimatePresence, motion } from "framer-motion";

const inter = Inter({
    subsets: ["latin"],
});

const SignUpModal: React.FC = () => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state: RootState) => selectIsPopupOpen(state, 'signup'));

    const [fullName, setFullName] = useState("");
    const router = useRouter();
    const [error, setError] = useState("");
    console.log(error)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Handle close action
    const handleClose = () => {
        dispatch(closePopup('signup'));
    };

    // Early return based on isOpen
    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, { email: email, password: password, fullName: fullName })
        console.log(response)

        if (response.data.success) {
            dispatch(closePopup('signup'));
            router.push(`/home?token=${response.data.token}`);
        }
    };

    const handleGoogleLogin = () => {
        console.log("Google login clicked");
        console.log(process.env.API_URL)

        setError('');

        try {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    }

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center ${inter.className}`}
        >
            {/* Overlay / Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={handleClose}
            />

            {/* ==========================
          DESKTOP VIEW
      ========================== */}
            <div className="hidden md:block relative z-50 w-[36rem] py-6 rounded-2xl bg-white px-28 shadow-lg">
                {/* Close Button */}
                <div className="absolute top-4 px-2 py-1 right-4 border rounded-full text-gray-500 hover:text-gray-800">
                    <button onClick={handleClose} aria-label="Close">
                        ✕
                    </button>
                </div>

                {/* Star Icon */}
                <div className="absolute top-4 left-4">
                    <Image src="/icons/stars.svg" alt="Star" width={24} height={24} />
                </div>

                {/* Title */}
                <h2 className="text-4xl font-semibold text-black text-center mt-4 mb-6">
                    Let&apos;s Create Account Together!
                </h2>

                {/* Form */}
                <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
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
                        <div className="flex flex-col items-center space-y-1">
                            <button onClick={handleGoogleLogin} className="border border-[#E3E2E0] w-[3.813rem] h-[3rem] rounded-3xl flex items-center justify-center hover:opacity-80 transition">
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

            {/* ==========================
          MOBILE VIEW (FULL SCREEN)
      ========================== */}

            <AnimatePresence>
                {isOpen && (
                    <div className={`fixed md:hidden inset-0 flex flex-col text-[#2C3C4E] ${inter.className} z-40`}>
                        {/* Dark overlay */}
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />

                        {/* Top Section */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-full flex-none bg-[#1F1F21] text-white p-5 z-50"
                        >
                            <div className="text-sm mt-4 text-center">
                                Sign up
                            </div>
                            <div className="mt-8 text-[2rem] font-semibold w-full text-left">
                                Let&apos;s Create
                                <br />
                                Account Together!
                            </div>
                            {/* Back Button */}
                            <div className="absolute top-8 left-4 bg-[#353537] h-7 w-7 rounded-full flex items-center justify-center">
                                <button onClick={handleClose} aria-label="Close">
                                    <Image src="/icons/backarrow.svg" height={12} width={12} alt="back arrow" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Bottom Form Section */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className="flex-grow bg-white rounded-t-2xl overflow-hidden relative z-50"
                        >


                            {/* Scrollable Content */}
                            <div className="h-full overflow-y-auto p-6 pt-14">
                                {/* Error Message */}
                                {error && (
                                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Form */}
                                <form className="flex flex-col mb-10 space-y-4" onSubmit={handleSubmit}>
                                    <label
                                        htmlFor="fullname-mobile"
                                        className="text-sm text-[#2C3C4E]"
                                    >
                                        Full Name
                                    </label>
                                    <input
                                        id="fullname-mobile"
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}

                                        className="w-full rounded-md border  p-2 outline-none text-[#2C3C4E] focus:border-black"

                                    />

                                    <label htmlFor="email-mobile" className="text-sm text-[#2C3C4E]">
                                        Email
                                    </label>
                                    <input
                                        id="email-mobile"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full rounded-md border p-2 outline-none text-[#2C3C4E] focus:border-black"

                                    />

                                    <label
                                        htmlFor="password-mobile"
                                        className="text-sm text-[#2C3C4E]"
                                    >
                                        Create Password
                                    </label>
                                    <input
                                        id="password-mobile"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full rounded-md border p-2 outline-none text-[#2C3C4E] focus:border-black"

                                    />

                                    <br />
                                    <button
                                        type="submit"
                                        className="w-full rounded-3xl bg-black py-4 text-white font-semibold hover:bg-gray-800 transition"
                                    >
                                        Create account
                                    </button>
                                </form>

                                {/* Continue With (Social) */}
                                <div className="mt-6 text-center">
                                    <p className="mb-8 text-sm text-gray-600">Continue with</p>
                                    <div className="flex items-center justify-center mb-10 space-x-4">
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
                                        <div className="flex flex-col items-center space-y-1">
                                            <button
                                                onClick={handleGoogleLogin}
                                                className="border border-[#E3E2E0] w-[3.813rem] h-[3rem] rounded-3xl flex items-center justify-center hover:opacity-80 transition"
                                            >
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
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default SignUpModal;