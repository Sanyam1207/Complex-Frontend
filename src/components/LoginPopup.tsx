"use client";

import api from "@/lib/axios";
import { closePopup, openPopup, selectIsPopupOpen, selectReturnUrl } from "@/redux/slices/showPopups";
import { RootState } from "@/redux/store/store";
import { AnimatePresence, motion } from "framer-motion";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const inter = Inter({
  subsets: ["latin"],
});

const LoginModal: React.FC = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => selectIsPopupOpen(state, 'login'));

  // // Get the return URL from Redux state
  // const currentUrl = window.location.pathname + window.location.search;
  // dispatch(setReturnUrl(currentUrl))

  const returnUrl = useSelector(selectReturnUrl);

  // All hooks are called unconditionally at the top
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Handle close action
  const handleClose = () => {
    dispatch(closePopup('login'));
  };

  // Handle opening signup modal
  const handleOpenSignup = () => {
    dispatch(closePopup('login'));
    dispatch(openPopup('signup'));
  };

  const handleOpenForgotPassword = () => {
    dispatch(closePopup('login'));
    dispatch(openPopup('forgotPassword'));
  }

  // Early return based on isOpen AFTER all hooks have been called
  if (!isOpen) return null;

  // Handle Google authentication
  const handleSubmitGoogle = async () => {
    try {
      // Store return URL in sessionStorage for OAuth callback
      if (returnUrl) {
        sessionStorage.setItem('loginReturnUrl', returnUrl);
      }
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Google auth error:", err);
      setEmailError("Failed to authenticate with Google");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setEmailError("");
    setPasswordError("");

    try {
      // Validate inputs
      if (!email) {
        setEmailError("Email is required");
        setIsLoading(false);
        return;
      }

      if (!password) {
        setPasswordError("Password is required");
        setIsLoading(false);
        return;
      }

      console.log("Attempting login with:", { email });

      try {
        const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
          email,
          password
        });

        console.log("Login response:", response.data);

        if (response.data.success === true) {
          // Store the token in localStorage
          localStorage.setItem('token', response.data.token);

          // You might want to store user info as well
          localStorage.setItem('user', JSON.stringify(response.data.user));

          // Close the modal
          dispatch(closePopup('login'));

          // Redirect to return URL or default to home
          const redirectUrl = returnUrl || '/home';

          // Get current URL (pathname + search params)
          const currentUrl = window.location.pathname + window.location.search;

          console.log('Current URL:', currentUrl);
          console.log('Redirect URL:', redirectUrl);

          // Function to normalize URLs for comparison
          const normalizeUrl = (url: string) => {
            // Remove trailing slashes and normalize
            return url.replace(/\/$/, '') || '/';
          };

          // Check if current URL matches redirect URL (normalized comparison)
          const normalizedCurrentUrl = normalizeUrl(currentUrl);
          const normalizedRedirectUrl = normalizeUrl(redirectUrl);

          if (normalizedCurrentUrl === normalizedRedirectUrl) {
            console.log('Current URL matches redirect URL, refreshing page...');
            // Refresh the current page
            window.location.reload();
          } else {
            console.log('Redirecting to:', redirectUrl);

            // If redirecting to home, include token in URL as before
            if (redirectUrl === '/home' || redirectUrl.startsWith('/home')) {
              router.push(`${redirectUrl}${redirectUrl.includes('?') ? '&' : '?'}token=${response.data.token}`);
            } else {
              // For other pages, just redirect without token in URL
              router.replace(redirectUrl);
            }
          }
        } else {
          // Check for specific error messages
          if (response.data.message?.toLowerCase().includes('email')) {
            setEmailError("Email not found");
          } else if (response.data.message?.toLowerCase().includes('password')) {
            setPasswordError("Incorrect password");
          } else {
            setEmailError("Email not found");
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // Handle Axios errors (like 401 Unauthorized)
        console.log("Axios error:", error);

        if (error.response?.status === 401) {
          // This is typically for invalid credentials
          setPasswordError("Incorrect password");
        } else {
          // For other types of errors
          setEmailError("Email not found");
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Unexpected error:", error);
      // Already handled in the try block
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${inter.className}`}>
      {/* Overlay / Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose} />

      {/* =======================
          DESKTOP VIEW
      ======================= */}
      <div className="hidden md:block relative z-50 w-[36rem] rounded-2xl bg-white px-28 py-10 shadow-lg">
        {/* Close Button */}
        <div className="absolute top-4 right-4 border rounded-full px-2 py-1 text-gray-500 hover:text-gray-800">
          <button onClick={handleClose} aria-label="Close">
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
            If you don&apos;t have an account, please sign up.
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
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
            className={`w-full rounded-md border ${emailError ? 'border-red-500' : 'border-gray-300'} bg-[#F4F4F4] p-2 outline-none text-[#2C3C4E]`}
          />
          {emailError && (
            <p className="text-red-500 text-xs -mt-2">{emailError}</p>
          )}

          {/* Password */}
          <label htmlFor="password" className="text-sm text-[#2C3C4E]">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
            className={`w-full rounded-md border ${passwordError ? 'border-red-500' : 'border-gray-300'} bg-[#F4F4F4] p-2 outline-none text-[#2C3C4E]`}
          />
          {passwordError && (
            <p className="text-red-500 text-xs -mt-2">{passwordError}</p>
          )}

          <br />
          <div className="text-[#0A84FF] text-sm">
            <p className="cursor-pointer" onClick={handleOpenForgotPassword}>Forgot Password ?</p>
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
            <Link onClick={handleOpenSignup} className="text-[#0A84FF]" href="#">
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
      <AnimatePresence>
        {isOpen && (
          <div className={`fixed md:hidden inset-0 flex flex-col text-[#2C3C4E] ${inter.className} z-40`}>
            {/* Dark overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />

            {/* Modal */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="absolute bottom-0 w-full h-[95%] bg-white rounded-t-2xl py-6 px-6 shadow-lg flex flex-col overflow-hidden z-50"
            >
              {/* Close Button */}
              <button onClick={handleClose} className="absolute top-4 right-4" aria-label="Close">
                <Image src="/icons/close.svg" width={24} height={24} alt="Close" />
              </button>

              {/* Star Icon */}
              <div className="absolute top-4 left-4">
                <Image src="/icons/stars.svg" alt="Star" width={24} height={24} />
              </div>

              {/* Title */}
              <div className="mb-8 mt-8">
                <h2 className="text-lg font-semibold mb-3 text-[#2C3C4E]">
                  Log in with your email and password.
                </h2>
                <h2 className="text-sm text-[#2C3C4E]">
                  If you don&apos;t have an account, please sign up.
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto">
                {/* Form */}
                <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                  {/* Email */}
                  <label htmlFor="email_mobile" className="flex flex-row items-center text-sm text-[#2C3C4E]">
                    Email <span>
                      {emailError && (
                        <p className="text-red-500 text-xs ml-3">{emailError}</p>
                      )}
                    </span>
                  </label>
                  <input
                    id="email_mobile"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                    className={`w-full rounded-md border ${emailError ? 'border-red-500' : 'border-gray-300'} p-2 outline-none text-[#2C3C4E] focus:border-black`}
                  />

                  {/* Password */}
                  <label htmlFor="password_mobile" className="text-sm flex flex-row items-center text-[#2C3C4E]">
                    Password <span>{passwordError && (
                      <p className="text-red-500 text-xs ml-3">{passwordError}</p>
                    )}</span>
                  </label>
                  <input
                    id="password_mobile"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                    className={`w-full rounded-md border ${passwordError ? 'border-red-500' : 'border-gray-300'} p-2 outline-none text-[#2C3C4E] focus:border-black`}
                  />

                  <div className="text-[#0A84FF] text-sm my-6 h-10">
                    <p onClick={handleOpenForgotPassword}>Forgot Password?</p>
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
                    <span className="text-[#0A84FF] cursor-pointer" onClick={handleOpenSignup}>
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginModal;