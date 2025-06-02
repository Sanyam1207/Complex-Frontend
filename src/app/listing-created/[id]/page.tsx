'use client'

import ForgotPasswordModal from '@/components/ForgotPassword';
import LoginModal from '@/components/LoginPopup';
import Navbar from '@/components/NavBar';
import OnBoardingPopup from '@/components/OnboardingPopup';
import SignUpModal from '@/components/RegisterPopup';
import SuccessCardCarousel from '@/components/SuccessCardCarousel';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

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

export default function ReviewListing() {
    const router = useRouter();
    const params = useParams();
    const { id } = params || {};

    const [property, setProperty] = useState<PropertyType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [userInfo, setUserInfo] = useState({ _id: '', fullName: '', profilePicture: '', createdAt: new Date().toISOString() });
    console.log(userInfo)

    // Load user info from localStorage
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setUserInfo(user);
            } catch (e) {
                console.error('Error parsing user info:', e);
            }
        }
    }, []);

    // Fetch property data from API based on dynamic route ID
    useEffect(() => {
        if (!id) {
            router.push('/home');
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rentals/${id}`);
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`API request failed (${response.status}): ${errorText}`);
                }
                const result = await response.json();
                if (result.success && result.data) {
                    setProperty(result.data as PropertyType);
                } else {
                    throw new Error(result.message || 'Failed to fetch listing data');
                }
            } catch (err) {
                console.error('Error fetching listing data:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch listing data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, router]);

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


    // Handle copying link to clipboard and showing toast
    const handleShare = () => {
        const shareLink = `/show-listing/${id}`;
        navigator.clipboard.writeText(shareLink)
            .then(() => {
                toast.success('Link copied to clipboard');
            })
            .catch(() => {
                toast.error('Failed to copy link');
            });
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
                    onClick={() => router.push('/home')}
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
                <div className='w-full bg-[#1F1F21] flex flex-col'>
                    {/* Header with back button and title */}
                    <div className='flex items-center justify-between p-4 pb-6'>
                        <div onClick={() => {
                            router.push('/profile')
                        }} className='w-7 h-7 flex items-center justify-center'>
                            <Image alt="Favourite" src="/icons/backbuttonn.svg" className="text-black" width={32} height={32} />
                        </div>
                        <h2 className={`text-white font-medium text-sm ${inter.className}`}>Listing</h2>
                        <div className='w-8 h-8'></div> {/* Spacer for centering */}
                    </div>

                    {/* Main content */}
                    <div className='px-4 flex-1 space-y-1 pb-5'>
                        <h1 className='text-white font-medium text-xl'>Congratulations 🎉</h1>
                        <p className='text-white text-sm'>Your listing is live!</p>
                    </div>
                </div>

                <div className="bg-[#FFF] rounded-t-3xl p-6 h-full flex flex-col">
                    <SuccessCardCarousel address={property.location} date={new Date(property.startDate)} images={property.images} price={property.monthlyPrice} propertyId={''} onClick={() => { }} />

                    <div className={`mt-8 ${inter.className}`}>
                        <h2 className="text-sm font-medium text-[#2C3C4E] mb-4">What&apos;s next?</h2>

                        <ol className="space-y-3 list-disc mb-6">
                            <li className="flex list-disc items-start">
                                <span className="text-[#2C3C4E] font-normal text-xs">Keep an eye on your inbox to receive messages.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#2C3C4E] font-normal text-xs">Select the best tenants using the filter option.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#2C3C4E] font-normal text-xs">Boost your listing&apos;s visibility by sharing on social media.</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#2C3C4E] font-normal text-xs">
                                    Want to add another listing?{' '}
                                    <a href="/create-listing" className="text-blue-500 hover:text-blue-600 underline">
                                        Create listing
                                    </a>
                                </span>
                            </li>
                        </ol>

                        <div className="flex gap-4 items-center justify-around  ">
                            <button onClick={() => handleShare()} className="bg-[#0A84FF] hover:bg-blue-600 text-white px-8 py-3 rounded-full font-medium text-sm transition-colors">
                                Share listing
                            </button>
                            <button onClick={() => router.push("/home")} className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full text-sm font-medium transition-colors">
                                Home
                            </button>
                        </div>
                    </div>
                </div>

                <SignUpModal />
                <ForgotPasswordModal />
                <LoginModal />
                <OnBoardingPopup />
            </div>
        </div>
    );
}
