"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import api from "@/lib/axios";
import { useDispatch, useSelector } from "react-redux";
import { closePopup, openPopup, selectIsPopupOpen } from "@/redux/slices/showPopups";
import { RootState } from "@/redux/store/store";
import { AnimatePresence, motion } from "framer-motion";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
    weight: ["400", "500", "600", "700"],
});

const ForgotPasswordModal: React.FC = () => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state: RootState) => selectIsPopupOpen(state, 'forgotPassword'));

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Handle close action
    const handleClose = () => {
        dispatch(closePopup('forgotPassword'));
    };

    // Early return based on isOpen
    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        try {
            const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, { email });

            if (response.data.success) {
                setSuccess(true);
            } else {
                setError(response.data.message || "Failed to send reset link");
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.response?.data?.message || "An error occurred");
        }
    };

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
                    Forgot Password?
                </h2>

                {/* Message */}
                <p className="text-center text-sm text-gray-600 mb-6">
                    Enter the email address associated with your account, and we will email you a link to reset your password.
                </p>

                {/* Success Message */}
                {success && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md text-sm">
                        Reset link sent! Please check your email.
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
                    <label htmlFor="email" className="text-sm text-[#2C3C4E]">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full rounded-md border bg-[#F4F4F4] p-2 outline-none text-[#2C3C4E]"
                        required
                    />

                    <br />
                    <button
                        type="submit"
                        className="w-full rounded-full bg-black py-3 text-white font-semibold hover:bg-gray-800 transition"
                    >
                        Send reset link
                    </button>
                </form>

                {/* Back to Login */}
                <p className="mt-6 text-center text-sm">
                    <button
                        onClick={() => {
                            handleClose();

                            dispatch(openPopup('login'));
                        }}
                        className="text-blue-600 hover:underline"
                    >
                        Back to Login
                    </button>
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
                                Forgot Password?
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
                            <div className="h-full overflow-y-auto p-6 pt-10">
                                {/* Description */}
                                <p className={`text-[#2C3C4E] ${inter.className} font-medium mb-8`}>
                                    Enter the email address associated with your account, and we will email you a link to reset your password.
                                </p>

                                {/* Success Message */}
                                {success && (
                                    <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md text-sm">
                                        Reset link sent! Please check your email.
                                    </div>
                                )}

                                {/* Error Message */}
                                {error && (
                                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Form */}
                                <form className="flex flex-col mb-10 space-y-4" onSubmit={handleSubmit}>
                                    <label htmlFor="email-mobile" className="text-sm text-[#2C3C4E] font-medium">
                                        Email
                                    </label>
                                    <input
                                        id="email-mobile"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`w-full ${inter.className} rounded-md border p-2 outline-none font-medium text-[#2C3C4E] bg-[#F4F4F4] focus:bg-white focus:border-black`}
                                        required
                                    />

                                    <br />
                                    <button
                                        type="submit"
                                        className="w-full rounded-full bg-black py-4 text-white font-semibold hover:bg-gray-800 transition"
                                    >
                                        Send reset link
                                    </button>
                                </form>

                                {/* Back to Login */}
                                <p className="mt-6 text-center text-sm mb-8">
                                    <button
                                        onClick={() => {
                                            handleClose();
                                            // You might want to open the login modal here
                                            dispatch(openPopup('login'));
                                        }}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Back to Login
                                    </button>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ForgotPasswordModal;