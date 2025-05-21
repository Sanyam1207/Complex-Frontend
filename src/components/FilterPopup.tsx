"use client";

import { applyFilters } from "@/redux/slices/categorySlice";
import React from "react";
import { Inter } from "next/font/google";
import { useDispatch, useSelector } from "react-redux";
import {
  resetFilters,
  setBathrooms,
  setBedrooms,
  setMaxValue,
  setMinValue,
  setSelectedSort,
  setSelectedStayDuration,
  toggleSelectedFilter,
} from "../redux/slices/filterSlice";
import type { RootState } from "../redux/store/store";
import SearchDropdown from "./SearchDropdown";

const inter = Inter({ subsets: ["latin"] });

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const {
    selectedStayDuration,
    selectedFilters,
    bedrooms,
    bathrooms,
    minValue,
    maxValue,
    selectedSort,
  } = useSelector((state: RootState) => state.filter);

  // If not open, don't render anything
  if (!isOpen) return null;

  // Event Handlers
  const handleToggleFilter = (filterName: string) => {
    dispatch(toggleSelectedFilter(filterName));
  };

  const handleClearFilter = () => {
    dispatch(resetFilters());
    dispatch(applyFilters());
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${inter.className}`}>
      {/* Full-Screen Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-[36rem] rounded-2xl bg-white px-8 py-6 shadow-lg">
        {/* Close Button (top-right) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 border rounded-full px-2 py-1"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-[16px] font-semibold text-[#2C3C4E] text-center mb-6">
          Filter
        </h2>

        <div className="flex px-20 flex-col">
          {/* Price Range */}
          <div className="mb-5">
            <label className="block text-[14px] font-medium text-[#2C3C4E] mb-2">
              Price range
            </label>
            <div className="flex space-x-3">
              {/* Min Price */}
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2C3C4E]">
                  $
                </span>
                <input
                  type="number"
                  placeholder="Min price"
                  value={minValue}
                  onChange={(e) => dispatch(setMinValue(e.target.value))}
                  className="w-full placeholder:text-[#2C3C4E] p-2 py-3 pl-7 border border-[#E3E2E0] text-[#2C3C4E] rounded-md outline-none"
                />
              </div>

              {/* Max Price */}
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2C3C4E]">
                  $
                </span>
                <input
                  type="number"
                  placeholder="Max price"
                  value={maxValue}
                  onChange={(e) => dispatch(setMaxValue(e.target.value))}
                  className="w-full p-2 placeholder:text-[#2C3C4E] py-3 pl-7 border border-[#E3E2E0] text-[#2C3C4E] rounded-md outline-none"
                />
              </div>
            </div>
          </div>

          {/* Number of Bedrooms and Bathrooms */}
          <div className="mb-5">
            <label className="block text-[14px] font-medium text-[#2C3C4E] mb-2">
              Number of bedrooms and bathrooms?
            </label>
            <div className="flex space-x-3">
              <SearchDropdown
                options={["1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4 Bedrooms", "5 Bedrooms"]}
                setValue={(val: string) => dispatch(setBedrooms(val))}
                value={bedrooms}
                placeholder="Bedrooms"
              />
              <SearchDropdown
                options={["1 Bathroom", "2 Bathrooms", "3 Bathrooms", "4 Bathrooms", "5 Bathrooms"]}
                setValue={(val: string) => dispatch(setBathrooms(val))}
                value={bathrooms}
                placeholder="Bathroom"
              />
            </div>
          </div>

          {/* Preferred Stay Duration (Single Select) */}
          <div className="mb-5">
            <label className="block text-[14px] font-medium text-[#2C3C4E] mb-2">
              Preferred stay duration?
            </label>
            <div className="flex space-x-3">
              <button
                onClick={() => dispatch(setSelectedStayDuration("lt6"))}
                className={`border border-[#2D3D4E] rounded-full px-4 py-2.5 text-[14px] transition
                  ${selectedStayDuration === "lt6"
                    ? "bg-[#0A84FF] text-white border-transparent"
                    : "border-[#E3E2E0] text-[#2C3C4E]"
                  }`}
              >
                1 - 6 months
              </button>
              <button
                onClick={() => dispatch(setSelectedStayDuration("gt6"))}
                className={`border border-[#2D3D4E] rounded-full px-4 py-2.5 text-[14px] transition
                  ${selectedStayDuration === "gt6"
                    ? "bg-[#0A84FF] text-white border-transparent"
                    : "border-[#E3E2E0] text-[#2C3C4E]"
                  }`}
              >
                6+ months
              </button>
            </div>
          </div>

          {/* Popular Filters (Multiple Select) */}
          <div className="mb-5">
            <label className="block text-[14px] font-medium text-[#2C3C4E] mb-2">
              Popular filters
            </label>
            <div className="flex space-x-3 flex-wrap">
              {["Parking", "Pet friendly", "Couple"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleToggleFilter(filter)}
                  className={`border border-[#2D3D4E] rounded-full px-4 py-2.5 text-[14px] transition
                    ${selectedFilters.includes(filter)
                      ? "bg-[#0A84FF] text-white border-transparent"
                      : "border-[#E3E2E0] text-[#2C3C4E]"
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Listing with Custom Radio Options */}
          <div className="mb-5">
            <label className="block text-[14px] font-medium text-[#2C3C4E] mb-2">
              Sort listing
            </label>
            <div className="flex flex-col space-y-3">
              {/* Price: low to high */}
              <label className="flex items-center justify-between flex-row-reverse cursor-pointer gap-3">
                <input
                  type="radio"
                  name="sort"
                  value="price"
                  className="hidden peer"
                  checked={selectedSort === "price"}
                  onChange={() => dispatch(setSelectedSort("price"))}
                />
                {/* Circle Indicator */}
                <div className="w-5 h-5 rounded-full border border-gray-300 
                  peer-checked:border-blue-600 peer-checked:border-[7px] 
                  peer-checked:bg-white"
                />
                <span className="text-sm text-[#2C3C4E]">
                  Price: low to high
                </span>
              </label>

              {/* Newest first */}
              <label className="flex items-center justify-between flex-row-reverse cursor-pointer gap-3">
                <input
                  type="radio"
                  name="sort"
                  value="newest"
                  className="hidden peer"
                  checked={selectedSort === "newest"}
                  onChange={() => dispatch(setSelectedSort("newest"))}
                />
                <div className="w-5 h-5 rounded-full border border-gray-300 
                  peer-checked:border-blue-600 peer-checked:border-[7px] 
                  peer-checked:bg-white"
                />
                <span className="text-sm text-[#2C3C4E]">
                  Newest first
                </span>
              </label>

              {/* Most relevant */}
              <label className="flex items-center justify-between flex-row-reverse cursor-pointer gap-3">
                <input
                  type="radio"
                  name="sort"
                  value="relevant"
                  className="hidden peer"
                  checked={selectedSort === "relevant"}
                  onChange={() => dispatch(setSelectedSort("relevant"))}
                />
                <div className="w-5 h-5 rounded-full border border-gray-300 
                  peer-checked:border-blue-600 peer-checked:border-[7px] 
                  peer-checked:bg-white"
                />
                <span className="text-sm text-[#2C3C4E]">
                  Most relevant
                </span>
              </label>
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="flex items-center justify-between mt-8">
            <button 
              onClick={handleClearFilter} 
              className="text-[#0A84FF] p-3 text-[14px] rounded-full border border-slate-300 px-6"
            >
              Clear filter
            </button>
            <button 
              className="bg-black text-white text-[14px] rounded-full px-6 py-3 font-medium hover:bg-gray-800 transition"
              onClick={() => {
                dispatch(applyFilters());
                onClose(); // Close the modal after applying filters
              }}
            >
              Show Rentals
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;