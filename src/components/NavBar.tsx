"use client";

import React, { useState } from "react";
import { Knewave, Inter } from "next/font/google";
import Image from "next/image";
import { Menu as MenuIcon } from "lucide-react";
import SignUpModal from "./RegisterPopup";
import LoginModal from "./LoginPopup";
import MobileFilterModal from "./MobileFilterPopup";
import { usePathname, useRouter } from "next/navigation";

// Fonts
const knewave = Knewave({
  weight: "400", // Knewave only has 400
  subsets: ["latin"],
});
const inter = Inter({
  subsets: ["latin"],
});

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showSignUpModel, setShowSignUpModal] = useState(false);
  const [showLoginModel, setShowLoginModal] = useState(false);
  const [showMobileFilterModal, setShowMobileFilterModal] = useState(false);

  return (
    <nav
      className={`
        sticky top-0 z-10
        bg-[#1c1c1c] text-white
        ${inter.className}
      `}
    >
      {/* 
        ==================
        MOBILE VIEW (<768px)
        ==================
        - First row: brand name centered
        - Second row: search bar (left) + mobileslider icon (right)
      */}
      <div className="md:hidden w-full px-4 py-4 flex flex-col space-y-5">
        {/* 1) Brand in the middle */}
        <div className="flex items-center justify-center">
          {/* Blue circle + brand text */}
          <div className="mr-2 h-4 w-4 rounded-full bg-[#0A84FF]" />
          <span onClick={() => {router.push('/home')}} className={`cursor-pointer text-base ${knewave.className}`}>
            Findmyrentals
          </span>
        </div>

        {/* 2) Search Bar + mobileslider icon in same row */}
        {pathname === "/create-listing-steps" ? (
          <h1 className="text-base self-center text-white font-bold">Listing</h1>
        ) : (
          <div className="flex items-center justify-between bg-[#2F2F2F] rounded-full px-4 py-2">
            {/* Search Section */}
            <div className="flex items-center">
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
                className="ml-2 w-full border-none outline-none bg-transparent text-[14px] text-white placeholder-white"
              />
            </div>

            {/* Mobile slider icon */}
            <button
              onClick={() => setShowMobileFilterModal(true)}
              className="p-2 ml-2 rounded-full bg-[#353537]"
            >
              <Image
                src="/icons/mobileslider.svg"
                alt="Slider Icon"
                width={20}
                height={20}
              />
            </button>
          </div>
        )}
        <MobileFilterModal isOpen={showMobileFilterModal} onClose={() => { setShowMobileFilterModal(false) }} />
      </div>

      {/* 
        ==================
        DESKTOP VIEW (>=768px)
        ==================
        - Original design with hamburger, user icon, "Create listing", etc.
      */}
      <div
        className="
          hidden 
          md:flex md:flex-row md:items-center md:justify-between 
          md:h-[100px] md:px-[7.5rem]
        "
      >
        {/* Logo / Brand */}
        <div className="flex items-center">
          <div className="mr-4 h-[32px] w-[32px] rounded-full bg-[#0A84FF]" />
          <div onClick={() => {router.push('/home')}} className={`cursor-pointer text-[20px] ${knewave.className}`}>
            Findmyrentals
          </div>
        </div>

        {/* Search Bar (Desktop) */}
        <div
          className="
            flex items-center 
            bg-[#2F2F2F] 
            rounded-full 
            px-4 py-2 
            w-[26.18rem]
          "
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

        {/* Create listing button (Desktop only) */}
        <button
          onClick={() => { router.push('/create-listing') }}
          type="button"
          className="
            text-sm font-semibold
            bg-transparent text-white
            hover:underline hover:opacity-80
            transition-all
          "
        >
          Create listing
        </button>

        {/* Hamburger + User Icon (Desktop) */}
        <div
          className={`
            relative flex items-center
            px-3 py-2 rounded-full
            transition-all duration-200
            ${menuOpen || profileMenuOpen ? "bg-[#0A84FF]" : "bg-[#353537]"}
          `}
        >
          {/* Hamburger Icon -> toggles the dropdown */}
          <button
            className="mr-4"
            onClick={() => {
              if (profileMenuOpen) setProfileMenuOpen(false);
              setMenuOpen((prev) => !prev);
            }}
          >
            <MenuIcon className="h-[1.25rem] w-[1.25rem] text-white" />
          </button>

          {/* User Icon -> toggles profile menu */}
          <button
            onClick={() => {
              setProfileMenuOpen((prev) => !prev);
              if (menuOpen) setMenuOpen(false);
            }}
            className="flex h-5 w-5 items-center justify-center rounded-full"
          >
            <Image
              src="/icons/userIcon.png"
              alt="User Icon"
              width={38}
              height={38}
            />
          </button>

          {/* Dropdown Menu main */}
          {menuOpen && (
            <div
              className="
                absolute right-2 top-[110%] mt-2
                w-[10rem]
                bg-white text-black
                rounded-lg shadow-md
              "
            >
              <ul className="flex flex-col py-2 text-[0.875rem]">
                <li
                  onClick={() => setShowLoginModal((prev) => !prev)}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                >
                  Login
                </li>
                <li
                  onClick={() => setShowSignUpModal((prev) => !prev)}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                >
                  Sign up
                </li>
                <li onClick={() => {router.push("/create-listing")}} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                  List your place
                </li>
                <li className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                  Help center
                </li>
              </ul>
            </div>
          )}

          {/* Dropdown Menu For Profile */}
          {profileMenuOpen && (
            <div
              className="
                absolute right-2 top-[110%] mt-2
                w-[10rem]
                bg-white text-black
                rounded-lg shadow-md
              "
            >
              <ul className="flex flex-col py-2 text-[0.875rem]">
                <li className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                  Messages
                </li>
                <li className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                  Wishlist
                </li>
                <li onClick={() => {router.push('/complete-account')}} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                  Create profile
                </li>
                <li className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                  Notifications
                </li>
                <li className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                  Personal detail
                </li>
                <li className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                  Feedback
                </li>
                <li className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Sign Up & Login Modals */}
      <SignUpModal
        isOpen={showSignUpModel}
        onClose={() => setShowSignUpModal(false)}
      />
      <LoginModal
        isOpen={showLoginModel}
        onClose={() => setShowLoginModal(false)}
      />
    </nav>
  );
}
