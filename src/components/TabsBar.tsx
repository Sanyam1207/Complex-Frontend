"use client";

import { setSelectedCategory } from "@/redux/slices/categorySlice";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FilterModal from "./FilterPopup";
import type { RootState } from "../redux/store/store";

const inter = Inter({ subsets: ["latin"] });

export default function TabsBar() {
  const dispatch = useDispatch();
  const [showFilter, setShowFilter] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedCategory = useSelector((state: any) => state.category.selectedCategory);
  
  // Get filter state from Redux
  const {
    selectedStayDuration,
    selectedFilters,
    bedrooms,
    bathrooms,
    minValue,
    maxValue,
  } = useSelector((state: RootState) => state.filter);

  // Calculate the total number of active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    
    // Count selected filters (Parking, Pet friendly, Couple)
    if (selectedFilters.length > 0) {
      count += selectedFilters.length;
    }
    
    // Count stay duration
    if (selectedStayDuration) {
      count += 1;
    }
    
    // Count bedrooms
    if (bedrooms) {
      count += 1;
    }
    
    // Count bathrooms
    if (bathrooms) {
      count += 1;
    }
    
    // Count min price
    if (minValue) {
      count += 1;
    }
    
    // Count max price
    if (maxValue) {
      count += 1;
    }
    
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();
  const hasActiveFilters = activeFiltersCount > 0;

  // Define tab data
  const tabs = [
    { label: "Private room", icon: "/icons/bed1.svg", activeIcon: "/icons/bed1a.svg", value: "privateRoom" },
    { label: "Apartments", icon: "/icons/building1.svg", value: "apartments", activeIcon: "/icons/building1a.svg", },
    { label: "Houses", icon: "/icons/home1.svg", value: "houses", activeIcon: "/icons/home1a.svg", },
    { label: "Sharing", icon: "/icons/handshake1.svg", value: "sharing", activeIcon: "/icons/handshake1a.svg", },
    { label: "Basement", icon: "/icons/basementtab.svg", value: "basement", activeIcon: "/icons/home2a.svg", },
  ];

  return (
    <div
      className={`
      ${inter.className} flex items-center justify-between 
      bg-[#1C1C1C] px-4 pt-4 md:px-[7.25rem]
    `}
    >
      {/* Left: Icon + text tabs */}
      <div className="flex space-x-2 md:space-x-8 overflow-x-auto md:overflow-x-visible whitespace-nowrap">
        {tabs.map((tab) => (
          <div
            key={tab.value}
            className="flex flex-col items-center cursor-pointer relative p-2"
            onClick={() => dispatch(setSelectedCategory(tab.value))}
          >
            {/* Use different images based on selected state */}
            <Image
              alt={tab.label}
              src={selectedCategory === tab.value ? `${tab.activeIcon}` : `${tab.icon}`}
              width={27}
              height={27}
              className="mb-2 md:mb-4 w-auto h-auto flex-shrink-0"
            />
            <span className={`text-[#F4F4F4] ${selectedCategory === tab.value ? 'font-semibold' : 'font-light'} text-center text-xs mb-2 leading-[1.5rem]`}>
              {tab.label}
            </span>
            {selectedCategory === tab.value && (
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#0A84FF] rounded-t-md" />
            )}
          </div>
        ))}
      </div>

      {/* Right: Filter & Show Map buttons (hidden on mobile) */}
      <div className="hidden md:flex space-x-4">
        <button
          onClick={() => setShowFilter(true)}
          className={`relative flex items-center justify-center w-20 text-sm text-white px-4 py-2 rounded-full transition ${
            hasActiveFilters ? 'bg-[#0A84FF]' : 'bg-[#2F2F2F] hover:bg-gray-600'
          }`}
        >
          Filter
          {hasActiveFilters && (
            <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </div>
          )}
        </button>
        <button className="flex flex-row bg-[#2F2F2F] w-36 h-10 items-center justify-center text-sm text-white space-x-2 px-4 py-2 rounded-full hover:bg-gray-600 transition">
          <Image alt="Map" src={"/icons/map.svg"} width={15} height={15} />
          <div>Show map</div>
        </button>
      </div>

      <FilterModal isOpen={showFilter} onClose={() => setShowFilter(false)} />
    </div>
  );
}