"use client";

import { closePopup, openPopup } from "@/redux/slices/showPopups";
import { Menu as MenuIcon } from "lucide-react";
import { Inter, Knewave } from "next/font/google";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import LoginModal from "./LoginPopup";
import LogoutModal from "./LogoutModal";
import MobileFilterModal from "./MobileFilterPopup";
import OnBoardingPopup from "./OnboardingPopup";
import SignUpModal from "./RegisterPopup";
import { closeFilterModal, openFilterModal } from "@/redux/slices/filterModalSlice";
import SearchResultsPanel from "./LocationSearchPopup";

import { clearSelectedLocation } from "@/redux/slices/locationSlice";
import { fetchPropertiesByCategory } from "@/redux/slices/categorySlice";

// Fonts
const knewave = Knewave({
  weight: "400",
  subsets: ["latin"],
});
const inter = Inter({
  subsets: ["latin"],
});

// Define category type for type safety
type CategoryType = 'privateRoom' | 'apartments' | 'houses' | 'sharing' | 'basement';

export default function Navbar() {
  const dispatch = useDispatch();
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
    '/create-listing',
    "/create-listing-steps",
  ];

  const router = useRouter();
  const pathname = usePathname();
  const shouldHide = hidePaths.some((path) => pathname.includes(path));
  const shouldHideSearch = hidePathsSearch.some((path) => pathname.includes(path));
  const [isInputFocused, setIsInputFocused] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const isFilterModalOpen = useSelector((state: RootState) => state.filterModal.isOpen);

  // Search state
  const [searchValue, setSearchValue] = useState("");
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);
  const { selectedLocation } = useSelector((state: RootState) => state.location);
  const { selectedCategory } = useSelector((state: RootState) => state.category) as { selectedCategory: CategoryType };
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    (minValue.trim() !== "0" ? 1 : 0) +
    (maxValue.trim() !== "" ? 1 : 0) +
    (bedrooms.trim() !== "" ? 1 : 0) +
    (bathrooms.trim() !== "" ? 1 : 0) +
    (selectedStayDuration ? 1 : 0) +
    (selectedFilters.length > 0 ? 1 : 0) +
    (selectedSort !== "price" ? 1 : 0);

  // Handler for confirming logout
  const handleLogout = () => {
    console.log("User logged out!");
    dispatch(closePopup('logout'));
  };

  // Open search panel when input is focused
  const handleInputFocus = () => {
    setIsSearchPanelOpen(true);
    setIsInputFocused(true);
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Don't immediately unfocus if user is clicking the clear button
    // We'll handle this in the clear button click handler
    if (!e.relatedTarget || !e.relatedTarget.classList.contains('search-clear-btn')) {
      setIsInputFocused(false);
    }
  };

  // Close search panel
  const handleCloseSearchPanel = () => {
    setIsSearchPanelOpen(false);

    // Blur the input when closing the panel
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);

    // If the input is cleared, also clear the location filter and refetch properties
    if (e.target.value === "") {
      dispatch(clearSelectedLocation());

      // Refetch properties by category when location filter is cleared
      // @ts-expect-error - TS might complain about dispatch type
      dispatch(fetchPropertiesByCategory(selectedCategory));
    }
  };

  // Clear search input and location filter
  const handleClearSearch = () => {
    // If there's a search value, clear it
    if (searchValue) {
      setSearchValue("");
      dispatch(clearSelectedLocation());

      // Refetch properties by category when location filter is cleared
      // @ts-expect-error - TS might complain about dispatch type
      dispatch(fetchPropertiesByCategory(selectedCategory));

      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    } else {
      // If there's no search value, just close the search panel
      setIsInputFocused(false);
      setIsSearchPanelOpen(false);

      // Blur the input
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
    }
  };

  // Handle key press in search input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsSearchPanelOpen(false); // Close the panel on Enter key

      // If the search input is empty, clear the location filter and refetch properties
      if (searchValue === "") {
        dispatch(clearSelectedLocation());

        // Refetch properties by category when location filter is cleared
        // @ts-expect-error - TS might complain about dispatch type
        dispatch(fetchPropertiesByCategory(selectedCategory));
      }

      // Blur the input to hide the keyboard on mobile
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
    }
  };

  // Set the search value when a location is selected
  useEffect(() => {
    if (selectedLocation) {
      setSearchValue(selectedLocation);
    } else {
      setSearchValue("");
    }
  }, [selectedLocation]);

  // Get a user-friendly placeholder for search based on the selected category
  const getSearchPlaceholder = (): string => {
    if (pathname === "/messages") return "Search messages";

    switch (selectedCategory) {
      case 'privateRoom': return "Search Location";
      case 'apartments': return "Search Location";
      case 'houses': return "Search Location";
      case 'sharing': return "Search Location";
      case 'basement': return "Search Location";
      default: return "Search location";
    }
  };

  return (
    <>
      <nav className={`sticky top-0 z-20 bg-[#1c1c1c] text-white ${inter.className}`}>
        {/* 
          ==================
          MOBILE VIEW (<768px)
          ==================
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

          {/* 2) Search Bar + filter icon */}
          {pathname === "/create-listing-steps" && (
            <h1 className="text-sm self-center text-white font-medium">Listing</h1>
          )}
          {pathname === "/messages" && (
            <h1 className="text-sm self-center text-white font-medium">Message</h1>
          )}
          <div className={`${shouldHideSearch ? "hidden" : "flex"} flex items-center justify-between`}>
            {/* Search Section */}
            <div className={`bg-[#2F2F2F] rounded-full flex items-center py-2.5 ${isInputFocused ? 'w-full' : 'flex-1 mr-3'}`}>
              <div className="bg-[#1c1c1c] p-2 rounded-full ml-2">
                <Image
                  src="/icons/search-icon.svg"
                  height={12}
                  width={12}
                  alt="search-icon"
                />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                placeholder={selectedLocation || getSearchPlaceholder()}
                className="ml-3 flex-1 text-[14px] text-white font-light tracking-[-0.3px] bg-transparent border-none outline-none"
              />
              {(searchValue || isInputFocused) && (
                <button
                  onClick={handleClearSearch}
                  className="mr-3 search-clear-btn"
                >
                  <div className="rounded-full w-5 h-5 flex items-center justify-center">
                   <Image
                    src="/icons/searchcancel.svg"
                    alt="Slider Icon"
                    width={32}
                    height={32}
                  />
                  </div>
                </button>
              )}
            </div>

            {/* Mobile filter icon - Hide when input is focused */}
            {!isInputFocused && (
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => dispatch(openFilterModal())}
                  className={`h-11 w-11 rounded-full flex items-center justify-center relative ${compositeCount > 0 ? "bg-[#0A84FF]" : "bg-[#353537]"}`}
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
            )}
          </div>

          <MobileFilterModal
            isOpen={isFilterModalOpen}
            onClose={() => dispatch(closeFilterModal())}
          />
        </div>

        {/* 
          ==================
          DESKTOP VIEW (>=768px)
          ==================
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

          {/* Desktop search bar */}
          <div
            className={`${shouldHide ? "hidden" : "flex"} items-center bg-[#2F2F2F] rounded-full px-4 py-2 w-[26.18rem]`}
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
              ref={searchInputRef}
              type="text"
              value={searchValue}
              onChange={handleSearchChange}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              placeholder={selectedLocation || getSearchPlaceholder()}
              className="ml-2 w-full border-none outline-none bg-transparent text-[14px] text-white placeholder-white"
            />
            {searchValue && (
              <button
                onClick={handleClearSearch}
                className="ml-2"
              >
                <div className="bg-[#8E8E93] rounded-full w-5 h-5 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M9 1L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </button>
            )}
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

              {/* Menu dropdowns (unchanged) */}
              {menuOpen && (
                <div className="absolute right-2 top-[110%] mt-2 w-[10rem] bg-white text-black rounded-lg shadow-md">
                  <ul className="flex flex-col py-2 text-[0.875rem]">
                    <li onClick={() => dispatch(openPopup('login'))} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
                      Login
                    </li>
                    <li onClick={() => dispatch(openPopup('signup'))} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
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
                    <li onClick={() => dispatch(openPopup('logout'))} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
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

        {/* Modals */}
        <SignUpModal />
        <LoginModal />
        <LogoutModal onConfirm={handleLogout} />
        <OnBoardingPopup />
      </nav>

      {/* Search Results Panel with Framer Motion */}
      <SearchResultsPanel
        isOpen={isSearchPanelOpen}
        onClose={handleCloseSearchPanel}
        searchValue={searchValue}
        onClearLocation={() => {
          dispatch(clearSelectedLocation());
          // Refetch properties by category when location filter is cleared
          // @ts-expect-error - TS might complain about dispatch type
          dispatch(fetchPropertiesByCategory(selectedCategory));
        }}
      />
    </>
  );
}