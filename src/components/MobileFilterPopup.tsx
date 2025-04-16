"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Inter } from "next/font/google";
import Image from "next/image";
import SearchDropdown from "./SearchDropdown";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store/store";
import {
  setSelectedStayDuration,
  toggleSelectedFilter,
  setBedrooms,
  setBathrooms,
  setMinValue,
  setMaxValue,
  setSelectedSort,
  resetFilters,
} from "../redux/slices/filterSlice";

const inter = Inter({ subsets: ["latin"] });

interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileFilterModal: React.FC<MobileFilterModalProps> = ({ isOpen, onClose }) => {
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

  // Event Handlers
  const handleToggleFilter = (filterName: string) => {
    dispatch(toggleSelectedFilter(filterName));
  };

  const handleClearFilter = () => {
    dispatch(resetFilters());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 flex flex-col text-[#2C3C4E] ${inter.className} z-40`}>
          {/* Dark overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="absolute bottom-0 w-full h-[95%] bg-white rounded-t-2xl py-6 px-2 shadow-lg flex flex-col overflow-hidden z-50"
          >
            <button onClick={onClose} className="absolute top-4 right-4" aria-label="Close">
              <Image src="/icons/close.svg" width={24} height={24} alt="Close" />
            </button>

            <h2
              className="text-base font-medium text-[#2C3C4E] text-center mb-6"
              style={{ lineHeight: "194%" }}
            >
              Filter
            </h2>

            <div className="flex-1 overflow-y-auto px-1">
              {/* Price Range */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-[#2C3C4E] mb-2"
                  style={{ lineHeight: "124%" }}
                >
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
                      className="w-full placeholder:text-[#2C3C4E] p-2 py-3.5 pl-7 border border-[#E3E2E0] text-[#2C3C4E] rounded-md outline-none"
                    />
                  </div>

                  {/* Max Price */}
                  <div className="relative w-full">
                    <span className="absolute  left-3 top-1/2 transform -translate-y-1/2 text-[#2C3C4E]">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="Max price"
                      value={maxValue}
                      onChange={(e) => dispatch(setMaxValue(e.target.value))}
                      className="w-full p-2  placeholder:text-[#2C3C4E] py-3.5 pl-7 border border-[#E3E2E0] text-[#2C3C4E] rounded-md outline-none"
                    />
                  </div>
                </div>
              </div>
              <hr className="mb-4" />

              {/* Bedrooms & Bathrooms */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium bg-white text-[#2C3C4E] mb-2"
                  style={{ lineHeight: "124%" }}
                >
                  Number of bedrooms and bathrooms?
                </label>
                <div className="flex space-x-3">
                  <SearchDropdown
                    options={["1 Bedroom", "2 Bedrooms"]}
                    setValue={(val: string) => dispatch(setBedrooms(val))}
                    value={bedrooms}
                    placeholder="Bedrooms"
                  />
                  <SearchDropdown
                    options={["1 Bathroom", "2 Bathrooms"]}
                    setValue={(val: string) => dispatch(setBathrooms(val))}
                    value={bathrooms}
                    placeholder="Bathroom"
                  />
                </div>
              </div>
              <hr className="mb-4" />

              {/* Stay Duration */}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-[#2C3C4E] mb-2"
                  style={{ lineHeight: "124%" }}
                >
                  Preferred stay duration?
                </label>
                <div className="flex space-x-3 items-center">
                  <button
                    onClick={() => dispatch(setSelectedStayDuration("lt6"))}
                    className={`border border-[#2D3D4E] rounded-full px-4 h-fit py-1.5 text-[14px] transition ${
                      selectedStayDuration === "lt6"
                        ? "bg-[#0A84FF] text-white border-transparent"
                        : "border-[#E3E2E0] text-[#2C3C4E]"
                    }`}
             
                  >
                    1 - 6 months
                  </button>
                  <button
                    onClick={() => dispatch(setSelectedStayDuration("gt6"))}
                    className={`border border-[#2D3D4E] rounded-full h-fit py-1.5 px-4 text-[14px] transition ${
                      selectedStayDuration === "gt6"
                        ? "bg-[#0A84FF] text-white border-transparent"
                        : "border-[#E3E2E0] text-[#2C3C4E]"
                    } `}
                
                  >
                    6+ months
                  </button>
                </div>
              </div>
              <hr className="mb-4" />

              {/* Popular Filters */}
              <div className="mb-4">
                <label
                  className="block text-[14px] font-medium text-[#2C3C4E] mb-2"
                  style={{ lineHeight: "124%" }}
                >
                  Popular filters
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {["Parking", "Pet friendly", "Couple"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => handleToggleFilter(filter)}
                      className={`border border-[#2D3D4E] rounded-full px-6 py-2 h-fit text-[14px] transition ${
                        selectedFilters.includes(filter)
                          ? "bg-[#0A84FF] text-white border-transparent"
                          : "border-[#E3E2E0] text-[#2C3C4E]"
                      }`}
                      style={{ lineHeight: "16px" }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              <hr className="mb-4" />

              {/* Sort Listing with Custom Radio Options */}
              <div className="mb-6">
                <label
                  className="block text-[14px] font-medium text-[#2C3C4E] mb-2"
                  style={{ lineHeight: "124%" }}
                >
                  Sort listing
                </label>
                <div className="flex flex-col space-y-3 mt-4">
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
            </div>

            {/* Bottom Buttons */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={handleClearFilter}
                className="text-[#0A84FF] py-4 px-10 text-sm rounded-full border border-slate-300 font-normal"
                style={{ lineHeight: "16px" }}
              >
                Clear filter
              </button>
              <button
                className="bg-black text-white text-sm rounded-full py-4 px-10 hover:bg-gray-800 transition"
                style={{ lineHeight: "16px" }}
              >
                View 27 rentals
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MobileFilterModal;
