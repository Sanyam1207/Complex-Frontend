"use client";

import React, { useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface MobileFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileFilterModal: React.FC<MobileFilterModalProps> = ({ isOpen, onClose }) => {
  // Always call hooks at the top of the component
  const [selectedStayDuration, setSelectedStayDuration] = useState<"lt6" | "gt6" | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  
  // Then conditionally return if not open
  if (!isOpen) return null;

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
        <div className={`fixed inset-0 z-50 flex flex-col text-[#2C3C4E] ${inter.className}`}>
            {/* Dark overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

            {/* Modal */}
            <div className="absolute bottom-0 w-full h-[94vh] bg-white rounded-t-2xl p-6 shadow-lg flex flex-col overflow-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl">
                    ✕
                </button>
                <h2 className="text-lg font-semibold text-center mb-4">Filter</h2>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-1">
                    {/* Price Range */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Price range</label>
                        <div className="flex space-x-3">
                            <select className="border rounded-md px-3 py-5 w-32">
                                <option className="text-sm">$0</option>
                                <option className="text-sm">$100</option>
                            </select>
                            <select className="border rounded-md px-3 py-5 w-44">
                                <option className="text-sm">Max value</option>
                                <option className="text-sm">$1000</option>
                            </select>
                        </div>
                    </div>
                    <hr className="mb-4" />

                    {/* Bedrooms & Bathrooms */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Bedrooms & Bathrooms</label>
                        <div className="flex space-x-3">
                            <select className="border rounded-md px-3 py-5 w-44">
                                <option className="text-sm">Bedrooms</option>
                                <option className="text-sm">1</option>
                            </select>
                            <select className="border rounded-md px-3 py-5 w-44">
                                <option className="text-sm">Bathrooms</option>
                                <option className="text-sm">1</option>
                            </select>
                        </div>
                    </div>
                    <hr className="mb-4" />

                    {/* Stay Duration */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-3">Preferred stay duration</label>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setSelectedStayDuration("lt6")}
                                className={`border rounded-full px-3 py-5 ${selectedStayDuration === "lt6" ? "bg-blue-500 text-white" : "border-gray-300"
                                    }`}
                            >
                                Less than 6 months
                            </button>
                            <button
                                onClick={() => setSelectedStayDuration("gt6")}
                                className={`border rounded-full px-4 py-2 ${selectedStayDuration === "gt6" ? "bg-blue-500 text-white" : "border-gray-300"
                                    }`}
                            >
                                More than 6 months
                            </button>
                        </div>
                    </div>
                    <hr className="mb-4" />

                    {/* Popular Filters */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Popular filters</label>
                        <div className="flex flex-wrap gap-2">
                            {["Parking", "Pet friendly", "Couple"].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => toggleFilter(filter)}
                                    className={`border rounded-full px-6 py-5 ${selectedFilters.includes(filter) ? "bg-blue-500 text-white" : "border-gray-300"
                                        }`}
                                >
                                    {/* Vihaan1234* */}
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                    <hr className="mb-4" />

                    {/* Sort Listing */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Sort listing</label>
                        <div className="flex flex-col space-y-2 mb-4 mt-5 text-sm">
                            <div className="">
                                <label className="flex items-center space-x-2 ">
                                    <input type="radio" name="sort" className="accent-black" />
                                    <span>Price: low to high</span>
                                </label>
                            </div>

                            <div className="">
                                <label className="flex items-center space-x-2 ">
                                    <input type="radio" name="sort" className="accent-black" />
                                    <span>Newest first</span>
                                </label>
                            </div>

                            <div className="">
                                <label className="flex items-center space-x-2">
                                    <input type="radio" name="sort" className="accent-black" />
                                    <span>Most relevant</span>
                                </label>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Bottom Buttons */}
                <div className="flex items-center justify-between mt-4 p-2 border-t">
                    <button onClick={clearFilter} className="text-blue-500 p-3 text-sm rounded-full border border-gray-300 px-4">
                        Clear filter
                    </button>
                    <button className="bg-black text-white text-sm rounded-full px-6 py-3 font-medium hover:bg-gray-800">
                        View Rentals
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileFilterModal;
