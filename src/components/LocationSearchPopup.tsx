"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { clearSelectedLocation, setSelectedLocation } from "@/redux/slices/locationSlice";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Image from "next/image";
import { applyFilters } from "@/redux/slices/categorySlice";

// Your API base URL - should come from env vars in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface SearchResultsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    searchValue: string;
    onClearLocation?: () => void;
}

export default function SearchResultsPanel({
    isOpen,
    onClose,
    searchValue,
}: SearchResultsPanelProps) {
    const dispatch = useDispatch();
    const panelRef = useRef<HTMLDivElement>(null);
    const { recentSearches } = useSelector((state: RootState) => state.location);
    // Get the current category to inform the user about what they're searching for
    const selectedCategory = useSelector((state: RootState) => state.category.selectedCategory);

    // State for API locations
    const [locations, setLocations] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // State for header height
    const [headerHeight, setHeaderHeight] = useState(0);

    // Animation variants for framer-motion
    const panelVariants = {
        hidden: { y: "100%" },
        visible: {
            y: 0,
            transition: {
                type: "spring",
                damping: 30,
                stiffness: 300,
                mass: 0.8
            }
        },
        exit: {
            y: "100%",
            transition: {
                type: "spring",
                damping: 40,
                stiffness: 300
            }
        }
    };

    // Helper function to get display name for the category
    const getCategoryDisplayName = (categoryKey: string): string => {
        switch(categoryKey) {
            case 'privateRoom': return 'Private Rooms';
            case 'apartments': return 'Apartments';
            case 'houses': return 'Houses';
            case 'sharing': return 'Shared Rooms';
            case 'basement': return 'Basements';
            default: return 'Properties';
        }
    };

    // Calculate the navbar height when component mounts and when window resizes
    useEffect(() => {
        // Function to measure header height
        const measureHeaderHeight = () => {
            // Find the header element
            const headerElement = document.querySelector('header');

            if (headerElement) {
                const height = headerElement.getBoundingClientRect().height;
                setHeaderHeight(height - 100);
                console.log("Measured header height:", height);
            }
        };

        // Calculate on mount
        measureHeaderHeight();

        // Recalculate on window resize
        window.addEventListener('resize', measureHeaderHeight);

        return () => {
            window.removeEventListener('resize', measureHeaderHeight);
        };
    }, []);

    // Function to fetch locations from the API
    const fetchLocations = async (searchTerm: string) => {
        if (!searchTerm || searchTerm.length < 2) return;

        setIsLoading(true);
        setError(null);

        try {
            console.log(`Searching for locations matching: "${searchTerm}" at ${API_BASE_URL}/locations`);

            const response = await axios.get(`${API_BASE_URL}/api/locations`, {
                params: { search: searchTerm }
            });

            console.log('API Response:', response.data);

            if (response.data && response.data.success) {
                setLocations(response.data.data);
            } else {
                setError("Failed to fetch locations");
            }
        } catch (err) {
            console.error("Error fetching locations:", err);
            setError("Error connecting to the server");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectLocation = (location: string) => {
        // If location is empty or just whitespace, clear the filter
        if (!location || location.trim() === "") {
            dispatch(clearSelectedLocation());
        } else {
            // Otherwise dispatch the selected location
            dispatch(setSelectedLocation(location));
            // Explicitly trigger a filter application to ensure category+location filter works
            dispatch(applyFilters());
        }

        // Log the selection for debugging
        console.log(`Selected location: ${location || "cleared"} for category: ${selectedCategory}`);

        // Close the popup
        onClose();
    };

    // Use current location handler
    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Just use "Current Location" as the location string
                console.log(position);
                dispatch(setSelectedLocation("Current Location"));
                // Explicitly trigger a filter application
                dispatch(applyFilters());
                onClose();
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Unable to get your location. Please check your permissions.");
            }
        );
    };

    // Use debounce for search to avoid too many API calls
    useEffect(() => {
        if (!searchValue || searchValue.length < 2) {
            setLocations([]);
            return;
        }

        const debounceTimer = setTimeout(() => {
            fetchLocations(searchValue);
        }, 300); // 300ms debounce

        return () => clearTimeout(debounceTimer);
    }, [searchValue]);

    // Handle clicks outside the panel
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={panelRef}
                    className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl overflow-hidden z-30"
                    style={{
                        top: `${headerHeight}px`,
                        maxHeight: `calc(100vh - ${headerHeight}px)`,
                    }}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={panelVariants}
                >
                    {/* Category indication header */}
                    <div className="bg-gray-100 p-3 text-center">
                        <p className="text-sm text-gray-600">
                            Searching for {getCategoryDisplayName(selectedCategory)}
                        </p>
                    </div>
                
                    {/* Use my current location button */}
                    <button
                        onClick={handleUseCurrentLocation}
                        className="flex items-center w-full py-5 px-7 border-b border-gray-200"
                    >
                        <div className="bg-[#F4F4F4] rounded-full p-2 mr-4 flex items-center justify-center">
                            <Image src={"/icons/searchlocation.svg"} alt="search" height={12} width={12} />
                        </div>
                        <span className="text-[#0A84FF] font-normal text-sm">Use my current location</span>
                    </button>

                    {/* Recent searches - only show if we have recent searches and no search value */}
                    {!searchValue && recentSearches.length > 0 && (
                        <div className="w-full">
                            <h3 className="px-7 py-2 text-sm text-gray-500">Recent searches</h3>
                            <ul>
                                {recentSearches.map((location, index) => (
                                    <li key={index} className="w-full px-7 border-b border-gray-200 last:border-b-0">
                                        <button
                                            onClick={() => handleSelectLocation(location)}
                                            className="flex border-b border-gray-200 last:border-b-0 items-center w-full py-3"
                                        >
                                            <div className="bg-[#F4F4F4] rounded-full p-2 mr-4 flex items-center justify-center">
                                                <Image src={"/icons/searchicon.svg"} alt="search" height={12} width={12} />
                                            </div>
                                            <span className="font-normal text-sm text-[#2C3C4E]">{location}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Search results */}
                    {searchValue && (
                        <div className="p-4">
                            <h3 className="text-sm text-gray-500 mb-2">
                                {isLoading ? "Searching..." : "Search results"}
                            </h3>

                            {isLoading && (
                                <div className="flex justify-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            )}

                            {error && (
                                <div className="text-center py-4 text-red-500">
                                    {error}
                                </div>
                            )}

                            {!isLoading && !error && (
                                <ul>
                                    {locations.length > 0 ? (
                                        locations.map((location, index) => (
                                            <li key={index}>
                                                <button
                                                    onClick={() => handleSelectLocation(location)}
                                                    className="flex px-3 items-center w-full py-3"
                                                >
                                                    <div className="bg-[#F4F4F4] rounded-full p-2 mr-4 flex items-center justify-center">
                                                        <Image src={"/icons/searchicon.svg"} alt="search" height={12} width={12} />
                                                    </div>
                                                    <span className="font-normal text-sm text-[#2C3C4E]">{location}</span>
                                                </button>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-center py-4 text-gray-500">
                                            {searchValue.length < 2
                                                ? "Type at least 2 characters to search"
                                                : `No locations found matching "${searchValue}"`}
                                        </li>
                                    )}
                                </ul>
                            )}
                        </div>
                    )}

                    {/* Bottom padding for mobile keyboard */}
                    <div className="h-20"></div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}