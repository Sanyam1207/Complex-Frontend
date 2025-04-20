"use client";

import api from "@/lib/axios";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const inter = Inter({
  subsets: ["latin"],
});

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  setOnOpenSignup: (isOpen: boolean) => void;
}

const LoginModal: React.FC<SignUpModalProps> = ({ isOpen, onClose, setOnOpenSignup }) => {
  // All hooks are called unconditionally at the top
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Early return based on isOpen AFTER all hooks have been called
  if (!isOpen) return null;

  // Handle Google authentication
  const handleSubmitGoogle = async () => {
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Google auth error:", err);
      setError("Failed to authenticate with Google");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Validate inputs
      if (!email || !password) {
        setError("Email and password are required");
        setIsLoading(false);
        return;
      }
      
      console.log("Attempting login with:", { email });
      
      const response = await api.post('/api/auth/login', { 
        email, 
        password 
      });
      
      console.log("Login response:", response.data);
      
      if (response.data.success === true) {
        // Store the token in localStorage
        localStorage.setItem('token', response.data.token);

        // You might want to store user info as well
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Redirect to homepage or dashboard
        router.push(`/home?token=${response.data.token}`);
      } else {
        setError(response.data.message || "Login failed");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Incorrect email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${inter.className}`}>
      {/* Overlay / Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* =======================
          DESKTOP VIEW
      ======================= */}
      <div className="hidden md:block relative z-50 w-[36rem] rounded-2xl bg-white px-28 py-10 shadow-lg">
        {/* Close Button */}
        <div className="absolute top-4 right-4 border rounded-full px-2 py-1 text-gray-500 hover:text-gray-800">
          <button onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Star Icon */}
        <div className="absolute top-4 left-4">
          <Image src="/icons/stars.svg" alt="Star" width={24} height={24} />
        </div>

        {/* Title */}
        <div className="mb-7">
          <h2 className="text-lg font-semibold mb-2 text-[#2C3C4E]">
            Log in with your email and password.
          </h2>
          <h2 className="text-base text-[#2C3C4E]">
            Log in with your email and password.
          </h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
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
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border bg-[#F4F4F4] p-2 outline-none text-[#2C3C4E]"
          />

          <br />
          <div className="text-[#0A84FF] text-sm">
            <Link href="">Forgot Password ?</Link>
          </div>
          <br />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-3xl bg-black py-3 text-white font-semibold hover:bg-gray-800 transition disabled:bg-gray-400"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Continue With (Social) */}
        <div className="mt-6 text-center">
          <p className="mb-4 text-sm text-gray-600">Continue with</p>
          <div className="flex items-center justify-center space-x-4">
            {/* Apple */}
            <div className="flex flex-col items-center space-y-1">
              <button className="border border-[#E3E2E0] w-[3.813rem] h-[3rem] rounded-3xl flex items-center justify-center hover:opacity-80 transition">
                <Image src="/icons/applelogo.svg" alt="Apple" width={24} height={24} />
              </button>
              <span className="text-[#2C3C4E] text-[0.875rem]">Apple</span>
            </div>

            {/* Facebook */}
            <div className="flex flex-col items-center space-y-1">
              <button className="border border-[#E3E2E0] w-[3.813rem] h-[3rem] rounded-3xl flex items-center justify-center hover:opacity-80 transition">
                <Image src="/icons/facebooklogo.svg" alt="Facebook" width={24} height={24} />
              </button>
              <span className="text-[#2C3C4E] text-[0.875rem]">Facebook</span>
            </div>

            {/* Google */}
            <div className="flex flex-col items-center space-y-1">
              <button 
                onClick={handleSubmitGoogle} 
                className="border border-[#E3E2E0] w-[3.813rem] h-[3rem] rounded-3xl flex items-center justify-center hover:opacity-80 transition"
              >
                <Image src="/icons/googlelogo.svg" alt="Google" width={24} height={24} />
              </button>
              <span className="text-[#2C3C4E] text-[0.875rem]">Google</span>
            </div>
          </div>

          <div className="text-[#2C3C4E] text-sm my-8">
            Other ways to{" "}
            <Link onClick={() => {
              onClose();
              setOnOpenSignup(true);
            }} className="text-[#0A84FF]" href="#">
              sign up
            </Link>
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

      {/* =======================
          MOBILE VIEW
      ======================= */}
      <div className="block md:hidden absolute bottom-0 z-50 w-full max-w-md mx-auto rounded-t-2xl bg-white px-6 py-8 shadow-lg">
        {/* Close Button */}
        <div className="absolute top-4 right-4 border rounded-full px-2 py-1 text-gray-500 hover:text-gray-800">
          <button onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Star Icon */}
        <div className="absolute top-4 left-4">
          <Image src="/icons/stars.svg" alt="Star" width={24} height={24} />
        </div>

        {/* Title */}
        <div className="mb-8 mt-8">
          <h2 className="text-lg font-semibold mb-3 text-[#2C3C4E]">
            Log in with your email and password.
          </h2>
          <h2 className="text-base text-[#2C3C4E]">
            Log in with your email and password.
          </h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <label htmlFor="email_mobile" className="text-sm text-[#2C3C4E]">
            Email
          </label>
          <input
            id="email_mobile"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border bg-[#F4F4F4] p-2 outline-none text-[#2C3C4E]"
          />

          {/* Password */}
          <label htmlFor="password_mobile" className="text-sm text-[#2C3C4E]">
            Password
          </label>
          <input
            id="password_mobile"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border bg-[#F4F4F4] p-2 outline-none text-[#2C3C4E]"
          />

          <div className="text-[#0A84FF] text-sm my-6 h-10">
            <Link href="">Forgot Password ?</Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 rounded-3xl bg-black py-3 text-white font-semibold hover:bg-gray-800 transition disabled:bg-gray-400"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Continue With (Social) */}
        <div className="mt-8 text-center">
          <p className="mb-4 text-sm text-gray-600">Continue with</p>
          <div className="flex items-center justify-center space-x-4">
            {/* Apple */}
            <div className="flex flex-col items-center space-y-1">
              <button className="border border-[#E3E2E0] w-[3.813rem] h-[3rem] rounded-3xl flex items-center justify-center hover:opacity-80 transition">
                <Image src="/icons/applelogo.svg" alt="Apple" width={24} height={24} />
              </button>
              <span className="text-[#2C3C4E] text-[0.875rem]">Apple</span>
            </div>

            {/* Facebook */}
            <div className="flex flex-col items-center space-y-1">
              <button className="border border-[#E3E2E0] w-[3.813rem] h-[3rem] rounded-3xl flex items-center justify-center hover:opacity-80 transition">
                <Image src="/icons/facebooklogo.svg" alt="Facebook" width={24} height={24} />
              </button>
              <span className="text-[#2C3C4E] text-[0.875rem]">Facebook</span>
            </div>

            {/* Google */}
            <div className="flex flex-col items-center space-y-1">
              <button 
                onClick={handleSubmitGoogle}
                className="border border-[#E3E2E0] w-[3.813rem] h-[3rem] rounded-3xl flex items-center justify-center hover:opacity-80 transition"
              >
                <Image src="/icons/googlelogo.svg" alt="Google" width={24} height={24} />
              </button>
              <span className="text-[#2C3C4E] text-[0.875rem]">Google</span>
            </div>
          </div>

          <div className="text-[#2C3C4E] text-sm my-8">
            Other ways to{" "}
            <span className="text-[#0A84FF]" onClick={() => {
              onClose()
              setOnOpenSignup(true)
            }}>
              sign up
            </span>
          </div>
        </div>

        {/* Terms & Privacy */}
        <p className="mt-2 text-center text-xs text-gray-500">
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

export default LoginModal;