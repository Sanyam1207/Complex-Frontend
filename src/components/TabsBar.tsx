"use client";

import { setSelectedCategory } from "@/redux/slices/categorySlice";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FilterModal from "./FilterPopup";

const inter = Inter({ subsets: ["latin"] });

export default function TabsBar() {
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [showFilter, setShowFilter] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedCategory = useSelector((state: any) => state.category.selectedCategory);

  // Define tab data
  const tabs = [
    { label: "Private room", icon: "/icons/bed1.svg", value: "privateRoom" },
    { label: "Apartments", icon: "/icons/building1.svg", value: "apartments" },
    { label: "Houses", icon: "/icons/home1.svg", value: "houses" },
    { label: "Sharing", icon: "/icons/handshake1.svg", value: "sharing" },
    { label: "Basement", icon: "/icons/home2.svg", value: "basement" },
  ];

  return (
    <div
      className={`
        ${inter.className} flex items-center justify-between 
        bg-[#1C1C1C] px-4 py-4 md:px-[7.25rem] md:py-[1.5rem]
      `}
    >
      {/* Left: Icon + text tabs */}
      <div className="flex space-x-6 md:space-x-8 overflow-x-auto md:overflow-x-visible whitespace-nowrap">
        {tabs.map((tab) => (
          <div
            key={tab.value}
            className="flex flex-col items-center cursor-pointer relative p-2"
            onClick={() => dispatch(setSelectedCategory(tab.value))}
          >
            <Image alt={tab.label} className="mb-2 md:mb-4" src={tab.icon} width={27} height={27} />
            <span className="text-white text-[0.75rem] md:text-sm">{tab.label}</span>
            {selectedCategory === tab.value && (
              <div className="md:absolute h-4 md:-bottom-6 md:left-0 md:right-0 md:h-2 bg-[#0A84FF] rounded-t-md" />
            )}
          </div>
          
        ))}
      </div>

      {/* Right: Filter & Show Map buttons (hidden on mobile) */}
      <div className="hidden md:flex space-x-4">
        <button
          onClick={() => setShowFilter(true)}
          className="bg-[#2F2F2F] w-20 text-sm text-white px-4 py-2 rounded-full hover:bg-gray-600 transition"
        >
          Filter
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
