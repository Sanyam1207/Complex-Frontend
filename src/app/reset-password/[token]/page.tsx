"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import api from "@/lib/axios";
import { useRouter, useParams } from "next/navigation";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
    weight: ["400", "500", "600", "700"],
});

const ResetPasswordPage = () => {
    const router = useRouter();
    const params = useParams();
    const token = params?.token as string;
    console.log("Token:", token);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [tokenValid, setTokenValid] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    console.log(userEmail)
    const [showNewPassword, setShowNewPassword] = useState(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) return;

            try {
                setLoading(true);
                const response = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password/${token}`);
                
                if (response.data.success) {
                    setTokenValid(true);
                    setUserEmail(response.data.email || "");
                } else {
                    setError("Password reset link is invalid or has expired");
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                setError(err.response?.data?.message || "Password reset link is invalid or has expired");
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleGoBack = () => {
        router.push("/login");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        
        // Validate passwords match
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        
        try {
            const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, { 
                token, 
                password: newPassword 
            });
            
            if (response.data.success) {
                setSuccessMessage(`Password Reset Successful`);
                // Optionally redirect after a delay
                setTimeout(() => {
                    router.push("/login");
                }, 3000);
            } else {
                setError(response.data.message || "Failed to reset password");
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.response?.data?.message || "An error occurred");
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen bg-[#1F1F21] text-white ${inter.className}`}>
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-[80vh]">
                        <p>Verifying reset link...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!tokenValid && !loading) {
        return (
            <div className={`min-h-screen bg-[#1F1F21] text-white ${inter.className}`}>
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center justify-center h-[80vh]">
                        <div className="bg-red-100 text-red-700 p-4 rounded-md w-full max-w-md mb-4">
                            <p className="font-medium">Invalid Reset Link</p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                        <button
                            onClick={handleGoBack}
                            className="w-full max-w-md rounded-3xl bg-black py-3 text-white font-semibold hover:bg-gray-800 transition border border-gray-700"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-[#1F1F21] text-white ${inter.className}`}>
            {/* Header */}
            <div className="p-5 relative">
                <div className="text-sm mt-4 text-center">
                    Update Password
                </div>
                <div className="absolute top-8 left-4 bg-[#353537] h-7 w-7 rounded-full flex items-center justify-center">
                    <button onClick={handleGoBack} aria-label="Back">
                        <Image src="/icons/backarrow.svg" height={12} width={12} alt="back arrow" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-t-2xl mt-4 text-[#2C3C4E] min-h-[calc(100vh-100px)]">
                <div className="p-6">
                    <h2 className="text-[#2C3C4E] font-medium text-lg mb-6">
                        Secure your account with a new password!
                    </h2>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="newPassword" className="block text-[#2C3C4E] text-sm font-medium mb-1">
                                New password
                            </label>
                            <div className="relative">
                                <input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full rounded-md border p-3 pr-12 outline-none font-medium text-[#2C3C4E] bg-[#F4F4F4] focus:bg-white focus:border-black"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                    {showNewPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M2.458 12C3.732 7.943 7.523 5 12 5C16.478 5 20.268 7.943 21.542 12C20.268 16.057 16.478 19 12 19C7.523 19 3.732 16.057 2.458 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="confirmPassword" className="block text-[#2C3C4E] text-sm font-medium mb-1">
                                Re-enter your password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-md border p-3 pr-12 outline-none font-medium text-[#2C3C4E] bg-[#F4F4F4] focus:bg-white focus:border-black"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                    {showConfirmPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M2.458 12C3.732 7.943 7.523 5 12 5C16.478 5 20.268 7.943 21.542 12C20.268 16.057 16.478 19 12 19C7.523 19 3.732 16.057 2.458 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-full bg-black py-3 text-white font-semibold hover:bg-gray-800 transition mb-6"
                        >
                            Update
                        </button>
                    </form>

                    {/* Success message at the bottom */}
                    {successMessage && (
                        <div className="fixed bottom-0 left-0 right-0 bg-[#262626] text-white p-4 flex items-center">
                            <div className="bg-green-500 rounded-full h-5 w-5 flex items-center justify-center mr-3">
                                <span className="text-white text-xs">✓</span>
                            </div>
                            <span className="text-sm">{successMessage}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;