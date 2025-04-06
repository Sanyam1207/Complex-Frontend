"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Inter } from "next/font/google";
import Image from "next/image";
import SearchDropdown from "./SearchDropdown";

const inter = Inter({ subsets: ["latin"] });

interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileFilterModal: React.FC<MobileFilterModalProps> = ({ isOpen, onClose }) => {
  // Always call hooks at the top of the component
  const [selectedStayDuration, setSelectedStayDuration] = useState<"lt6" | "gt6" | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");

  const toggleFilter = (filterName: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterName) ? prev.filter((f) => f !== filterName) : [...prev, filterName]
    );
  };

  const clearFilter = () => {
    setSelectedStayDuration(null);
    setSelectedFilters([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 flex flex-col text-[#2C3C4E] ${inter.className}`}>
          {/* Dark overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

          {/* Modal with slide in/out animation */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="absolute bottom-0 w-full h-[95%] bg-white rounded-t-2xl py-6 px-2 shadow-lg flex flex-col overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-4 right-4" aria-label="Close">
              <Image src="/icons/close.svg" width={24} height={24} alt="" />
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
                  <SearchDropdown
                    options={["$100", "$200", "$300", "$400"]}
                    setValue={setMinValue}
                    value={minValue}
                    placeholder="Min Price"
                  />
                  <SearchDropdown
                    options={["$1000", "$2000", "$3000", "$4000"]}
                    setValue={setMaxValue}
                    value={maxValue}
                    placeholder="Max Price"
                  />
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
                    setValue={setBedrooms}
                    value={bedrooms}
                    placeholder="Bedrooms"
                  />
                  <SearchDropdown
                    options={["1 Bathroom", "2 Bathrooms"]}
                    setValue={setBathrooms}
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
                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedStayDuration("lt6")}
                    className={`border rounded-full px-4 py-4 text-[14px] transition
                      ${selectedStayDuration === "lt6"
                        ? "bg-[#0A84FF] text-white border-transparent"
                        : "border-[#E3E2E0] text-[#2C3C4E]"
                      }`}
                    style={{ lineHeight: "16px" }}
                  >
                    Less than 6 months
                  </button>
                  <button
                    onClick={() => setSelectedStayDuration("gt6")}
                    className={`border rounded-full px-4 py-4 text-[14px] transition
                      ${selectedStayDuration === "gt6"
                        ? "bg-[#0A84FF] text-white border-transparent"
                        : "border-[#E3E2E0] text-[#2C3C4E]"
                      }`}
                    style={{ lineHeight: "16px" }}
                  >
                    More than 6 months
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
                <div className="flex flex-wrap gap-2">
                  {["Parking", "Pet friendly", "Couple"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => toggleFilter(filter)}
                      className={`border rounded-full px-6 py-4 text-[14px] transition
                        ${selectedFilters.includes(filter)
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

              {/* Sort Listing */}
              <div className="mb-6">
                <label
                  className="block text-[14px] font-medium text-[#2C3C4E] mb-2"
                  style={{ lineHeight: "124%" }}
                >
                  Sort listing
                </label>
                <div
                  className="flex flex-col space-y-1 mb-4 mt-3 text-sm text-[#2C3C4E]"
                  style={{ lineHeight: "194%" }}
                >
                  <div>
                    <label className="flex items-center space-x-4">
                      <input type="radio" name="sort" className="accent-black" />
                      <span>Price: low to high</span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center space-x-4">
                      <input type="radio" name="sort" className="accent-black" />
                      <span>Newest first</span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center space-x-4">
                      <input type="radio" name="sort" className="accent-black" />
                      <span>Most relevant</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex items-center justify-between mt-4 ">
              <button
                onClick={clearFilter}
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
