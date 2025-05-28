"use client";

import CreateListingStepper from "@/components/CreateListingStepper";
import Navbar from "@/components/NavBar";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import PropertyTypeSelector from "./step1";
import RentalDetails from "./step2";
import LocationSelector from "./step3";
import PropertyFeatures from "./step4";
import PropertyDescription from "./step5";
import PropertyPhotos from "./step6";

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

export default function Page() {
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(1);
    const [selectedTab, setSelectedTab] = useState<"Apartment" | "House">("Apartment");
    const [selectedPropertyType, setSelectedPropertyType] = useState("");

    // Step 2 state
    const [monthlyPrice, setMonthlyPrice] = useState("");
    const [startDate, setStartDate] = useState("");
    const [leaseDuration, setLeaseDuration] = useState("Month-To-Month / Flexible");

    // Step 3 state
    const [location, setLocation] = useState("");
    const [intersection, setIntersection] = useState("");

    // Step 4 state
    const [bedrooms, setBedrooms] = useState("");
    const [bathrooms, setBathrooms] = useState("");
    const [isCoupleFriendly, setIsCoupleFriendly] = useState(false);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

    // Step 5 state
    const [descriptionPoints, setDescriptionPoints] = useState(["", ""]);
    const [walkingDistancePoints, setWalkingDistancePoints] = useState(["", ""]);
    const [submitting, setIsSubmitting] = useState(false);

    // Step 6 state
    const [images, setImages] = useState<string[]>([]);

    // List of possible amenities
    const availableAmenities = [
        { title: "Pet Friendly", icon: '/icons/petfriendly.svg' },
        { title: "Parking", icon: '/icons/amenetiesparking.svg' },
        { title: "Utilities", icon: '/icons/amenetiesutilities.svg' },
        { title: "Wi-Fi", icon: '/icons/amenetieswifi.svg' },
        { title: "Laundry", icon: '/icons/amenetieslaundry.svg' },
        { title: "Air Conditioning", icon: '/icons/amenetiesac.svg' },
        { title: "Furnished", icon: '/icons/amenetiesfurnished.svg' },
        { title: "Storage", icon: '/icons/amenetiesstorage.svg' },
        { title: "Balcony", icon: '/icons/amenetiesbalconies.svg' },
        { title: "Heating", icon: '/icons/amenetiesheating.svg' },
        { title: "Dishwasher", icon: '/icons/amenetiesdishwasher.svg' },
    ];

    // Event handlers
    const handleBackButton = () => {
        if (activeStep > 1) {
            setActiveStep((prev) => prev - 1);
        }
        if (activeStep === 1) {
            router.back()
        }
    };

    const handlePropertySelect = (propertyType: string) => {
        setSelectedPropertyType(propertyType);
        setActiveStep(2);
    };

    // Modified to save to localStorage and redirect to review page
    const handleSubmitListing = async (): Promise<void> => {
        try {
            // Show loading state
            setIsSubmitting(true);

            // Form validation
            if (!selectedPropertyType) {
                alert("Please select a property type");
                setActiveStep(1);
                setIsSubmitting(false);
                return;
            }

            if (!monthlyPrice || !startDate) {
                alert("Please provide price and start date");
                setActiveStep(2);
                setIsSubmitting(false);
                return;
            }

            if (!location) {
                alert("Please provide a location");
                setActiveStep(3);
                setIsSubmitting(false);
                return;
            }

            if (!bedrooms || !bathrooms) {
                alert("Please specify bedrooms and bathrooms");
                setActiveStep(4);
                setIsSubmitting(false);
                return;
            }

            // Determine the correct property type value based on selection
            let propertyType;
            if (selectedTab === "Apartment") {
                propertyType = selectedPropertyType === "Shared Room"
                    ? "Shared Room in Apartment"
                    : selectedPropertyType;
            } else {
                propertyType = selectedPropertyType === "Shared Room"
                    ? "Shared Room in House"
                    : selectedPropertyType;
            }

            // Create the rental data object
            const rentalData = {
                propertyType: propertyType,
                monthlyPrice: Number(monthlyPrice),
                startDate: new Date(startDate).toISOString(),
                leaseDuration: leaseDuration,
                location: location,
                nearestIntersection: intersection,
                numberOfBedrooms: Number(bedrooms),
                numberOfBathrooms: Number(bathrooms),
                coupleFriendly: isCoupleFriendly,
                amenities: selectedAmenities,
                description: descriptionPoints.filter(point => point.trim() !== ''),
                walkingDistanceTo: walkingDistancePoints.filter(point => point.trim() !== ''),
                images: images
            };

            // Store in localStorage for the review page
            localStorage.setItem('pendingListing', JSON.stringify(rentalData));
            
            // Redirect to review page
            router.push('/review-listing');
            
        } catch (error) {
            console.error('Error preparing listing data:', error);
            alert(`Error: ${error instanceof Error ? error.message : 'Something went wrong'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAmenityToggle = (amenity: string) => {
        if (selectedAmenities.includes(amenity)) {
            setSelectedAmenities((prev) => prev.filter((a) => a !== amenity));
        } else {
            setSelectedAmenities((prev) => [...prev, amenity]);
        }
    };

    const handleAddDescriptionPoint = () => {
        setDescriptionPoints((prev) => [...prev, ""]);
    };

    const handleDescriptionChange = (index: number, value: string) => {
        const updatedPoints = [...descriptionPoints];
        updatedPoints[index] = value;
        setDescriptionPoints(updatedPoints);
    };

    const handleRemoveDescriptionPoint = (index: number) => {
        if (descriptionPoints.length > 1) {
            setDescriptionPoints((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleAddWalkingDistancePoint = () => {
        setWalkingDistancePoints((prev) => [...prev, ""]);
    };

    const handleWalkingDistanceChange = (index: number, value: string) => {
        const updatedPoints = [...walkingDistancePoints];
        updatedPoints[index] = value;
        setWalkingDistancePoints(updatedPoints);
    };

    const handleRemoveWalkingDistancePoint = (index: number) => {
        if (walkingDistancePoints.length > 1) {
            setWalkingDistancePoints((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const fileUrl = URL.createObjectURL(file);
        setImages((prev) => [...prev, fileUrl]);
        e.target.value = "";
    };

    const totalSlots = images.length < 6 ? 6 : images.length + 1;

    return (
        // Page container - Fixed height, no scroll
        <div className={`${inter.className} h-screen overflow-hidden bg-[#1c1c1c] flex flex-col`}>
            {/* Navbar */}
            <Navbar />

            {/* Main content container */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Dark section - Fixed, non-scrollable */}
                <div className="bg-[#1c1c1c] flex-shrink-0">
                    {/* Mobile back button */}
                    <button onClick={handleBackButton} className="md:hidden absolute bg-[#353537] rounded-full text-white z-50 top-7 left-8">
                        <Image src={'/icons/backbuttonn.svg'} alt="back" height={32} width={32} />
                    </button>

                    {/* Stepper */}
                    <CreateListingStepper
                        activeStep={activeStep}
                        handleBackButton={handleBackButton}
                        steps={steps}
                    />
                </div>

                {/* White section - Scrollable */}
                <div className="flex-1 overflow-hidden">
                    {activeStep === 1 && (
                        <PropertyTypeSelector
                            selectedTab={selectedTab}
                            setSelectedTab={setSelectedTab}
                            setActiveStep={setActiveStep}
                            apartmentItems={apartmentItems}
                            houseItems={houseItems}
                            onSelectPropertyType={handlePropertySelect}
                        />
                    )}

                    {activeStep === 2 && (
                        <RentalDetails
                            setActiveStep={setActiveStep}
                            monthlyPrice={monthlyPrice}
                            setMonthlyPrice={setMonthlyPrice}
                            startDate={startDate}
                            setStartDate={setStartDate}
                            leaseDuration={leaseDuration}
                            setLeaseDuration={setLeaseDuration}
                        />
                    )}

                    {activeStep === 3 && (
                        <LocationSelector
                            setActiveStep={setActiveStep}
                            location={location}
                            setLocation={setLocation}
                            intersection={intersection}
                            setIntersection={setIntersection}
                        />
                    )}

                    {activeStep === 4 && (
                        <PropertyFeatures
                            bedrooms={bedrooms}
                            setBedrooms={setBedrooms}
                            bathrooms={bathrooms}
                            setBathrooms={setBathrooms}
                            isCoupleFriendly={isCoupleFriendly}
                            setIsCoupleFriendly={setIsCoupleFriendly}
                            selectedAmenities={selectedAmenities}
                            handleAmenityToggle={handleAmenityToggle}
                            availableAmenities={availableAmenities}
                            setActiveStep={setActiveStep}
                        />
                    )}

                    {activeStep === 5 && (
                        <PropertyDescription
                            descriptionPoints={descriptionPoints}
                            handleDescriptionChange={handleDescriptionChange}
                            handleAddDescriptionPoint={handleAddDescriptionPoint}
                            handleRemoveDescriptionPoint={handleRemoveDescriptionPoint}
                            walkingDistancePoints={walkingDistancePoints}
                            handleWalkingDistanceChange={handleWalkingDistanceChange}
                            handleAddWalkingDistancePoint={handleAddWalkingDistancePoint}
                            handleRemoveWalkingDistancePoint={handleRemoveWalkingDistancePoint}
                            setActiveStep={setActiveStep}
                        />
                    )}

                    {activeStep === 6 && (
                        <PropertyPhotos
                            images={images}
                            setImages={setImages}
                            handleFileUpload={handleFileUpload}
                            handleRemoveImage={handleRemoveImage}
                            
                            handleSubmitListing={handleSubmitListing}
                            isSubmitting={submitting}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}