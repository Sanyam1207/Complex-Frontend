'use client'

import LoginModal from '@/components/LoginPopup';
import Navbar from '@/components/NavBar';
import OfferChips from '@/components/OfferChips';
import OnBoardingPopup from '@/components/OnboardingPopup';
import SignUpModal from '@/components/RegisterPopup';
import ShowListingCardReview from '@/components/ShowListingCardReview';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const inter = Inter({
    subsets: ['latin'],
})

// Property type definition for pending listing
interface PropertyType {
    propertyType: string;
    monthlyPrice: number;
    location: string;
    nearestIntersection?: string;
    numberOfBedrooms: number;
    numberOfBathrooms: number;
    coupleFriendly: boolean;
    amenities: string[];
    description: string[];
    startDate: string;
    leaseDuration: string;
    walkingDistanceTo?: string[];
    images: string[];
}

// Fallback data in case localStorage data fails
const fallbackData = {
    demoImages: [
        "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
        "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
        "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
    ],
    walkingDistance: [
        "Fully Furnished",
        "Kitchen with steel appliances",
        "Sharing Washroom",
        "Intersection Main and Danforth",
        "First come first basis",
    ],
    description: [
        "Fully Furnished",
        "Kitchen with steel appliances",
        "Sharing Washroom",
        "Intersection Main and Danforth",
    ],
    address: "265 Mainstreet, Toronto",
    price: 1200,
    availableFrom: "15 June 2023",
    leaseDuration: "12 months"
};

