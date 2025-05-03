"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Inter } from "next/font/google";
import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
// Uncomment these imports
import { 
  resetFilters,
  setGender, 
  toggleLanguage,
  setSortBy,
  applyFilters
} from "../redux/slices/messageSlice";
import type { RootState } from "../redux/store/store";

const inter = Inter({ subsets: ["latin"] });

interface LanguageFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageFilterModal: React.FC<LanguageFilterModalProps> = ({ isOpen, onClose }) => {
  // Use the actual Redux dispatch
  const dispatch = useDispatch();
  
  // Get state from Redux instead of local state
  const { gender, languages, sortBy, resultsCount } = useSelector((state: RootState) => state.candidateFilter);
  
  // Languages available for selection
  const availableLanguages = [
    "English", "French", "Hindi", "Gujarati", 
    "Punjabi", "Mandarin", "Telugu", "Urdu",
    "Spanish", "Korean", "Russian", "Filipino",
    "Tamil", "Malayalam"
  ];

  // Update event handlers to use Redux actions
  const handleSetGender = (gender: string) => {
    dispatch(setGender(gender as "male" | "female" | "any"));
  };

  const handleToggleLanguage = (language: string) => {
    dispatch(toggleLanguage(language));
  };

  const handleSetSortBy = (sortBy: string) => {
    dispatch(setSortBy(sortBy as "star" | ""));
  };

  const handleClearFilter = () => {
    dispatch(resetFilters());
  };

  const handleApplyFilters = () => {
    dispatch(applyFilters());
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 flex flex-col text-gray-700 ${inter.className} z-40`}>
          {/* Dark overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="absolute bottom-0 w-full h-[90%] bg-white rounded-t-3xl py-6 px-5 shadow-lg flex flex-col overflow-hidden z-50"
          >
            {/* Header with Close Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-700 text-center flex-grow">
                Candidate filter
              </h2>
              <button onClick={onClose} className="p-1" aria-label="Close">
                <Image src="/icons/close.svg" width={20} height={20} alt="Close" />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto px-1">
              {/* Gender Section */}
              <div className="mb-6">
                <label className="block text-base font-medium text-gray-700 mb-3">
                  Gender
                </label>
                <div className="flex space-x-3">
                  {["Male", "Female", "Any"].map((genderOption) => (
                    <button
                      key={genderOption}
                      onClick={() => handleSetGender(genderOption.toLowerCase())}
                      className={`border rounded-full px-6 py-2 text-sm transition flex-1 ${
                        gender === genderOption.toLowerCase()
                          ? "bg-white border-gray-300 text-gray-700 font-medium"
                          : "border-gray-200 text-gray-500"
                      }`}
                    >
                      {genderOption}
                    </button>
                  ))}
                </div>
              </div>

              {/* Languages Section */}
              <div className="mb-6">
                <label className="block text-base font-medium text-gray-700 mb-3">
                  Filter by languages
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableLanguages.map((language) => (
                    <button
                      key={language}
                      onClick={() => handleToggleLanguage(language)}
                      className={`border rounded-full px-4 py-1.5 text-sm transition ${
                        languages.includes(language)
                          ? "bg-blue-500 text-white border-transparent"
                          : "border-gray-300 text-gray-700"
                      }`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By Section */}
              <div className="mb-6">
                <label className="block text-base font-medium text-gray-700 mb-3">
                  Sort by:
                </label>
                <button
                  onClick={() => handleSetSortBy("star")}
                  className={`border rounded-full px-6 py-2 text-sm transition ${
                    sortBy === "star"
                      ? "bg-white border-gray-300 text-gray-700 font-medium"
                      : "border-gray-200 text-gray-500"
                  }`}
                >
                  Star Messages
                </button>
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-100">
              <button
                onClick={handleClearFilter}
                className="text-blue-500 py-3 px-6 text-sm rounded-full border border-gray-200"
              >
                Clear filter
              </button>
              <button
                className="bg-black text-white text-sm rounded-full py-3 px-6"
                onClick={handleApplyFilters}
              >
                View {resultsCount} results
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LanguageFilterModal;