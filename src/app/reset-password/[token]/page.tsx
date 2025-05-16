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
                setSuccessMessage(`Link sent to ${userEmail}`);
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
                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full rounded-md border p-3 outline-none font-medium text-[#2C3C4E] bg-[#F4F4F4] focus:bg-white focus:border-black"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="confirmPassword" className="block text-[#2C3C4E] text-sm font-medium mb-1">
                                Re-enter your password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-md border p-3 outline-none font-medium text-[#2C3C4E] bg-[#F4F4F4] focus:bg-white focus:border-black"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-3xl bg-black py-3 text-white font-semibold hover:bg-gray-800 transition mb-6"
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