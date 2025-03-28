"use client";

import React, { useState } from "react";
import { Knewave, Inter } from "next/font/google";
import Image from "next/image";
import { Menu as MenuIcon } from "lucide-react";
import SignUpModal from "./RegisterPopup";
import LoginModal from "./LoginPopup";
import MobileFilterModal from "./MobileFilterPopup";
import { usePathname, useRouter } from "next/navigation";
import LogoutModal from "./LogoutModal";

// Fonts
const knewave = Knewave({
  weight: "400", // Knewave only has 400
  subsets: ["latin"],
});
const inter = Inter({
  subsets: ["latin"],
});

export default function Navbar() {
  const hidePaths = [
    '/messages',
    '/wishlist',
    '/profile',
    '/notifications',
    '/personal-details',
    '/help-feedback',
    '/complete-account',
    '/create-listing-steps'
  ];

  const hidePathsSearch = [
    '/wishlist',
    '/profile',
    '/notifications',
    '/personal-details',
    '/help-feedback',
    '/complete-account',
    '/create-listing-steps'
  ];

  const router = useRouter()
  const pathname = usePathname();
  const shouldHide = hidePaths.some((path) => pathname.includes(path));
  const shouldHideSearch = hidePathsSearch.some((path) => pathname.includes(path));

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showSignUpModel, setShowSignUpModal] = useState(false);
  const [showLoginModel, setShowLoginModal] = useState(false);
  const [showMobileFilterModal, setShowMobileFilterModal] = useState(false);

  const [showLogoutModal, setShowLogoutModal] = React.useState(false)

  // Handler for confirming deletion
  const handleLogout = () => {
    console.log('Listing deleted!')
    setShowLogoutModal(false)
  }

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
      <div className={`md:hidden w-full px-5 py-2 pt-3 rounded-t-3xl flex flex-col space-y-5`}>   
             {/* 1) Brand in the middle */}
        <div className={`${shouldHide ? 'hidden' : 'flex'} items-center justify-center`}>
          {/* Blue circle + brand text */}
          <div className="mr-2 h-4 w-4 rounded-full bg-[#0A84FF]" />
          <span onClick={() => { router.push('/home') }} className={`cursor-pointer text-base ${knewave.className}`}>
            Findmyrentals
          </span>
        </div>
        {/* 2) Search Bar + filter icon as separate components */}
        {
          pathname === "/create-listing-steps" && (
            <h1 className="text-sm self-center text-white font-medium">Listing</h1>
          )
        }

        {
          pathname === "/messages" && (
            <h1 className="text-sm self-center text-white font-medium">Message</h1>
          )
        }

        <div className={`${shouldHideSearch ? 'hidden' : 'flex'} flex items-center justify-between `}>
          {/* Search Section - completely separate */}
          <div className="bg-[#2F2F2F] rounded-full flex items-center py-2.5 flex-1 mr-3">
            <div className="bg-[#1c1c1c] p-2 rounded-full ml-2">
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
              className={`ml-3 flex-1 border-none outline-none bg-transparent text-[14px] text-white font-light tracking-[-0.3px] ${inter.className}`}
            />
          </div>

          {/* Mobile filter icon as completely separate element */}
          <div className="flex-shrink-0">
            <button
              onClick={() => setShowMobileFilterModal(true)}
              className="p-3.5 rounded-full bg-[#353537]"
            >
              <Image
                src="/icons/mobileslider.svg"
                alt="Slider Icon"
                width={18}
                height={18}
              />
            </button>
          </div>
        </div>

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
          md:h-[80px] md:px-[7.5rem]
        "
      >
        {/* Logo / Brand */}
        <div className="flex items-center">
          <div className="mr-4 h-[32px] w-[32px] rounded-full bg-[#0A84FF]" />
          <div onClick={() => { router.push('/home') }} className={`cursor-pointer text-[20px] ${knewave.className}`}>
            Findmyrentals
          </div>
          {
            pathname === "/complete-account" && (
              <div className={`ml-4 text-xl ${inter.className} text-white`}>Create Profile</div>
            )
          }


          {
            pathname === "/notifications" && (
              <div className={`ml-4 text-xl ${inter.className} text-white`}>Notifications</div>
            )
          }
        </div>

        {/* Search Bar (Desktop) */}
        <div
          className={`

          ${shouldHide ? 'hidden' : 'flex'} 
            items-center 
            bg-[#2F2F2F] 
            rounded-full 
            px-4 py-2 
            w-[26.18rem]
          `}
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

        <div className="flex flex-row items-center justify-center space-x-40">



          {/* Create listing button (Desktop only) */}
          <button
            onClick={() => { router.push('/create-listing') }}
            type="button"
            className={`  ${pathname === '/create-listing-steps' ? "hidden" : "flex"}
            text-sm font-semibold
            bg-transparent text-white
            hover:underline hover:opacity-80
            transition-all
          `}
          >
            Create listing
          </button>


          {/* Hamburger + User Icon (Desktop) */}
          <div
            className={` ${pathname === '/create-listing-steps' ? "hidden" : "flex"}
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
                  <li onClick={() => { router.push("/create-listing") }} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                    List your place
                  </li>
                  <li onClick={() => { router.push('/help-feedback') }} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
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
                  <li onClick={() => { router.push('/messages') }} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                    Messages
                  </li>
                  <li onClick={() => { router.push('/wishlist') }} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                    Wishlist
                  </li>
                  <li onClick={() => { router.push('/complete-account') }} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                    Create profile
                  </li>
                  <li onClick={() => { router.push('/notifications') }} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                    Notifications
                  </li>
                  <li onClick={() => { router.push('/personal-details') }} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                    Personal detail
                  </li>
                  <li onClick={() => { router.push('/help-feedback') }} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                    Feedback
                  </li>
                  <li onClick={() => { setShowLogoutModal(true) }} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>




        </div>





        <div className={`${pathname === '/create-listing-steps' ? 'flex' : 'hidden'} flex-row items-center space-x-8`}>
          {/* Feedback Button */}
          <button className="text-white font-inter text-[14px] font-semibold leading-[47px]">
            Feedback
          </button>

          {/* Exit Button */}
          <button className="flex flex-col justify-center bg-[#353537] rounded-full w-[78px] h-[39px] flex-shrink-0 
                     text-white font-inter text-[14px] font-normal leading-[47px]">
            Exit
          </button>
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
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

    </nav>
  );
}
