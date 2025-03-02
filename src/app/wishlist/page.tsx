"use client";
import React, { useState } from "react";
import { Inter } from "next/font/google";
import WishlistCardCarousel from "@/components/WishlistPropertyCard"; // Adjust path if needed
import MobileBottomTabs from "@/components/MobileBottomTabs";
import Navbar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });

// Dummy data
const dummyProperties = [
    {
        images: [
            "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
            "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
            "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
            "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
        ],
        address: "265 Mainstreet, Toronto",
        price: 1200,
        date: new Date("2023-06-15"),
    },
    {
        images: [
            "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
            "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
            "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
            "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
        ],
        address: "266 Mainstreet, Toronto",
        price: 1200,
        date: new Date(),
    },
    {
        images: [
            "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
            "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
            "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
            "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
        ],
        address: "267 Mainstreet, Toronto",
        price: 1200,
        date: new Date(),
    },
    {
        images: [
            "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
            "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
            "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
            "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
        ],
        address: "268 Mainstreet, Toronto",
        price: 1200,
        date: new Date(),
    },
    {
        images: [
            "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
            "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
            "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
            "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
        ],
        address: "269 Mainstreet, Toronto",
        price: 1200,
        date: new Date(),
    },
    {
        images: [
            "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
            "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
            "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
            "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
        ],
        address: "270 Mainstreet, Toronto",
        price: 1200,
        date: new Date(),
    },
];

export default function Wishlist() {
    const [properties, setProperties] = useState(dummyProperties);

    // Example of removing a property from the list
    const handleCancel = (index: number) => {
        setProperties((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className={inter.className}>
            {/* ============= MOBILE VIEW ============= */}
            <div className="md:hidden min-h-screen bg-[#1F1F21]">
                {/* Top bar */}
                <div className="flex items-center justify-center h-16 relative">
                    <h1 className="text-white text-base font-medium">Wishlist</h1>
                </div>

                {/* White container with rounded top corners */}
                <div className="bg-white rounded-t-3xl p-4 space-y-4">
                    {properties.map((property, idx) => (
                        <WishlistCardCarousel
                            key={idx}
                            images={property.images}
                            address={property.address}
                            price={property.price}
                            date={property.date}
                            onCancel={() => handleCancel(idx)}
                        />
                    ))}
                </div>

                {/* Mobile bottom tabs */}
                <MobileBottomTabs />
            </div>

            {/* ============= DESKTOP VIEW ============= */}
            <div className="hidden md:block min-h-screen bg-black">
                {/* Top bar */}
                <Navbar />

                {/* White container with rounded top corners */}
                <div className="bg-white rounded-t-3xl p-8">
                    {/* Grid of property cards */}
                    <div className="max-w-7xl mt-10 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        {properties.map((property, idx) => (
                            <WishlistCardCarousel
                                key={idx}
                                images={property.images}
                                address={property.address}
                                price={property.price}
                                date={property.date}
                                onCancel={() => handleCancel(idx)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
