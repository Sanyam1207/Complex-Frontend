"use client";

import { applyFilters } from "@/redux/slices/categorySlice";
import { closeFilterModal, openFilterModal } from "@/redux/slices/filterModalSlice";
import { closePopup, openPopup } from "@/redux/slices/showPopups";
import { Menu as MenuIcon } from "lucide-react";
import { Inter, Knewave } from "next/font/google";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import SearchResultsPanel from "./LocationSearchPopup";
import LoginModal from "./LoginPopup";
import LogoutModal from "./LogoutModal";
import MobileFilterModal from "./MobileFilterPopup";
import OnBoardingPopup from "./OnboardingPopup";
import SignUpModal from "./RegisterPopup";

import { fetchPropertiesByCategory } from "@/redux/slices/categorySlice";
import { clearSelectedLocation, setSelectedLocation } from "@/redux/slices/locationSlice";
import ForgotPasswordModal from "./ForgotPassword";

import axios from "axios";

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
  const [isDesktopSearchPanelOpen, setIsDesktopSearchPanelOpen] = useState(false);
  const { selectedLocation } = useSelector((state: RootState) => state.location);
  const { selectedCategory } = useSelector((state: RootState) => state.category) as { selectedCategory: CategoryType };
  const searchInputRef = useRef<HTMLInputElement>(null);
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const desktopSearchContainerRef = useRef<HTMLDivElement>(null);

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




  const [locations, setLocations] = useState<string[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  console.log(` locations: ${locationError}`);

  // Get recent searches from Redux
  const { recentSearches } = useSelector((state: RootState) => state.location);







  // Debounce search input and fetch locations
  useEffect(() => {
    if (!searchValue || searchValue.length < 2) {
      setLocations([]);
      return;
    }

    const timer = setTimeout(() => {
      fetchLocations(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);





















  const fetchLocations = async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      setLocations([]);
      return;
    }

    setIsLoadingLocations(true);
    setLocationError(null);

    try {
      // API base URL should come from environment variables in production
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      const response = await axios.get(`${API_BASE_URL}/api/locations`, {
        params: { search: searchTerm }
      });

      if (response.data && response.data.success) {
        setLocations(response.data.data);
      } else {
        setLocationError("Failed to fetch locations");
        // Fallback to some mock data for testing
        setLocations([
          `${searchTerm}, Ontario`,
          `${searchTerm}, BC`,
          `${searchTerm}, Alberta`
        ]);
      }
    } catch (err) {
      console.error("Error fetching locations:", err);
      setLocationError("Error connecting to the server");
      // Fallback to some mock data for testing
      setLocations([
        `${searchTerm}, Ontario`,
        `${searchTerm}, BC`,
        `${searchTerm}, Alberta`
      ]);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  // Function to handle location selection
  const handleLocationSelect = (location: string) => {
    // Dispatch location to Redux
    dispatch(setSelectedLocation(location));

    // Trigger filter application
    dispatch(applyFilters());

    // Close panels
    setIsSearchPanelOpen(false);
    setIsDesktopSearchPanelOpen(false);

    // Blur inputs
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
    if (desktopSearchInputRef.current) {
      desktopSearchInputRef.current.blur();
    }
  };

  // Function to get user's current location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log(`${lng} ${lat}`);

        // In a real app, you'd use a reverse geocoding service here
        // For now, just use "Current Location" as the location string
        dispatch(setSelectedLocation("Current Location"));

        // Trigger filter application
        dispatch(applyFilters());

        // Close panels
        setIsSearchPanelOpen(false);
        setIsDesktopSearchPanelOpen(false);

        // Blur inputs
        if (searchInputRef.current) {
          searchInputRef.current.blur();
        }
        if (desktopSearchInputRef.current) {
          desktopSearchInputRef.current.blur();
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location. Please check your permissions.");
      }
    );
  };



















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

  // Handle desktop search focus
  const handleDesktopInputFocus = () => {
    setIsDesktopSearchPanelOpen(true);
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

  // Clear desktop search
  const handleClearDesktopSearch = () => {
    if (searchValue) {
      setSearchValue("");
      dispatch(clearSelectedLocation());

      // Refetch properties by category when location filter is cleared
      // @ts-expect-error - TS might complain about dispatch type
      dispatch(fetchPropertiesByCategory(selectedCategory));

      if (desktopSearchInputRef.current) {
        desktopSearchInputRef.current.focus();
      }
    } else {
      setIsDesktopSearchPanelOpen(false);

      if (desktopSearchInputRef.current) {
        desktopSearchInputRef.current.blur();
      }
    }
  };

  // Handle key press in search input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Close the appropriate panel based on viewport
      if (window.innerWidth >= 768) {
        setIsDesktopSearchPanelOpen(false);
      } else {
        setIsSearchPanelOpen(false);
      }

      // If the search input is empty, clear the location filter and refetch properties
      if (searchValue === "") {
        dispatch(clearSelectedLocation());

        // Refetch properties by category when location filter is cleared
        // @ts-expect-error - TS might complain about dispatch type
        dispatch(fetchPropertiesByCategory(selectedCategory));
      }

      // Blur the inputs
      if (searchInputRef.current) {
        searchInputRef.current.blur();
      }
      if (desktopSearchInputRef.current) {
        desktopSearchInputRef.current.blur();
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

  // Handle clicks outside of the desktop search panel to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the desktop search panel is open
      if (isDesktopSearchPanelOpen) {
        // Check if the click was outside the search container and not on the input
        if (
          desktopSearchContainerRef.current &&
          !desktopSearchContainerRef.current.contains(event.target as Node) &&
          desktopSearchInputRef.current !== event.target
        ) {
          setIsDesktopSearchPanelOpen(false);
        }
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDesktopSearchPanelOpen]);

  // Get a user-friendly placeholder for search based on the selected category
  const getSearchPlaceholder = (): string => {
    if (pathname === "/messages") return "Search messages";

    switch (selectedCategory) {
      case 'privateRoom': return "Search location";
      case 'apartments': return "Search location";
      case 'houses': return "Search location";
      case 'sharing': return "Search location";
      case 'basement': return "Search location";
      default: return "Search location";
    }
  };

  // Function to handle location selection (shared between mobile and desktop)
  // const handleLocationSelect = (location: string) => {
  //   setSearchValue(location);
  //   setIsSearchPanelOpen(false);
  //   setIsDesktopSearchPanelOpen(false);

  //   // Blur inputs
  //   if (searchInputRef.current) {
  //     searchInputRef.current.blur();
  //   }
  //   if (desktopSearchInputRef.current) {
  //     desktopSearchInputRef.current.blur();
  //   }
  // };

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
                className="ml-3 flex-1 text-[14px] placeholder:text-white text-white font-light tracking-[-0.3px] bg-transparent border-none outline-none"
                style={{
                  
                }}
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

          {/* Desktop search bar with its search container */}
          <div
            ref={desktopSearchContainerRef}
            className={`${shouldHide ? "hidden" : "flex"} relative items-center`}
          >
            <div className="flex items-center bg-[#2F2F2F] rounded-full px-4 py-2 w-[26.18rem]">
              <div className="bg-[#1c1c1c] p-2 rounded-full">
                <Image
                  src="/icons/firrsearch.png"
                  height={15.43}
                  width={15.43}
                  alt="search-icon"
                />
              </div>
              <input
                ref={desktopSearchInputRef}
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                onFocus={handleDesktopInputFocus}
                onKeyDown={handleKeyDown}
                placeholder={selectedLocation || getSearchPlaceholder()}
                className="ml-2 w-full border-none outline-none bg-transparent text-[14px] text-white placeholder-white"
              />
              {searchValue && (
                <button
                  onClick={handleClearDesktopSearch}
                  className="ml-2 search-clear-btn"
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

            {/* Desktop Search Results Popup */}
            {isDesktopSearchPanelOpen && (
              <div className="absolute top-full left-0 mt-2 w-[26.18rem] max-h-[400px] overflow-y-auto bg-[#2F2F2F] rounded-xl shadow-lg z-30">
                <div className="p-4">
                  {/* Use current location button */}
                  <button
                    onClick={handleUseCurrentLocation}
                    className="flex items-center w-full py-3 px-2 mb-4 rounded-lg hover:bg-[#3D3D3D] transition-colors"
                  >
                    <div className="bg-[#1c1c1c] p-2 rounded-full mr-3">
                      <Image src="/icons/location-icon.svg" height={12} width={12} alt="location"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/icons/search-icon.svg";
                        }}
                      />
                    </div>
                    <span className="text-[#0A84FF] text-sm">Use my current location</span>
                  </button>

                  {/* Loading indicator */}
                  {isLoadingLocations && (
                    <div className="flex justify-center py-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  )}

                  {/* Search results - show when user is searching */}
                  {searchValue && !isLoadingLocations && (
                    <>
                      <h3 className="text-white text-sm font-medium mb-3">Search Results</h3>
                      <div className="space-y-2">
                        {locations.length > 0 ? (
                          locations.map((location, index) => (
                            <div
                              key={index}
                              className="flex items-center cursor-pointer hover:bg-[#3D3D3D] p-2 rounded-lg transition-all"
                              onClick={() => handleLocationSelect(location)}
                            >
                              <div className="bg-[#1c1c1c] p-2 rounded-full mr-3">
                                <Image src="/icons/search-icon.svg" height={12} width={12} alt="search" />
                              </div>
                              <span className="text-white text-sm">{location}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-400 text-sm p-2">
                            No locations found matching &qupt;{searchValue}&qupt;
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Recent searches - show when not searching */}
                  {!searchValue && recentSearches.length > 0 && (
                    <>
                      <h3 className="text-white text-sm font-medium mb-3">Recent Searches</h3>
                      <div className="space-y-2">
                        {recentSearches.slice(0, 3).map((location, index) => (
                          <div
                            key={index}
                            className="flex items-center cursor-pointer hover:bg-[#3D3D3D] p-2 rounded-lg transition-all"
                            onClick={() => handleLocationSelect(location)}
                          >
                            <div className="bg-[#1c1c1c] p-2 rounded-full mr-3">
                              <Image src="/icons/search-icon.svg" height={12} width={12} alt="search" />
                            </div>
                            <span className="text-white text-sm">{location}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Popular locations - show when not searching or when no recent searches */}
                  {!searchValue && (
                    <>
                      
                    </>
                  )}

                  {/* Clear search button - only show when search is active */}
                  {selectedLocation && (
                    <button
                      onClick={() => {
                        dispatch(clearSelectedLocation());
                        setSearchValue("");
                        // @ts-expect-error - TS might complain about dispatch type
                        dispatch(fetchPropertiesByCategory(selectedCategory));
                        setIsDesktopSearchPanelOpen(false);
                      }}
                      className="mt-4 w-full py-2 bg-[#0A84FF] text-white text-sm font-medium rounded-lg hover:bg-[#0a75e0] transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </div>
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
        <ForgotPasswordModal />
        <LoginModal />
        <LogoutModal onConfirm={handleLogout} />
        <OnBoardingPopup />
      </nav>

      {/* Search Results Panel with Framer Motion (Mobile only) */}
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