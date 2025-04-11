"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Inter, Knewave } from "next/font/google";
import MobileFilterModal from "./MobileFilterPopup";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import { Menu as MenuIcon } from "lucide-react";

// Fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});
const knewave = Knewave({ weight: "400", subsets: ["latin"] });

export default function MobileMessagesNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  // Mobile filter modal state (unchanged)
  const [showMobileFilterModal, setShowMobileFilterModal] = useState(false);

  // Desktop menus
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Extract filter data from Redux store
  const {
    selectedFilters,
    minValue,
    maxValue,
    bedrooms,
    bathrooms,
    selectedStayDuration,
    selectedSort,
  } = useSelector((state: RootState) => state.filter);

  // Compute composite filter count
  const compositeCount =
    (minValue.trim() !== "" ? 1 : 0) +
    (maxValue.trim() !== "" ? 1 : 0) +
    (bedrooms.trim() !== "" ? 1 : 0) +
    (bathrooms.trim() !== "" ? 1 : 0) +
    (selectedStayDuration ? 1 : 0) +
    (selectedFilters.length > 0 ? 1 : 0) +
    (selectedSort !== "price" ? 1 : 0);

  const handleLogout = () => {
    // Add your logout logic
    setShowLogoutModal(false);
  };

  return (
    <nav className={`sticky top-0 z-10 bg-[#1c1c1c] text-white ${inter.className}`}>
      {/* MOBILE VIEW (remains unchanged) */}
      <div className="md:hidden w-full mt-4 px-5 py-2 pt-3 rounded-t-3xl flex flex-col space-y-5">
        <h1 className="text-sm self-center text-white font-medium">Message</h1>
        <div className="flex items-center justify-between">
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
              placeholder="Search messages"
              className="ml-3 flex-1 border-none outline-none bg-transparent text-[14px] text-white font-light tracking-[-0.3px]"
            />
          </div>
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowMobileFilterModal(true)}
              className={`p-4 rounded-full relative ${
                compositeCount > 0 ? "bg-[#0A84FF]" : "bg-[#353537]"
              }`}
            >
              <Image
                src="/icons/mobileslider.svg"
                alt="Slider Icon"
                width={18}
                height={18}
              />
              {compositeCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {compositeCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <MobileFilterModal
        isOpen={showMobileFilterModal}
        onClose={() => setShowMobileFilterModal(false)}
      />

      {/* DESKTOP VIEW */}
      <div className="hidden md:flex  flex-col w-full">
        {/* TOP ROW: Logo, Brand, "Messages," "Create listing," and User/Hamburger menus */}
        <div className="flex w-full py-8 items-center justify-between px-32">
          <div className="flex items-center">
            <div className="mr-4 h-[32px] w-[32px] rounded-full bg-[#0A84FF]" />
            <div
              onClick={() => router.push("/home")}
              className={`cursor-pointer text-[20px] text-white ${knewave.className}`}
            >
              Findmyrentals
            </div>
            <div className={`${inter.className} ml-5 text-white text-[24px] leading-[40px] font-normal`}>
              Messages
            </div>
          </div>
          <div className="flex items-center space-x-20">
            <button
              onClick={() => router.push("/create-listing")}
              type="button"
              className={`${
                pathname === "/create-listing-steps" ? "hidden" : "flex"
              } text-sm font-semibold bg-transparent text-white hover:underline hover:opacity-80 transition-all`}
            >
              Create listing
            </button>
            <div
              className={`relative flex items-center px-3 py-2 rounded-full transition-all duration-200 ${
                menuOpen || profileMenuOpen ? "bg-[#0A84FF]" : "bg-[#353537]"
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
                <Image
                  src="/icons/userIcon.png"
                  alt="User Icon"
                  width={38}
                  height={38}
                />
              </button>
              {menuOpen && (
                <div className="absolute right-2 top-[110%] mt-2 w-[10rem] bg-white text-black rounded-lg shadow-md">
                  <ul className="flex flex-col py-2 text-[0.875rem]">
                    <li
                      onClick={() => setShowLoginModal(true)}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    >
                      Login
                    </li>
                    <li
                      onClick={() => setShowSignUpModal(true)}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    >
                      Sign up
                    </li>
                    <li
                      onClick={() => router.push("/create-listing")}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    >
                      List your place
                    </li>
                    <li
                      onClick={() => router.push("/help-feedback")}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    >
                      Help center
                    </li>
                  </ul>
                </div>
              )}
              {profileMenuOpen && (
                <div className="absolute right-2 top-[110%] mt-2 w-[10rem] bg-white text-black rounded-lg shadow-md">
                  <ul className="flex flex-col py-2 text-[0.875rem]">
                    <li
                      onClick={() => router.push("/messages")}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    >
                      Messages
                    </li>
                    <li
                      onClick={() => router.push("/wishlist")}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    >
                      Wishlist
                    </li>
                    <li
                      onClick={() => router.push("/complete-account")}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    >
                      Create profile
                    </li>
                    <li
                      onClick={() => router.push("/notifications")}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    >
                      Notifications
                    </li>
                    <li
                      onClick={() => router.push("/personal-details")}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    >
                      Personal detail
                    </li>
                    <li
                      onClick={() => router.push("/help-feedback")}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    >
                      Feedback
                    </li>
                    <li
                      onClick={() => setShowLogoutModal(true)}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECOND ROW: Three grouped sections */}
        <div className="flex w-full items-center justify-between px-32 py-8 border-t border-[#2F2F2F]">
          {/* Group 1: Search messages input and Sort button */}
          <div className="flex items-center grow space-x-6">
            <div className="flex items-center bg-[#2F2F2F] rounded-full px-4 py-2 w-[17.18rem]">
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
                placeholder="Search messages"
                className="ml-2 w-full border-none outline-none font-light bg-transparent text-[14px] text-white placeholder-white"
              />
            </div>
            <button className="bg-[#353537] text-white px-6 py-2.5 rounded-full font-medium hover:opacity-80 transition-all">
              Sort
            </button>
          </div>

          {/* Group 2: Property image (with address) and View button */}
          <div className="flex grow items-center space-x-28">
            <div className="flex items-center">
              <Image
                src="/icons/placeholderimageformessage.svg"
                alt="property"
                width={34}
                height={34}
                className="rounded-full object-cover w-12 h-12 mr-2"
              />
              <span className="text-white text-sm font-medium">
                2858 Main Street
              </span>
            </div>
            <button className="bg-[#353537] text-white px-5 py-2 rounded-full font-normal hover:opacity-80 transition-all">
              View
            </button>
          </div>

          {/* Group 3: Renter and Landlord buttons */}
          <div className="flex items-center space-x-5">
            <button className="bg-[#353537] text-white px-5 py-2 rounded-full font-normal hover:opacity-80 transition-all">
              Renter
            </button>
            <button className="bg-[#353537] text-white px-5 py-2 rounded-full font-normal hover:opacity-80 transition-all">
              Landlord
            </button>
          </div>
        </div>
      </div>

      {/* PLACEHOLDER MODALS */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md text-black">
            <p>Are you sure you want to logout?</p>
            <div className="flex mt-4 space-x-2">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md text-black">
            <p>Login Form Here</p>
            <button
              onClick={() => setShowLoginModal(false)}
              className="mt-4 px-4 py-2 bg-gray-300 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showSignUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md text-black">
            <p>Sign Up Form Here</p>
            <button
              onClick={() => setShowSignUpModal(false)}
              className="mt-4 px-4 py-2 bg-gray-300 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
