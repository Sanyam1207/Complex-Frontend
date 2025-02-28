"use client";

import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const inter = Inter({
  subsets: ["latin"],
});

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
  // All hooks are called unconditionally at the top
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Early return based on isOpen AFTER all hooks have been called
  if (!isOpen) return null;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
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
            className="w-full rounded-3xl bg-black py-3 text-white font-semibold hover:bg-gray-800 transition"
          >
            Login
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
              <button className="border border-[#E3E2E0] w-[3.813rem] h-[3rem] rounded-3xl flex items-center justify-center hover:opacity-80 transition">
                <Image src="/icons/googlelogo.svg" alt="Google" width={24} height={24} />
              </button>
              <span className="text-[#2C3C4E] text-[0.875rem]">Google</span>
            </div>
          </div>

          <div className="text-[#2C3C4E] text-sm my-8">
            Other ways to{" "}
            <Link onClick={() => {}} className="text-[#0A84FF]" href="">
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
            className="w-full mt-4 rounded-3xl bg-black py-3 text-white font-semibold hover:bg-gray-800 transition"
          >
            Login
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
              <button className="border border-[#E3E2E0] w-[3.813rem] h-[3rem] rounded-3xl flex items-center justify-center hover:opacity-80 transition">
                <Image src="/icons/googlelogo.svg" alt="Google" width={24} height={24} />
              </button>
              <span className="text-[#2C3C4E] text-[0.875rem]">Google</span>
            </div>
          </div>

          <div className="text-[#2C3C4E] text-sm my-8">
            Other ways to{" "}
            <Link className="text-[#0A84FF]" href="">
              sign up
            </Link>
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
