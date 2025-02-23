"use client";

import React, { useState } from "react";
import Navbar from "@/components/NavBar";
import CreateListingStepper from "@/components/CreateListingStepper";
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface TypeItem {
    title: string;
    description: string;
    icon: React.ReactNode;
}

/** Mock data for the "Apartment" column */
const apartmentItems: TypeItem[] = [
    {
        title: "Private room in Apartment",
        description: "Single room available for rent",
        icon: (
            <Image
                src={"/icons/privateroomapartment.svg"}
                alt="private room apartment"
                height={30}
                width={30}
            />
        ),
    },
    {
        title: "Apartment / Condo",
        description: "Entire unit available for rent",
        icon: (
            <Image
                src={"/icons/apartmentcondo.svg"}
                alt="apartment / condo"
                height={30}
                width={30}
            />
        ),
    },
    {
        title: "Shared Room",
        description: "A room shared with a roommate for rent",
        icon: (
            <Image
                src={"/icons/handshake.svg"}
                alt="shared room"
                height={30}
                width={30}
            />
        ),
    },
];

/** Mock data for the "House" column */
const houseItems: TypeItem[] = [
    {
        title: "Private room in House",
        description: "Single room available for rent",
        icon: (
            <Image
                src={"/icons/privateroomhouse.svg"}
                alt="private room house"
                height={30}
                width={30}
            />
        ),
    },
    {
        title: "House / Townhouse",
        description: "Entire place available for rent",
        icon: (
            <Image src={"/icons/townhouse.svg"} alt="townhouse" height={30} width={30} />
        ),
    },
    {
        title: "Basement",
        description: "Basement for rent",
        icon: (
            <Image src={"/icons/basement.svg"} alt="basement" height={30} width={30} />
        ),
    },
    {
        title: "Shared Room",
        description: "A room shared with a roommate for rent",
        icon: (
            <Image src={"/icons/handshake.svg"} alt="shared room" height={30} width={30} />
        ),
    },
];

// Steps for the top stepper
const steps = [
    "Select the type of rental property.",
    "Private room in an apartment.",
    "Share your location.",
    "Make your unit shine.",
    "Any information you want to share?",
    "Final step to upload photos/videos",
];

/** Reusable card for each property item */
function PropertyCard({ item }: { item: TypeItem }) {
    return (
        <div className="flex items-center space-x-4 bg-[#F4F4F4] p-4 rounded-md shadow">
            <div className="w-10 h-10 bg-[#1F1F21] flex p-2 items-center justify-center rounded-full">
                {item.icon}
            </div>
            <div className="flex flex-col">
                <span className="font-semibold">{item.title}</span>
                <span className="text-sm text-gray-500">{item.description}</span>
            </div>
        </div>
    );
}

/** Column for property type (Apartment or House).
    - On desktop, always visible.
    - On mobile, visible only if it matches the selectedTab. */
function PropertyColumn({
    title,
    items,
    selectedTab,
    isThisTab,
}: {
    title: string;
    items: TypeItem[];
    selectedTab: string;
    isThisTab: string;
}) {
    return (
        <div
            className={`
        // For desktop, show both columns side-by-side
        md:w-1/2 md:block

        // On mobile, show only the column that matches the selected tab
        ${selectedTab === isThisTab ? "block" : "hidden"}

        // Some spacing and sizing
        space-y-4 w-full max-w-md
      `}
        >
            {/* Title is hidden on mobile (since we use tab buttons), 
          but shown on desktop */}
            <h2 className="hidden md:block text-xl font-semibold">{title}</h2>

            {items.map((item) => (
                <PropertyCard key={item.title} item={item} />
            ))}
        </div>
    );
}

export default function Page() {
    const [activeStep, setActiveStep] = useState(1);
    const [selectedTab, setSelectedTab] = useState<"Apartment" | "House">("Apartment");

    const handleBackButton = () => {
        if (activeStep > 1) {
            setActiveStep((prev) => prev - 1);
        }
    };

    return (
        <div className={`${inter.className} min-h-screen flex flex-col`}>
            {/* Navbar */}
            <Navbar />

            <div className="relative bg-[#1c1c1c] flex flex-col">
                {/* Stepper at the top (shared by mobile & desktop) */}
                <CreateListingStepper
                    activeStep={activeStep}
                    handleBackButton={handleBackButton}
                    steps={steps}
                />

                {/* 
          Main container: 
          - Rounded top white area
          - Single markup for both desktop & mobile 
        */}
                <div className="bg-white md:flex md:justify-around rounded-t-[2rem] p-6 min-h-screen -mt-2">
                    {/* 
            On mobile, we show a small heading + 2 tab buttons (Apartment/House).
            On desktop, we rely on the side-by-side columns below.
          */}
                    <h2 className="text-base font-semibold mb-4 md:hidden">
                        Select the type of rental property.
                    </h2>

                    {/* Mobile-only tabs */}
                    <div className="flex space-x-2 mb-4 md:hidden">
                        <button
                            onClick={() => setSelectedTab("Apartment")}
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${selectedTab === "Apartment"
                                    ? "bg-black text-white"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                        >
                            Apartment
                        </button>
                        <button
                            onClick={() => setSelectedTab("House")}
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${selectedTab === "House"
                                    ? "bg-black text-white"
                                    : "bg-gray-200 text-gray-700"
                                }`}
                        >
                            House
                        </button>
                    </div>

                    {/* 
            Shared layout for both mobile & desktop. 
            - On desktop (md+), we show both columns side-by-side.
            - On mobile, we show only the column that matches selectedTab.
          */}
                    <div className="flex flex-col md:flex-row md:space-x-8">
                        <PropertyColumn
                            title="Apartment"
                            items={apartmentItems}
                            selectedTab={selectedTab}
                            isThisTab="Apartment"
                        />
                        <PropertyColumn
                            title="House"
                            items={houseItems}
                            selectedTab={selectedTab}
                            isThisTab="House"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
