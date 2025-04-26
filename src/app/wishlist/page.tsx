"use client";
import React, { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import WishlistCardCarousel from "@/components/WishlistPropertyCard";
import MobileBottomTabs from "@/components/MobileBottomTabs";
import Navbar from "@/components/NavBar";
import api from "@/lib/axios";

const inter = Inter({ subsets: ["latin"] });

interface Property {
    _id: string;
    images: string[];
    address: string;
    price: number;
    createdAt: string;
    title?: string;
    amenities?: string[];
}

export default function Wishlist() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    // Fetch wishlist data from API
    useEffect(() => {
        const fetchWishlist = async () => {
            setIsLoading(true);
            setError("");

            try {
                const response = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/wishlist`);

                if (response.data.success) {
                    setProperties(response.data.wishlist);
                } else {
                    setError("Failed to load wishlist");
                }
            } catch (err) {
                console.error("Error fetching wishlist:", err);
                setError("An error occurred while fetching your wishlist");
            } finally {
                setIsLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    // Remove property from wishlist
    const handleRemoveFromWishlist = async (propertyId: string) => {
        try {
            console.log("Inside the try block")
            const response = await api.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/wishlist/${propertyId}`);
            console.log(response)

            if (response.data.success) {
                // Update the local state by removing the property
                setProperties(prev => prev.filter(property => property._id !== propertyId));
            } else {
                setError("Failed to remove property from wishlist");
            }
        } catch (err) {
            console.error("Error removing from wishlist:", err);
            setError("An error occurred while updating your wishlist");
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className={`${inter.className} flex items-center justify-center h-screen bg-black`}>
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div className={inter.className}>
            <div className="md:hidden min-h-screen bg-[#1F1F21] flex flex-col h-screen">
                {/* Top bar - fixed */}
                <div className="flex items-center justify-center h-16 relative">
                    <h1 className="text-white text-base font-medium">Wishlist</h1>
                </div>

                {/* Error message if any */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-4 mt-2">
                        {error}
                    </div>
                )}

                {/* White container with rounded top corners - scrollable */}
                <div className="bg-white rounded-t-3xl flex-1 overflow-hidden flex flex-col">
                    <div className="overflow-y-auto flex-1 p-4">
                        {properties.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>Your wishlist is empty</p>
                                <p className="text-sm mt-2">Save properties you&apos;re interested in to view them later</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {properties.map((property) => (
                                    <WishlistCardCarousel
                                        id={property._id}
                                        key={property._id}
                                        images={property.images}
                                        address={property.address}
                                        price={property.price}
                                        date={new Date(property.createdAt)}
                                        onCancel={() => handleRemoveFromWishlist(property._id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile bottom tabs - fixed */}
                <MobileBottomTabs />
            </div>

            {/* ============= DESKTOP VIEW ============= */}
            <div className="hidden md:block min-h-screen bg-black">
                {/* Top bar */}
                <Navbar />

                {/* White container with rounded top corners */}
                <div className="bg-white rounded-t-3xl p-8">
                    {/* Error message if any */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {properties.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
                            <p className="text-base">Save properties you&apos;re interested in to view them later</p>
                        </div>
                    ) : (
                        /* Grid of property cards */
                        <div className="max-w-7xl mt-10 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                            {properties.map((property) => (
                                <WishlistCardCarousel
                                    id={property._id}
                                    key={property._id}
                                    images={property.images}
                                    address={property.address}
                                    price={property.price}
                                    date={new Date(property.createdAt)}
                                    onCancel={() => handleRemoveFromWishlist(property._id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}