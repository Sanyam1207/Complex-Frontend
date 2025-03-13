"use client"; // If you're using Next.js 13+ App Router; remove if using Pages Router
import React from "react";

export default function ManageListingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9]">
      {/* -- 1) TOP BAR -- */}
      <div className="bg-black py-4 text-center">
        <h1 className="text-white font-medium">Manage listing</h1>
      </div>
      

      {/* -- 2) LISTING CARD -- */}
      <div className="p-4">
        <div className="bg-white rounded-xl shadow">
          {/* Listing Image + Trash Icon */}
          <div className="relative">
            {/* Replace with your listing image URL */}
            <img
              src="https://via.placeholder.com/400x300" 
              alt="Listing"
              className="w-full h-48 object-cover rounded-t-xl"
            />
            {/* Trash icon in top-right corner */}
            <button className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full shadow">
              {/* Example Trash Icon (Feather Icons style) */}
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18M9 6v-2c0-.55.45-1 
                  1-1h4c.55 0 1 .45 1 1v2m1 0v12c0 
                  1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2V6h8" 
                />
              </svg>
            </button>
          </div>

          {/* Listing Details */}
          <div className="p-4">
            <div className="flex items-start justify-between">
              {/* Left side: Address + Date */}
              <div>
                <h2 className="text-base font-semibold">265 Mainstreet, Toronto</h2>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  {/* Calendar Icon */}
                  <svg
                    className="w-4 h-4 text-gray-400 mr-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>June 15</span>
                </div>
              </div>
              {/* Right side: Price */}
              <p className="text-sm font-semibold text-gray-900">$1200/month</p>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 border border-gray-300 rounded-full py-2 text-sm font-medium text-gray-700">
                Mark as rented
              </button>
              <button className="flex-1 border border-gray-300 rounded-full py-2 text-sm font-medium text-gray-700">
                Edit listing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* -- 3) CREATE NEW LISTING BUTTON -- */}
      <div className="mt-auto p-4">
        <button className="w-full bg-black text-white rounded-full py-3 text-sm font-semibold">
          Create new listing
        </button>
      </div>
    </div>
  );
}