export default function ReviewListing() {
    const dispatch = useDispatch();
    console.log(dispatch)
    const router = useRouter();

    const [property, setProperty] = useState<PropertyType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [userInfo, setUserInfo] = useState({ _id: '', fullName: '', profilePicture: '', createdAt: new Date().toISOString() });
    console.log(userInfo)

    // Load property data from localStorage on component mount
    useEffect(() => {
        // Load user info from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setUserInfo(user);
            } catch (e) {
                console.error('Error parsing user info:', e);
            }
        }

        // Load listing data from localStorage
        try {
            const savedData = localStorage.getItem('pendingListing');
            if (!savedData) {
                setError('No listing data found');
                setLoading(false);
                return;
            }

            const parsedData = JSON.parse(savedData);
            setProperty(parsedData);
        } catch (err) {
            console.error('Error loading listing data:', err);
            setError('Failed to load listing data');
        } finally {
            setLoading(false);
        }
    }, []);

    // Handle publishing the listing (submitting to database)
    const handlePublish = async () => {
        if (!property) {
            setError('No listing data available to publish');
            return;
        }

        try {
            setSubmitting(true);

            // Get the token for authentication
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You must be logged in to publish a listing');
                return;
            }

            // Create a FormData object for multipart form submission
            const formData = new FormData();

            // Add the rental data as JSON
            formData.append('rentalData', JSON.stringify({
                propertyType: property.propertyType,
                monthlyPrice: property.monthlyPrice,
                startDate: property.startDate,
                leaseDuration: property.leaseDuration,
                location: property.location,
                nearestIntersection: property.nearestIntersection,
                numberOfBedrooms: property.numberOfBedrooms,
                numberOfBathrooms: property.numberOfBathrooms,
                coupleFriendly: property.coupleFriendly,
                amenities: property.amenities,
                description: property.description,
                walkingDistanceTo: property.walkingDistanceTo
            }));

            // Process and append each image
            for (let i = 0; i < property.images.length; i++) {
                const imageUrl = property.images[i];

                try {
                    // For blob URLs created with URL.createObjectURL
                    if (imageUrl.startsWith('blob:')) {
                        // Get the image data
                        const response = await fetch(imageUrl);
                        const blob = await response.blob();

                        // Create a file name
                        const fileName = `image-${Date.now()}-${i}.${blob.type.split('/')[1] || 'jpg'}`;

                        // Create a File object from the blob
                        const file = new File([blob], fileName, { type: blob.type });

                        // Append to FormData with field name 'images'
                        formData.append('images', file);
                    } else if (imageUrl.startsWith('data:')) {
                        // For data URLs, convert to blob first
                        const response = await fetch(imageUrl);
                        const blob = await response.blob();

                        // Create a file name
                        const fileName = `image-${Date.now()}-${i}.${blob.type.split('/')[1] || 'jpg'}`;

                        // Create a File object from the blob
                        const file = new File([blob], fileName, { type: blob.type });

                        // Append to FormData with field name 'images'
                        formData.append('images', file);
                    } else if (!imageUrl.includes('cloudinary.com')) {
                        console.warn('Image URL format not supported:', imageUrl);
                    }
                } catch (error) {
                    console.error(`Error processing image ${i}:`, error);
                    // Continue with other images instead of failing the whole upload
                }
            }

            // Submit to API to create the listing
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rentals`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API request failed (${response.status}): ${errorText}`);
            }

            const result = await response.json();
            console.log("Response from backend:", result);

            if (result.success && result.data._id) {
                // Clear the pending listing from localStorage
                localStorage.removeItem('pendingListing');
                
                // Redirect to the show listing page with the newly created listing
                router.push(`/show-listing/${result.data._id}`);
            } else {
                throw new Error(result.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Error publishing listing:', error);
            alert(`Error: ${error instanceof Error ? error.message : 'Something went wrong'}`);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle going back to edit
    const handleCancel = () => {
        router.push('/create-listing');
    };

    // Show loading state
    if (loading) {
        return (
            <div className={`${inter.className} flex items-center justify-center h-screen bg-[#1F1F21]`}>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    // Show error state
    if (error || !property) {
        return (
            <div className={`${inter.className} bg-[#1F1F21] text-white flex flex-col items-center justify-center h-screen p-4`}>
                <h1 className="text-xl font-bold mb-2">Error Loading Property</h1>
                <p>{error || 'Property not found'}</p>
                <button
                    onClick={() => router.push('/create-listing')}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Map amenities to the format expected by OfferChips
    const amenitiesWithIcons = property.amenities.map(amenity => {
        // Map amenities to icons - you can expand this based on your icons
        const iconMap: { [key: string]: string } = {
            'Pet Friendly': '/icons/petfriendly.svg',
            'Parking': '/icons/parking.svg',
            'Utilities': '/icons/utilities.svg',
            'Wi-Fi': '/icons/wifi.svg',
            'Laundry': '/icons/laundry.svg',
            'Air Conditioning': '/icons/ac.svg',
            'Furnished': '/icons/furnished.svg',
            'Heating': '/icons/heating.svg',
            'Dishwasher': '/icons/dishwasher.svg',
            'Balcony': '/icons/balcony.svg',
            'Storage': '/icons/storage.svg'
        };

        return {
            label: amenity,
            icon: iconMap[amenity] || '/icons/amenity.svg' // Default icon if no match
        };
    });

    // Create features array from property data
    const features = [
        {
            name: property.propertyType,
            icon: property.propertyType.includes('House')
                ? '/icons/house.svg'
                : property.propertyType.includes('room')
                    ? '/icons/privateroom.svg'
                    : '/icons/building1.svg'
        },
        {
            name: `${property.numberOfBedrooms} ${property.numberOfBedrooms > 1 ? 'Rooms' : 'Room'}`,
            icon: '/icons/numberofrooms.svg'
        },
        {
            name: `${property.numberOfBathrooms} ${property.numberOfBathrooms > 1 ? 'Baths' : 'Bath'}`,
            icon: '/icons/numberofbathrooms.svg'
        },
        {
            name: property.coupleFriendly ? 'Couple Friendly' : 'Single Occupancy',
            icon: '/icons/couplefriendly.svg'
        }
    ];

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const availableFrom = formatDate(property.startDate);
    const listedOn = formatDate(new Date().toISOString());
    console.log('Listed on:', listedOn);

    return (
        <div className={`${inter.className}`}>
            {/* Desktop View */}
            <div className="hidden md:block">
                <Navbar />
                <div className="bg-[#1F1F21] p-10 text-white">
                    {/* Page Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold">Review Your Listing</h1>
                        <p className="text-gray-300">Verify all details before publishing</p>
                    </div>
                
                    {/* Outer row */}
                    <div className="flex flex-col items-center space-x-6 space-y-3">
                        {/* Image container */}
                        <div className="flex space-x-4">
                            {/* Left (large) image */}
                            <div className="w-96 h-[17rem] bg-gray-300 rounded-l-3xl relative overflow-hidden">
                                {property.images && property.images.length > 0 ? (
                                    <Image
                                        src={property.images[0]}
                                        alt={`Property at ${property.location}`}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <span className="text-black text-sm flex items-center justify-center h-full">No Image Available</span>
                                )}
                            </div>

                            {/* Right (4 smaller images, 2x2) */}
                            <div className="flex flex-wrap w-[26rem] gap-4">
                                {[1, 2, 3, 4].map((index) => (
                                    <div key={index} className={`w-48 h-32 bg-gray-300 relative overflow-hidden ${index % 2 === 0 ? 'rounded-r-3xl' : ''}`}>
                                        {property.images && property.images.length > index ? (
                                            <Image
                                                src={property.images[index]}
                                                alt={`Property at ${property.location}`}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <span className="text-black text-sm flex items-center justify-center h-full">No Image</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Info container */}
                        <div className="w-[57%] mt-3">
                            <div className="flex flex-col space-y-2">
                                {/* Name & Price row */}
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">
                                        {property.location} &nbsp;&nbsp; ${property.monthlyPrice}/month
                                    </h2>
                                </div>

                                {/* Availability */}
                                <div className="text-sm mb-3">
                                    Available from: {availableFrom} for {property.leaseDuration}
                                </div>

                                {/* Features (chips) */}
                                <div className="flex flex-wrap gap-2 mb-2 mt-3">
                                    {features.map((feature, idx) => (
                                        <span
                                            key={idx}
                                            className="bg-[#353537] text-white text-xs px-4 py-2 rounded-full flex items-center gap-1"
                                        >
                                            <Image
                                                src={feature.icon}
                                                alt={`${feature.name} icon`}
                                                width={16}
                                                height={16}
                                            />
                                            {feature.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex mt-10 flex-row items-center justify-around w-full p-4">
                    {/* Left side: "Description" and "Walking distance to" */}
                    <div className="space-y-8">
                        {/* Description */}
                        <div>
                            <h2 className="font-semibold text-lg mb-2">Description:</h2>
                            <ul className="list-disc list-inside space-y-1">
                                {property.description && property.description.length > 0 ? (
                                    property.description.map((desc, idx) => (
                                        <li key={idx}>{desc}</li>
                                    ))
                                ) : (
                                    <li>No description available</li>
                                )}
                            </ul>
                        </div>

                        {/* Walking distance to */}
                        <div>
                            <h2 className="font-semibold text-lg mb-2">
                                Walking distance to:
                            </h2>
                            <ul className="list-disc list-inside space-y-1">
                                {property.walkingDistanceTo && property.walkingDistanceTo.length > 0 ? (
                                    property.walkingDistanceTo.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))
                                ) : (
                                    <li>No information available</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Right side: Action buttons */}
                    <div className="flex flex-col items-start h-60 rounded-2xl w-80 p-5 justify-center bg-[#F4F4F4] space-y-4">
                        <h3 className="font-semibold text-lg">Ready to publish?</h3>
                        <p className="text-sm text-gray-600">Your listing will be visible to thousands of people looking for a place to live.</p>
                        
                        {/* Publish button */}
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-2xl w-full"
                            onClick={handlePublish}
                            disabled={submitting}
                        >
                            {submitting ? "Publishing..." : "Publish Listing"}
                        </button>
                        
                        {/* Edit button */}
                        <button
                            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-2xl w-full"
                            onClick={handleCancel}
                        >
                            Edit Listing
                        </button>
                    </div>
                </div>

                <div className="p-6 flex px-60 flex-col space-y-6">
                    <hr className="text-[#E3E2E0] font-bold" />
                    {/* Heading */}
                    <h2 className="text-lg font-semibold">What this places offers:</h2>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2">
                        {amenitiesWithIcons.map((amenity, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 bg-gray-100 text-sm text-gray-700 rounded-full flex items-center gap-1"
                            >
                                <Image
                                    src={amenity.icon}
                                    alt={`${amenity.label} icon`}
                                    width={16}
                                    height={16}
                                />
                                {amenity.label}
                            </span>
                        ))}
                    </div>

                    {/* <hr className="border-gray-400" /> */}

                    {/* Location heading */}
                    <h2 className="text-lg font-semibold">Location:</h2>

                    {/* Map placeholder */}
                    <div className="relative w-full h-64 bg-gray-200 rounded-md overflow-hidden">
                        {/* Marker (centered) */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-6 w-6 bg-blue-500 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile View */}
            <div className={`${inter.className} bg-[#1F1F21] block md:hidden`}>
                {/* Show Card Listing */}
                <div className="bg-[#F4F4F4]">
                    <ShowListingCardReview
                        images={property.images && property.images.length > 0
                            ? property.images
                            : fallbackData.demoImages}
                    />
                </div>

                <div>
                    <div className="px-4 pt-6 pb-4 bg-[#1F1F21] text-[#FFFFFF]">
                        {/* Address & Price */}
                        <div className="flex justify-between mb-2 items-center">
                            <h2 className="font-semibold text-base">{property.location}</h2>
                            <p className="font-semibold text-base">${property.monthlyPrice}
                                <span className='text-xs font-light'>/month</span>
                            </p>
                        </div>
                        {/* Availability */}
                        <p className="mt-1 mb-5 font-normal text-xs text-white">
                            Available from:{" "}
                            <span className="text-sm font-medium">
                                {availableFrom} for {property.leaseDuration}
                            </span>
                        </p>
                        {/* Features (chips) */}
                        <div className="flex flex-wrap gap-2 mb-2 mt-3">
                            {features.map((feature, idx) => (
                                <span
                                    key={idx}
                                    className="bg-[#353537] text-white text-xs font-normal px-2 py-1 rounded-full flex items-center gap-1"
                                >
                                    <Image
                                        src={feature.icon}
                                        alt={`${feature.name} icon`}
                                        width={12}
                                        height={12}
                                        className='object-scale-down brightness-0 invert'
                                    />
                                    {feature.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 rounded-t-3xl bg-white z-10 text-[#2C3C4E]">
                        {/* Description */}
                        <div>
                            <h3 className="text-base mt-5 mb-4 font-semibold">Description:</h3>
                            <ul className="list-disc list-inside text-sm font-normal mt-1 space-y-2">
                                {property.description && property.description.length > 0 ? (
                                    property.description.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))
                                ) : (
                                    <li>No description available</li>
                                )}
                            </ul>
                        </div>

                        {/* Walking Distance */}
                        <div className="mt-4">
                            <h3 className="text-base mt-5 mb-4 font-semibold">Walking distance to:</h3>
                            <ul className="list-disc list-inside text-sm font-normal mt-1 space-y-2">
                                {property.walkingDistanceTo && property.walkingDistanceTo.length > 0 ? (
                                    property.walkingDistanceTo.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))
                                ) : (
                                    <li>No information available</li>
                                )}
                            </ul>
                        </div>
                        <hr className="mt-5 mb-4 w-[90vw]" />

                        <div className="bg-white p-2 rounded-md w-full max-w-md">
                            {/* Title */}
                            <h2 className="text-base font-semibold text-[#2C3C4E] mb-3">
                                What this places offers:
                            </h2>
                            {/* Chips Container */}
                            <OfferChips features={amenitiesWithIcons} />
                        </div>
                        <hr className="my-4" />
                    </div>
                </div>

                <div className="px-4 pb-24 border-none space-y-6 z-10 bg-white">
                    {/* Location Label */}
                    <div className="text-sm font-semibold text-[#2C3C4E]">Location</div>
                    {/* Map Placeholder */}
                    <div className="w-full h-30 bg-gray-200 flex items-center justify-center">
                        <Image
                            src={"/icons/mapimg.png"}
                            alt="map"
                            height={1000}
                            width={1000}
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Fixed action bar at bottom */}
                <div className="bg-black flex items-center justify-between py-5 z-20 fixed bottom-0 left-0 right-0 px-4">
                    
                    <button
                        className="bg-blue-600 text-white px-4 py-3 items-center rounded-3xl w-full"
                        onClick={handlePublish}
                        disabled={submitting}
                    >
                        {submitting ? "Publishing..." : "Publish"}
                    </button>
                </div>

                <SignUpModal />
                <LoginModal />
                <OnBoardingPopup />
            </div>
        </div>
    );
}