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
function PropertyCard({ item, setActiveStep }: { item: TypeItem, setActiveStep: (step: number) => void }) {
    return (
        <div onClick={() => setActiveStep(2)} className="hover:cursor-pointer flex items-center space-x-4 bg-[#F4F4F4] p-4 rounded-md shadow">
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
    setActiveStep,
}: {
    title: string;
    items: TypeItem[];
    selectedTab: string;
    isThisTab?: string;
    setActiveStep?: (step: number) => void;
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
                <PropertyCard setActiveStep={setActiveStep!} key={item.title} item={item} />
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
        <div className={`${inter.className} relative min-h-screen flex flex-col`}>
           
                <button onClick={handleBackButton} className="md:hidden absolute bg-[#353537] p-3 rounded-full text-white z-50 top-8 left-8">
                    <Image src={'/icons/backarrow.svg'} alt="back" height={20} width={20}/>
                </button>
          
            {/* Navbar */}
            <Navbar />

            <div className="relative bg-[#1c1c1c] h-screen flex flex-col">
                {/* Stepper at the top (shared by mobile & desktop) */}
                <CreateListingStepper
                    activeStep={activeStep}
                    handleBackButton={handleBackButton}
                    steps={steps}
                />


                {activeStep === 1 && (<div className="bg-white md:flex md:justify-around rounded-t-[2rem] p-6 min-h-screen -mt-2">

                    <h2 className="text-base font-semibold mb-4 md:hidden">
                        Select the type of rental property.
                    </h2>

                    {/* Mobile-only tabs */}
                    <div>
                        <div className="flex space-x-2 mb-4 md:hidden">
                            <button
                                onClick={() => setSelectedTab("Apartment")}
                                className={`px-4 py-2 rounded-full text-sm font-semibold ${selectedTab === "Apartment"
                                    ? "bg-[#353537] text-white"
                                    : "bg-gray-200 text-gray-700"
                                    }`}
                            >
                                Apartment
                            </button>
                            <button
                                onClick={() => setSelectedTab("House")}
                                className={`px-4 py-2 rounded-full text-sm font-semibold ${selectedTab === "House"
                                    ? "bg-[#353537] text-white"
                                    : "bg-gray-200 text-gray-700"
                                    }`}
                            >
                                House
                            </button>
                        </div>


                        <div className="flex flex-col md:flex-row md:space-x-8">
                            <PropertyColumn
                                setActiveStep={setActiveStep}
                                title="Apartment"
                                items={apartmentItems}
                                selectedTab={selectedTab}
                                isThisTab="Apartment"
                            />
                            <PropertyColumn
                                title="House"
                                setActiveStep={setActiveStep}

                                items={houseItems}
                                selectedTab={selectedTab}
                                isThisTab="House"
                            />
                        </div>
                    </div>


                </div>)}


                {activeStep === 2 && (
                    <div className="bg-white md:flex md:justify-around rounded-t-[2rem] p-6 h-full -mt-2">
                        <div className="max-w-md mx-auto w-full flex flex-col pt-5 md:pt-6 justify-center md:justify-start space-y-4">
                            {/* Monthly price */}
                            <div className="flex flex-col space-y-3">
                                <label className="text-sm font-base">
                                    Monthly price for your rental?
                                </label>
                                <input
                                    type="text"
                                    placeholder="$2000"
                                    className="
                                        w-full
                                        bg-[#F4F4F4]
                                        border
                                        border-gray-300
                                        rounded-lg
                                        p-3
                                        text-sm
                                        focus:outline-none
                                        focus:ring-1
                                        focus:ring-black
                                    "
                                />
                            </div>

                            {/* Start date */}
                            <div className="flex flex-col space-y-3">
                                <label className="text-sm font-base ">
                                    Pick a start date for your rental
                                </label>
                                <div className="flex space-x-2">
                                    <select
                                        className="
                                        flex-1
                                        border
                                        border-gray-300
                                        rounded-lg
                                        p-3
                                        text-sm
                                        
                                        focus:outline-none
                                        focus:ring-1
                                        focus:ring-black
                                        "
                                    >
                                        <option>January</option>
                                        <option>February</option>
                                        <option>March</option>

                                    </select>

                                    <select
                                        className="
                                           flex-1
                                        border
                                        border-gray-300
                                        rounded-lg
                                        p-3
                                        text-sm
                                        
                                        focus:outline-none
                                        focus:ring-1
                                        focus:ring-black
                                            "
                                    >
                                        <option>01</option>
                                        <option>02</option>
                                        <option>03</option>
                                        {/* Add more days as needed */}
                                    </select>

                                    <select
                                        className="
                                       flex-1
                                        border
                                        border-gray-300
                                        rounded-lg
                                        p-3
                                        text-sm
                                        
                                        focus:outline-none
                                        focus:ring-1
                                        focus:ring-black
                                        "
                                    >
                                        <option>2023</option>
                                        <option>2024</option>
                                        <option>2025</option>
                                        {/* Add more years as needed */}
                                    </select>
                                </div>
                            </div>

                            {/* Lease duration */}
                            <div className="flex flex-col space-y-3">
                                <label className="text-sm font-base ">
                                    How long is the lease duration?
                                </label>
                                <select
                                    className="
                                        w-full
                                        border
                                        border-gray-300
                                        rounded-lg
                                        p-3
                                        text-sm
                                        text-gray-700
                                        focus:outline-none
                                        focus:ring-1
                                        focus:ring-black
                                    "
                                >
                                    <option>Month-to-Month / Flexible</option>
                                    <option>6 Months</option>
                                    <option>12 Months</option>
                                    {/* Add more durations as needed */}
                                </select>
                            </div>

                            <div className="h-64 md:h-8">

                            </div>

                            {/* Continue button */}
                            <button onClick={() => { setActiveStep(3) }}
                                type="button"
                                className="
                                bg-black
                                text-white
                                w-full
                                py-5
                                rounded-full
                                font-semibold
                                text-sm
                                focus:outline-none
                                focus:ring-2
                                focus:ring-black
                                "
                            >
                                Continue
                            </button>
                        </div>

                    </div>
                )}

                {activeStep === 3 && (
                    <div className="bg-white md:flex md:justify-around rounded-t-[2rem] p-6 h-full -mt-2">
                        <div className="flex flex-col justify-stretch h-full max-w-md mx-auto w-full">
                            {/* Top Section: Location & Intersection */}
                            <div className="space-y-6">
                                {/* "Your location?" */}
                                <div className="flex flex-col space-y-1">
                                    <label className="text-sm font-semibold text-black">
                                        Your location?
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Toronto, ON"
                                        className="
                                        w-full
                                        border
                                        bg-[#F4F4F4]
                                        border-gray-300
                                        rounded-lg
                                        p-3
                                        text-sm
                                        focus:outline-none
                                        focus:ring-1
                                        focus:ring-black
                                        "
                                    />
                                </div>

                                {/* Divider with "or" */}
                                <div className="relative flex items-center justify-center">
                                    <hr className="absolute w-full border-gray-200" />
                                    <span className="bg-white px-2 text-gray-400 text-xs">or</span>
                                </div>

                                {/* "Nearest intersection" */}
                                <div className="flex flex-col space-y-1">
                                    <label className="text-sm font-semibold text-black">
                                        Nearest intersection
                                    </label>
                                    <textarea
                                        placeholder="Main St & Danforth"
                                        className="
                                            w-full
                                            border
                                            bg-[#F4F4F4]
                                            border-gray-300
                                            rounded-lg
                                            p-3
                                            text-sm
                                            focus:outline-none
                                            focus:ring-1
                                            focus:ring-black
                                            h-24
                                                "           
                                    />
                                </div>
                            </div>

                            {/* Bottom Section: Continue Button */}
                            <button
                                type="button"
                                className="
                                        bg-black
                                        text-white
                                        w-full
                                        py-3
                                        rounded-full
                                        font-semibold
                                        text-sm
                                        mt-6
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-black
                                        "
                            >
                                Continue
                            </button>
                        </div>

                    </div>
                )}


            </div>
        </div>
    );
}
