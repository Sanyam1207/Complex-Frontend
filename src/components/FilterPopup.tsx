"use client";

import React, { useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose }) => {

    const [selectedStayDuration, setSelectedStayDuration] = useState<"lt6" | "gt6" | null>(null);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    // If not open, don't render anything
    if (!isOpen) return null;

    // Toggle a filter in or out of the selectedFilters array
    const toggleFilter = (filterName: string) => {
        setSelectedFilters((prev) => {
            if (prev.includes(filterName)) {
                // remove it
                return prev.filter((f) => f !== filterName);
            } else {
                // add it
                return [...prev, filterName];
            }
        });
    };

    const clearFilter = () => {
        setSelectedStayDuration(null);
        setSelectedFilters([]);
    }

    return (
        <div className={`fixed inset-0 flex items-center justify-center ${inter.className}`}>
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
                            <select className="border border-gray-300 rounded-md p-2 text-[14px] text-[#2C3C4E]">
                                <option>$0</option>
                                <option>$100</option>
                                <option>$500</option>
                            </select>
                            <select className="border border-gray-300 rounded-md p-2 text-[14px] text-[#2C3C4E]">
                                <option>Max value</option>
                                <option>$1000</option>
                                <option>$2000</option>
                            </select>
                        </div>
                    </div>

                    {/* Number of Bedrooms and Bathrooms */}
                    <div className="mb-5">
                        <label className="block text-[14px] font-medium text-[#2C3C4E] mb-2">
                            Number of bedrooms and bathrooms?
                        </label>
                        <div className="flex space-x-3">
                            <select className="border border-gray-300 rounded-md p-2 text-[14px] text-[#2C3C4E]">
                                <option>Bedrooms</option>
                                <option>1 Bedroom</option>
                                <option>2 Bedrooms</option>
                            </select>
                            <select className="border border-gray-300 rounded-md p-2 text-[14px] text-[#2C3C4E]">
                                <option>Bathrooms</option>
                                <option>1 Bathroom</option>
                                <option>2 Bathrooms</option>
                            </select>
                        </div>
                    </div>

                    {/* Preferred Stay Duration (Single Select) */}
                    <div className="mb-5">
                        <label className="block text-[14px] font-medium text-[#2C3C4E] mb-2">
                            Preferred stay duration?
                        </label>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setSelectedStayDuration("lt6")}
                                className={`border border-gray-300 rounded-full px-4 py-2 text-[14px] hover:bg-gray-100 transition
                ${selectedStayDuration === "lt6"
                                        ? "bg-[#0A84FF] text-white border-transparent"
                                        : "text-[#2C3C4E]"
                                    }
              `}
                            >
                                Less than 6 months
                            </button>
                            <button
                                onClick={() => setSelectedStayDuration("gt6")}
                                className={`border border-gray-300 rounded-full px-4 py-2 text-[14px] hover:bg-gray-100 transition
                ${selectedStayDuration === "gt6"
                                        ? "bg-[#0A84FF] text-white border-transparent"
                                        : "text-[#2C3C4E]"
                                    }
              `}
                            >
                                More than 6 months
                            </button>
                        </div>
                    </div>

                    {/* Popular Filters (Multiple Select) */}
                    <div className="mb-5">
                        <label className="block text-[14px] font-medium text-[#2C3C4E] mb-2">
                            Popular filters
                        </label>
                        <div className="flex space-x-3 flex-wrap">
                            {/* Parking */}
                            <button
                                onClick={() => toggleFilter("parking")}
                                className={`border rounded-full px-4 py-2 text-[14px] hover:bg-gray-100 transition
                ${selectedFilters.includes("parking")
                                        ? "bg-[#0A84FF] text-white border-transparent"
                                        : "border-gray-300 text-[#2C3C4E]"
                                    }
              `}
                            >
                                Parking
                            </button>

                            {/* Pet Friendly */}
                            <button
                                onClick={() => toggleFilter("petFriendly")}
                                className={`border rounded-full px-4 py-2 text-[14px] hover:bg-gray-100 transition
                ${selectedFilters.includes("petFriendly")
                                        ? "bg-[#0A84FF] text-white border-transparent"
                                        : "border-gray-300 text-[#2C3C4E]"
                                    }
              `}
                            >
                                Pet friendly
                            </button>

                            {/* Couple */}
                            <button
                                onClick={() => toggleFilter("couple")}
                                className={`border rounded-full px-4 py-2 text-[14px] hover:bg-gray-100 transition
                ${selectedFilters.includes("couple")
                                        ? "bg-[#0A84FF] text-white border-transparent"
                                        : "border-gray-300 text-[#2C3C4E]"
                                    }
              `}
                            >
                                Couple
                            </button>
                        </div>
                    </div>

                    {/* Sort Listing */}
                    <div className="mb-5">
                        <label className="block text-[14px] font-medium text-[#2C3C4E] mb-2">
                            Sort listing
                        </label>
                        <div className="flex flex-col space-y-2 text-[14px] text-[#2C3C4E]">
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="sort" className="accent-black" />
                                <span>Price: low to high</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="sort" className="accent-black" />
                                <span>Newest first</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="sort" className="accent-black" />
                                <span>Most relevant</span>
                            </label>
                        </div>
                    </div>

                    {/* Bottom Buttons */}
                    <div className="flex items-center justify-between mt-8">
                        <button onClick={() => clearFilter()} className="text-[#0A84FF] p-3 text-[14px] rounded-full border border-slate-300 px-6">
                            Clear filter
                        </button>
                        <button className="bg-black text-white text-[14px] rounded-full px-6 py-3 font-medium hover:bg-gray-800 transition">
                            View 27 rentals
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FilterModal;
