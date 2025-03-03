"use client";

import React, { useRef, useState } from "react";
import Navbar from "@/components/NavBar";
import CreateListingStepper from "@/components/CreateListingStepper";
import Image from "next/image";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";

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
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(1);
    const [selectedTab, setSelectedTab] = useState<"Apartment" | "House">("Apartment");
    const [bedrooms, setBedrooms] = useState("");
    const [bathrooms, setBathrooms] = useState("");

    // State for toggle: "Couple-friendly".
    const [isCoupleFriendly, setIsCoupleFriendly] = useState(false);
    // eslint-disable-next-line
    const [description, setDescription] = useState("");
    // eslint-disable-next-line
    const [walikingDistanceTo, setWalkingDistanceTo] = useState("");

    // List of possible amenities
    const availableAmenities = [
        "Pet Friendly",
        "Parking",
        "Utilities",
        "Wi-Fi",
        "Laundry",
        "Air Conditioning",
        "Furnished",
        "Storage",
        "Balcony",
        "Heating",
        "Dishwasher",
    ];

    // State for selected amenities (array of strings).
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

    // Toggle an amenity in the selectedAmenities array
    const handleAmenityToggle = (amenity: string) => {
        if (selectedAmenities.includes(amenity)) {
            setSelectedAmenities((prev) => prev.filter((a) => a !== amenity));
        } else {
            setSelectedAmenities((prev) => [...prev, amenity]);
        }
    };


    const handleBackButton = () => {
        if (activeStep > 1) {
            setActiveStep((prev) => prev - 1);
        }
    };


    const [descriptionPoints, setDescriptionPoints] = useState(["", ""]);

    // 2) Manage the "Walking Distance" points: each index is an independent text value
    const [walkingDistancePoints, setWalkingDistancePoints] = useState(["", ""]);

    // Handler to add a new Description input
    const handleAddDescriptionPoint = () => {
        setDescriptionPoints((prev) => [...prev, ""]);
    };

    const handleRemoveImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };





    // Handler to add a new Walking Distance input
    const handleAddWalkingDistancePoint = () => {
        setWalkingDistancePoints((prev) => [...prev, ""]);
    };

    // Update the text for a specific Description input
    const handleDescriptionChange = (index: number, value: string) => {
        const updatedPoints = [...descriptionPoints];
        updatedPoints[index] = value; // Update only the changed field
        setDescriptionPoints(updatedPoints);
    };

    // Update the text for a specific Walking Distance input
    const handleWalkingDistanceChange = (index: number, value: string) => {
        const updatedPoints = [...walkingDistancePoints];
        updatedPoints[index] = value; // Update only the changed field
        setWalkingDistancePoints(updatedPoints);
    };




    const [images, setImages] = useState<string[]>([]);
    // We'll use a hidden file input for the "Add More" button (when images.length >= 6).
    const hiddenFileInputRef = useRef<HTMLInputElement>(null);
    // eslint-disable-next-line
    const [activeIndex, setActiveIndex] = useState(0);

    // Handle file input
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const fileUrl = URL.createObjectURL(file);
        setImages((prev) => [...prev, fileUrl]);
        // Reset the input so that selecting the same file again works.
        e.target.value = "";
    };

    const totalSlots = images.length < 6 ? 6 : images.length + 1;


    return (
        <div className={`${inter.className} relative min-h-screen flex flex-col`}>

            <button onClick={handleBackButton} className="md:hidden absolute bg-[#353537] p-3 rounded-full text-white z-50 top-8 left-8">
                <Image src={'/icons/backarrow.svg'} alt="back" height={20} width={20} />
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
                                py-4
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
                                onClick={() => { setActiveStep(prev => prev + 1) }}
                                type="button"
                                className="
                                        bg-black
                                        text-white
                                        w-full
                                        py-4    
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

                {activeStep === 4 && (
                    <div
                        className="
      bg-white 
      md:flex 
      md:justify-center 
      md:items-center 
      rounded-t-[2rem] 
      p-6 
      h-full 
      -mt-2
    "
                    >
                        <div
                            className="
        flex 
        flex-col 
        space-y-2 
        p-4 
        w-full 
        md:max-w-[450px] 
      "
                        >
                            {/* 1) First Div: Title + Dropdowns */}
                            <div className="flex flex-col pb-4 space-y-4">
                                <div>
                                    <h2 className="text-base font-normal">
                                        Total number of beds + baths in your house?
                                    </h2>
                                </div>
                                <div className="flex flex-row space-x-2">
                                    {/* Bedrooms Dropdown */}
                                    <select
                                        className="border py-4 px-2 rounded"
                                        value={bedrooms}
                                        onChange={(e) => setBedrooms(e.target.value)}
                                    >
                                        <option value="">Bedrooms</option>
                                        <option value="1">1 Bedroom</option>
                                        <option value="2">2 Bedrooms</option>
                                        <option value="3">3 Bedrooms</option>
                                        <option value="4">4 Bedrooms</option>
                                        <option value="5">5 Bedrooms</option>
                                    </select>

                                    {/* Bathrooms Dropdown */}
                                    <select
                                        className="border p-2 rounded"
                                        value={bathrooms}
                                        onChange={(e) => setBathrooms(e.target.value)}
                                    >
                                        <option value="">Bathrooms</option>
                                        <option value="1">1 Bathroom</option>
                                        <option value="2">2 Bathrooms</option>
                                        <option value="3">3 Bathrooms</option>
                                        <option value="4">4 Bathrooms</option>
                                        <option value="5">5 Bathrooms</option>
                                    </select>
                                </div>
                            </div>

                            <hr />

                            {/* 2) Second Div: Couple-friendly Toggle */}
                            <div className="flex py-4 flex-row items-center justify-between">
                                {/* Label + Sub-caption */}
                                <div className="flex flex-col">
                                    <span className="font-medium">Couple-friendly</span>
                                    <span className="text-sm">
                                        Couple can share this private room
                                    </span>
                                </div>

                                {/* Toggle Button */}
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isCoupleFriendly}
                                        onChange={(e) => setIsCoupleFriendly(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div
                                        className="
              w-11 h-6 
              bg-gray-200 
              peer-focus:outline-none 
              rounded-full peer
              dark:bg-gray-700 
              peer-checked:bg-blue-600 
              peer-checked:after:translate-x-full 
              peer-checked:after:border-white 
              after:content-[''] 
              after:absolute 
              after:top-[2px] 
              after:left-[2px] 
              after:bg-white 
              after:border-gray-300 
              after:border 
              after:rounded-full 
              after:h-5 
              after:w-5 
              after:transition-all
            "
                                    />
                                </label>
                            </div>

                            <hr />

                            {/* 3) Third Div: Amenities Title + Chips */}
                            <div className="flex py-4 flex-col space-y-2">
                                <div>
                                    <h2 className="text-base font-medium mb-3">
                                        Select all the amenities your rental offers
                                    </h2>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {availableAmenities.map((amenity) => (
                                        <button
                                            key={amenity}
                                            type="button"
                                            onClick={() => handleAmenityToggle(amenity)}
                                            className={`px-3 py-2 border rounded-full transition 
                ${selectedAmenities.includes(amenity)
                                                    ? "bg-blue-500 text-white border-blue-500"
                                                    : "hover:bg-gray-100"
                                                }`}
                                        >
                                            {amenity}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <hr />

                            {/* 4) Fourth Div: Caption + Continue Button */}
                            <div className="flex flex-col py-4 space-y-4">
                                <p className="text-sm mb-2">
                                    If you don&apos;t see an amenity listed, you can mention it in the next step.
                                </p>
                                <button
                                    onClick={() => {
                                        setActiveStep((prev) => prev + 1);
                                    }}
                                    className="px-4 py-3 bg-black text-white rounded-full hover:bg-blue-700"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeStep === 5 && (
                    <div className="bg-white md:flex md:justify-around rounded-t-[2rem] p-6 h-full -mt-2">
                        <div className="flex flex-col space-y-8 p-4 md:p-8 md:w-1/2">
                            {/* 1) First Division: Description */}
                            <div className="flex flex-col space-y-4">
                                <label className="text-base font-semibold">Description:</label>

                                {descriptionPoints.map((point, index) => {
                                    const isLast = index === descriptionPoints.length - 1;
                                    return (
                                        <div
                                            key={index}
                                            className="flex flex-col md:flex-row md:items-center md:gap-2"
                                        >
                                            <input
                                                type="text"
                                                placeholder={`Point ${index + 1}`}
                                                value={point}
                                                onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                                className="border border-gray-300 rounded p-2 focus:outline-none flex-1"
                                            />
                                            {isLast && (
                                                <button
                                                    onClick={handleAddDescriptionPoint}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition mt-2 md:mt-0"
                                                >
                                                    Add +
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* 2) Second Division: Walking Distance */}
                            <div className="flex flex-col space-y-4">
                                <label className="text-base font-semibold">Walking Distance to:</label>

                                {walkingDistancePoints.map((point, index) => {
                                    const isLast = index === walkingDistancePoints.length - 1;
                                    return (
                                        <div
                                            key={index}
                                            className="flex flex-col md:flex-row md:items-center md:gap-2"
                                        >
                                            <input
                                                type="text"
                                                placeholder={`Point ${index + 1}`}
                                                value={point}
                                                onChange={(e) =>
                                                    handleWalkingDistanceChange(index, e.target.value)
                                                }
                                                className="border border-gray-300 rounded p-2 focus:outline-none flex-1"
                                            />
                                            {isLast && (
                                                <button
                                                    onClick={handleAddWalkingDistancePoint}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition mt-2 md:mt-0"
                                                >
                                                    Add +
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* 3) Third Division: Continue button */}
                            <div className="flex justify-center">
                                <button
                                    onClick={() => { setActiveStep(prev => prev + 1) }}
                                    className="bg-black text-white rounded-full px-4 py-3 w-full max-w-sm hover:bg-gray-900 transition"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeStep === 6 && (
                    <div className="bg-white md:flex md:justify-around rounded-t-[2rem] p-6 h-full -mt-2">
                        <div className="flex flex-col items-center p-4 min-h-screen bg-white">
                            {/* Grid: 2 columns on mobile, 3 columns on desktop */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl mb-4">
                                {Array.from({ length: totalSlots }, (_, i) => {
                                    if (i < images.length) {
                                        // Uploaded image slot
                                        return (
                                            <div
                                                key={i}
                                                className="relative w-full aspect-square md:h-64 md:aspect-auto bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden"
                                            >
                                                <img
                                                    src={images[i]}
                                                    alt={`Uploaded ${i}`}
                                                    className="object-cover w-full h-full"
                                                />
                                                {/* Cancel icon */}
                                                <div
                                                    onClick={() => handleRemoveImage(i)}
                                                    className="absolute top-1 right-1 w-6 h-6 bg-white text-black rounded-full flex items-center justify-center cursor-pointer shadow-md"
                                                >
                                                    ✕
                                                </div>
                                            </div>
                                        );
                                    } else if (i === images.length) {
                                        // Active upload slot (with camera icon)
                                        return (
                                            <div
                                                key={i}
                                                className="relative w-full aspect-square md:h-64 md:aspect-auto bg-gray-100 rounded-lg flex items-center justify-center"
                                            >
                                                <label className="cursor-pointer flex flex-col items-center justify-center">
                                                    <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center shadow">
                                                        <span className="text-gray-400 text-2xl">📷</span>
                                                        <span className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                                                            +
                                                        </span>
                                                    </div>
                                                    {/* Hidden file input */}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={handleFileUpload}
                                                    />
                                                </label>
                                            </div>
                                        );
                                    } else {
                                        // Remaining empty placeholders (non-clickable)
                                        return (
                                            <div
                                                key={i}
                                                className="md:w-64 aspect-square md:h-64 md:aspect-auto bg-gray-100 rounded-lg"
                                            ></div>
                                        );
                                    }
                                })}
                            </div>

                            {/* Continue Button */}
                            <button
                                onClick={() => console.log(router.push('/show-listing'))}
                                className="bg-black text-white rounded-full px-6 py-3 w-full max-w-md"
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
