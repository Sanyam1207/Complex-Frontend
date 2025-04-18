"use client";

import React, { useEffect, useState } from "react";
import { Knewave, Inter } from "next/font/google";
import Image from "next/image";
import { Menu as MenuIcon } from "lucide-react";
import SignUpModal from "./RegisterPopup";
import LoginModal from "./LoginPopup";
import MobileFilterModal from "./MobileFilterPopup";
import { usePathname, useRouter } from "next/navigation";
import LogoutModal from "./LogoutModal";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store"; // adjust path as needed
import OnBoardingPopup from "./OnboardingPopup";
import { useAuth } from "@/context/AuthContext";

// Fonts
const knewave = Knewave({
  weight: "400",
  subsets: ["latin"],
});
const inter = Inter({
  subsets: ["latin"],
});

export default function Navbar() {
  const hidePaths = [
    "/messages",
    "/wishlist",
    "/profile",
    "/notifications",
    "/personal-details",
    "/help-feedback",
    "/complete-account",
    "/create-listing-steps",
  ];

  const hidePathsSearch = [
    "/wishlist",
    "/profile",
    "/notifications",
    "/personal-details",
    "/help-feedback",
    "/complete-account",
    "/create-listing-steps",
  ];

  const router = useRouter();
  const pathname = usePathname();
  const shouldHide = hidePaths.some((path) => pathname.includes(path));
  const shouldHideSearch = hidePathsSearch.some((path) => pathname.includes(path));

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showSignUpModel, setShowSignUpModal] = useState(false);
  const [showMobileFilterModal, setShowMobileFilterModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [onBoardingPopup, setOnBoardingPopup] = useState(false);

  // Extract multiple fields from your filter slice
  const {
    selectedFilters,
    minValue,
    maxValue,
    bedrooms,
    bathrooms,
    selectedStayDuration,
    selectedSort,
  } = useSelector((state: RootState) => state.filter);

  // Compute the composite count
  const compositeCount =
    (minValue.trim() !== "" ? 1 : 0) +
    (maxValue.trim() !== "" ? 1 : 0) +
    (bedrooms.trim() !== "" ? 1 : 0) +
    (bathrooms.trim() !== "" ? 1 : 0) +
    (selectedStayDuration ? 1 : 0) +
    (selectedFilters.length > 0 ? 1 : 0) +
    (selectedSort !== "price" ? 1 : 0);

  // Handler for confirming deletion
  const handleLogout = () => {
    console.log("Listing deleted!");
    setShowLogoutModal(false);
  };

  const { isAuthenticated, user, logout, showLoginModal, setShowLoginModal } = useAuth();
  console.log(user)
  console.log(logout)


  // Only show onboarding to unauthenticated users and only once
  useEffect(() => {
    // Check if the user has already dismissed the onboarding
    const onboardingDismissed = localStorage.getItem('onboardingDismissed');
    
    // Only show onboarding if:
    // 1. User is not authenticated
    // 2. User hasn't dismissed onboarding before
    if (!isAuthenticated && !onboardingDismissed) {
      setOnBoardingPopup(true);
    } else {
      setOnBoardingPopup(false);
    }
  }, [isAuthenticated]);



  return (
    <nav className={`sticky top-0 z-10 bg-[#1c1c1c] text-white ${inter.className}`}>
      {/* 
        ==================
        MOBILE VIEW (<768px)
        ==================
        - First row: brand name centered
        - Second row: search bar (left) + mobile filter icon (right)
      */}
      <div className="md:hidden sticky top-0 w-full px-5 py-2 pt-3 rounded-t-3xl flex flex-col space-y-5">
        {/* 1) Brand in the middle */}
        <div className={`${shouldHide ? "hidden" : "flex"} items-center justify-center`}>
          <div className="mr-2 h-4 w-4 rounded-full bg-[#0A84FF]" />
          <span
            onClick={() => router.push("/home")}
            className={`cursor-pointer text-base ${knewave.className}`}
          >
            Findmyrentals
          </span>
        </div>

        {/* 2) Search Bar + filter icon as separate components */}
        {pathname === "/create-listing-steps" && (
          <h1 className="text-sm self-center text-white font-medium">Listing</h1>
        )}
        {pathname === "/messages" && (
          <h1 className="text-sm self-center text-white font-medium">Message</h1>
        )}
        <div className={`${shouldHideSearch ? "hidden" : "flex"} flex items-center justify-between`}>
          {/* Search Section */}
          <div className="bg-[#2F2F2F] rounded-full flex items-center py-2.5 flex-1 mr-3">
            <div className="bg-[#1c1c1c] p-2 rounded-full ml-2">
              <Image
                src="/icons/search-icon.svg"
                height={12}
                width={12}
                alt="search-icon"
              />
            </div>
            <input
              type="text"
              placeholder={`${pathname === "/messages" ? "Search messages" : "Search location"}`}
              className={`ml-3 flex-1 border-none outline-none bg-transparent text-[14px] text-white placeholder:text-white font-light tracking-[-0.3px] ${inter.className}`}
            />
          </div>

          {/* Mobile filter icon with chip indicator and conditional background */}
          <div className="relative flex-shrink-0">
                     <button
                       onClick={() => setShowMobileFilterModal(true)}
                       className={`h-11 w-11 rounded-full flex items-center justify-center relative ${compositeCount > 0 ? "bg-[#0A84FF]" : "bg-[#353537]"
                         }`}
                     >
                       <Image
                         src="/icons/mobileslider.svg"
                         alt="Slider Icon"
                         width={15}
                         height={12}
                       />
                       {compositeCount > 0 && (
                         <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                           {compositeCount}
                         </span>
                       )}
                     </button>
                   </div>
        </div>

        <MobileFilterModal
          isOpen={showMobileFilterModal}
          onClose={() => setShowMobileFilterModal(false)}
        />
      </div>

      {/* 
        ==================
        DESKTOP VIEW (>=768px)
        ==================
        - Original design with hamburger, user icon, "Create listing", etc.
      */}
      <div className="hidden md:flex md:flex-row md:items-center md:justify-between md:h-[80px] md:px-[7.5rem]">
        <div className="flex items-center">
          <div className="mr-4 h-[32px] w-[32px] rounded-full bg-[#0A84FF]" />
          <div
            onClick={() => router.push("/home")}
            className={`cursor-pointer text-[20px] ${knewave.className}`}
          >
            Findmyrentals
          </div>
          {pathname === "/complete-account" && (
            <div className={`ml-4 text-xl ${inter.className} text-white`}>Create Profile</div>
          )}
          {pathname === "/notifications" && (
            <div className={`ml-4 text-xl ${inter.className} text-white`}>Notifications</div>
          )}
        </div>

        <div className={`${shouldHide ? "hidden" : "flex"} items-center bg-[#2F2F2F] rounded-full px-4 py-2 w-[26.18rem]`}>
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

        <div className="flex flex-row items-center justify-center space-x-40">
          <button
            onClick={() => router.push("/create-listing")}
            type="button"
            className={`${pathname === "/create-listing-steps" ? "hidden" : "flex"} text-sm font-semibold bg-transparent text-white hover:underline hover:opacity-80 transition-all`}
          >
            Create listing
          </button>

          <div
            className={`${pathname === "/create-listing-steps" ? "hidden" : "flex"} relative flex items-center px-3 py-2 rounded-full transition-all duration-200 ${menuOpen || profileMenuOpen ? "bg-[#0A84FF]" : "bg-[#353537]"
              }`}
          >
            <button
              className="mr-4"
              onClick={() => {
                if (profileMenuOpen) setProfileMenuOpen(false);
                setMenuOpen((prev) => !prev);
              }}
            >
              <MenuIcon className="h-[1.25rem] w-[1.25rem] text-white" />
            </button>

            <button
              onClick={() => {
                setProfileMenuOpen((prev) => !prev);
                if (menuOpen) setMenuOpen(false);
              }}
              className="flex h-5 w-5 items-center justify-center rounded-full"
            >
              <Image src="/icons/userIcon.png" alt="User Icon" width={38} height={38} />
            </button>

            {menuOpen && (
              <div className="absolute right-2 top-[110%] mt-2 w-[10rem] bg-white text-black rounded-lg shadow-md">
                <ul className="flex flex-col py-2 text-[0.875rem]">
                  <li onClick={() => setShowLoginModal(true)} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                    Login
                  </li>
                  <li onClick={() => setShowSignUpModal((prev) => !prev)} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                    Sign up
                  </li>
                  <li onClick={() => router.push("/create-listing")} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                    List your place
                  </li>
                  <li onClick={() => router.push("/help-feedback")} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                    Help center
                  </li>
                </ul>
              </div>
            )}

            {profileMenuOpen && (
              <div className="absolute right-2 top-[110%] mt-2 w-[10rem] bg-white text-black rounded-lg shadow-md">
                <ul className="flex flex-col py-2 text-[0.875rem]">
                  <li onClick={() => router.push("/messages")} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                    Messages
                  </li>
                  <li onClick={() => router.push("/wishlist")} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                    Wishlist
                  </li>
                  <li onClick={() => router.push("/complete-account")} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                    Create profile
                  </li>
                  <li onClick={() => router.push("/notifications")} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                    Notifications
                  </li>
                  <li onClick={() => router.push("/personal-details")} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                    Personal detail
                  </li>
                  <li onClick={() => router.push("/help-feedback")} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                    Feedback
                  </li>
                  <li onClick={() => setShowLogoutModal(true)} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className={`${pathname === "/create-listing-steps" ? "flex" : "hidden"} flex-row items-center space-x-8`}>
          <button className="text-white font-inter text-[14px] font-semibold leading-[47px]">Feedback</button>
          <button className="flex flex-col justify-center bg-[#353537] rounded-full w-[78px] h-[39px] flex-shrink-0 text-white font-inter text-[14px] font-normal leading-[47px]">
            Exit
          </button>
        </div>
      </div>

      <SignUpModal isOpen={showSignUpModel} onClose={() => setShowSignUpModal(false)} />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
      <OnBoardingPopup setShowLoginModal={setShowLoginModal} setShowOnboardingPopup={setOnBoardingPopup} setShowSignupPopup={setShowSignUpModal} isOpen={onBoardingPopup}  onClose={() => {setOnBoardingPopup(false)}}  />
    </nav>
  );
}
