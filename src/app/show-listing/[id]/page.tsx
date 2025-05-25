'use client'

import ForgotPasswordModal from '@/components/ForgotPassword';
import LoginModal from '@/components/LoginPopup';
import Navbar from '@/components/NavBar';
import OfferChips from '@/components/OfferChips';
import OnBoardingPopup from '@/components/OnboardingPopup';
import SignUpModal from '@/components/RegisterPopup';
import ShowListingCard from '@/components/ShowListingCard';
import SimilarPropertyListing from '@/components/SimilarPropertyListing';
import { openPopup } from '@/redux/slices/showPopups';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const inter = Inter({
  subsets: ['latin'],
})

// Property type definition
interface PropertyType {
  _id: string;
  images: string[];
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
  listedBy: {
    _id: string;
    fullName: string;
    email: string;
    profilePicture?: string;
  };
  createdAt: string;
}

// Fallback data in case API fails
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

export default function ShowListing() {
  const params = useParams();
  const propertyId = params?.id as string;
  const dispatch = useDispatch();
  const router = useRouter();

  const [property, setProperty] = useState<PropertyType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendMessage, setSendMessage] = useState<string>("Hello, is this available?");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [similarProperties, setSimilarProperties] = useState<any[]>([]);
  const [chatExists, setChatExists] = useState<boolean>(false);
  const [isListingOwner, setIsListingOwner] = useState<boolean>(false);


  // Fetch property data based on ID
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!propertyId) return;

      setLoading(true);
      try {
        // Fetch property details
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rentals/${propertyId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch property data: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success && data.data) {
          setProperty(data.data);

          // After getting property, fetch similar properties
          fetchSimilarProperties(data.data.propertyType);

          const token = localStorage.getItem('token');
          if (token) {
            const isValidToken = await checkTokenValidity(token);
            if (isValidToken && data.data.listedBy._id) {
              // Get current user details to check ownership
              try {
                const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-details`, {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });

                if (userResponse.ok) {
                  const userData = await userResponse.json();
                  // Check if current user is the listing owner
                  // Note the structure matches your getCurrentUser function
                  const currentUserId = userData.user?._id;
                  const isOwner = currentUserId === data.data.listedBy._id;

                  setIsListingOwner(isOwner);

                  // Only check for existing chat if not the owner
                  if (!isOwner) {
                    await checkExistingChat(token, data.data.listedBy._id);
                  }
                }
              } catch (userError) {
                console.error('Error fetching user details:', userError);
              }
            }
          }
        } else {
          throw new Error(data.message || 'Failed to load property details');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Error loading property:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  // Fetch similar properties
  const fetchSimilarProperties = async (propertyType: string) => {
    try {
      const encodedType = encodeURIComponent(propertyType);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rentals/type/${encodedType}?limit=2`);

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const filteredProperties = data.data.filter((p: any) => p._id !== propertyId);
          setSimilarProperties(filteredProperties.slice(0, 2)); // Take only 2
        }
      }
    } catch (err) {
      console.error('Error fetching similar properties:', err);
    }
  };


  // Add this function to check if a chat already exists
  const checkExistingChat = async (token: string, receiverId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch chats: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success && data.data) {
        // Check if any chat exists with this property owner for this property
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const existingChat = data.data.find((chat: any) => {
          return (
            chat.rentalProperty &&
            chat.rentalProperty._id === propertyId &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            chat.otherUsers.some((user: any) => user._id === receiverId)
          );
        });

        setChatExists(!!existingChat);
        return !!existingChat;
      }
      return false;
    } catch (error) {
      console.error('Error checking existing chat:', error);
      return false;
    }
  };


  // Check token validity
  const checkTokenValidity = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-details`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // Token is invalid, clear it from localStorage
        localStorage.removeItem('token');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  };

  // Handle send message button click
  // Handle send message button click
  const handleSendMessage = async () => {
    // Check for token in localStorage
    let token;

    // Need to use this approach for Next.js client components to avoid hydration issues
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token');
    }

    if (!token) {
      // No token found, show onboarding popup
      console.log("Token not found in localStorage");
      dispatch(openPopup('onboarding'));
      return;
    }

    // Validate the token
    const isValidToken = await checkTokenValidity(token);

    if (!isValidToken) {
      // Token is invalid, show onboarding popup
      dispatch(openPopup('onboarding'));
      return;
    }


    // Check if chat already exists first
    const receiverId = property?.listedBy._id;
    const chatAlreadyExists = await checkExistingChat(token, receiverId!);

    // If chat already exists, update state and return
    if (chatAlreadyExists) {
      setChatExists(true);
      return;
    }

    // Token is valid, proceed with sending the message
    try {
      // Get the property owner's ID (the person who listed the property)
      const receiverId = property?.listedBy._id

      // Create a new chat or send to existing chat
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: receiverId,
          initialMessage: sendMessage,
          rentalPropertyId: propertyId
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      toast("Message Sent Successfully", {
        icon: (
          <div className="bg-[rgba(52,178,51,1)] p-2 rounded-full items-center text-center justify-center flex">
            <img alt='tick' src="/icons/tick.svg" />
          </div>
        ),
        duration: 3000,
        position: "bottom-right",
        style: {
          background: "rgba(31,31,33,1)",
          color: "#fff",
        }
      });
      const data = await response.json();
      console.log(data)
      setChatExists(true); // Set chatExists to true after sending the message

      // Clear the message input
      setSendMessage('');

      // Optionally redirect to messages page
      // router.push('/messages');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
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
          onClick={() => window.history.back()}
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
  const listedOn = formatDate(property.createdAt);

  return (
    <div className={`${inter.className}`}>
      {/* Desktop View */}

      <div className="hidden md:block">
        <Navbar />
        <div className="bg-[#1F1F21] p-10 text-white">
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

          {/* Right side: Message-sending card */}
          <div className="flex flex-col items-start h-60 rounded-2xl w-80 p-5 justify-center bg-[#F4F4F4] space-y-4">
            {/* 1) Message label + textarea */}
            <div className="flex flex-col mt-6 space-y-2">
              <label htmlFor="message" className="text-sm font-semibold">
                Send message To {property.listedBy.fullName}
              </label>
              <textarea
                id="message"
                className="border resize-none h-16 rounded bg-[#FFFFFF] p-2 w-full"
                placeholder="Hello, is this available?"
                value={sendMessage}

                onChange={(e) => setSendMessage(e.target.value)}
              />
            </div>

            {/* 2) Send button */}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-full"
              onClick={handleSendMessage}
            >
              Send
            </button>

            {/* 3) "Hosted by" snippet */}
            <div className="flex items-center pb-5 space-x-3 text-[#2C3C4E]">
              {/* Avatar Placeholder */}
              {property.listedBy.profilePicture ? (
                <Image
                  src={property.listedBy.profilePicture}
                  alt={property.listedBy.fullName}
                  width={40}
                  height={40}
                  className="rounded-full h-10 w-10 object-cover"
                />
              ) : (
                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span>{property.listedBy.fullName.charAt(0)}</span>
                </div>
              )}
              {/* Text Section */}
              <div className="space-y-2 flex flex-col">
                <div className="text-sm font-semibold">
                  Hosted by : <span className="font-bold">{property.listedBy.fullName}</span>
                </div>
                <div className="text-xs">Listed on {listedOn}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 flex px-60 flex-col space-y-6">
          <hr className="text-[#E3E2E0] font-bold border-gray-400" />
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

          <hr className="border-gray-400" />

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

        <div className="px-80 mt-10 flex-col mb-10 ">
          <h2 className="text-xl font-bold mb-6">Similar Listings</h2>
          <div className="flex justify-between">
            {similarProperties.length > 0 ? (
              similarProperties.map((similarProperty) => (
                <SimilarPropertyListing
                  propertyId={similarProperty._id}
                  key={similarProperty._id}
                  images={similarProperty.images || fallbackData.demoImages}
                  location={similarProperty.location}
                  price={`$${similarProperty.monthlyPrice}/month`}
                  date={formatDate(similarProperty.startDate)}

                />
              ))
            ) : (
              <p>No similar listings found</p>
            )}
          </div>
        </div>
      </div>




      {/* Mobile View */}
      <div className={`${inter.className} bg-[#1F1F21] block md:hidden`}>
        {/* Show Card Listing */}
        <div className="bg-[#F4F4F4]">
          <ShowListingCard
            propertyId={property._id}
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

        <div className="px-4 border-none space-y-6 z-10 bg-white">
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
          <hr className="my-4" />
          {/* Hosted By Section */}
          <div className="flex items-center space-x-3 text-[#2C3C4E]">
            {/* Avatar Placeholder */}
            {property.listedBy.profilePicture ? (
              <Image
                src={property.listedBy.profilePicture}
                alt={property.listedBy.fullName}
                width={40}
                height={40}
                className="rounded-full h-10 w-10 object-cover"
              />
            ) : (
              <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span>{property.listedBy.fullName.charAt(0)}</span>
              </div>
            )}
            {/* Text Section */}
            <div className="flex flex-col">
              <div className="text-sm font-semibold">
                Hosted by : <span className="font-bold">{property.listedBy.fullName}</span>
              </div>
              <div className="text-xs">Listed on {listedOn}</div>
            </div>
          </div>
          <hr className="my-4" />

          {/* Similar Listings Title */}
          <div className="text-sm font-semibold text-center text-[#2C3C4E]">
            Similar Listings
          </div>

          {/* Similar Listings Row */}
          <div className="flex overflow-x-auto space-x-4 w-full">
            {similarProperties.length > 0 ? (
              similarProperties.map((similarProperty) => (
                <div
                  key={similarProperty._id}
                  className="flex-shrink-0 flex flex-row w-80 h-24 border rounded-md bg-white"
                  onClick={() => window.location.href = `/show-listing/${similarProperty._id}`}
                >
                  {/* Left side: Image */}
                  <div className="w-1/2 h-full bg-gray-200 relative">
                    {similarProperty.images && similarProperty.images.length > 0 ? (
                      <Image
                        src={similarProperty.images[0]}
                        alt="similar listing"
                        fill
                        className="object-cover rounded-md"
                      />
                    ) : (
                      <Image
                        src={"/icons/similarlisting.png"}
                        alt="similar listing"
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  {/* Right side: Address, Price, Date */}
                  <div className="w-1/2 flex flex-col bg-[#F4F4F4] justify-center p-2">
                    <div className="text-sm font-medium mb-1 text-[#2C3C4E] truncate">
                      {similarProperty.location}
                    </div>
                    <div className="text-sm text-[#2C3C4E] font-semibold">${similarProperty.monthlyPrice}</div>
                    <div className="flex items-center mt-2 space-x-1 text-sm text-gray-500">
                      <Image src={'/icons/calender.svg'} alt='calendar' height={12} width={12} />
                      <div className="text-[#2C3C4E] font-normal text-xs">
                        {new Date(similarProperty.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} / {similarProperty.leaseDuration}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center w-full py-4 text-gray-500">No similar listings found</div>
            )}
          </div>
          <br />
        </div>

        {!isListingOwner && (<div className="bg-black flex justify-center flex-col py-5 z-20 sticky bottom-0 px-4">
          <div className="text-sm text-center font-normal text-white mb-3">
            {chatExists ? (
              <span>You&apos;ve already contacted <span className='text-sm font-semibold'>{property.listedBy.fullName}</span></span>
            ) : (
              <span>Send message to <span className='text-sm font-semibold'>{property.listedBy.fullName}</span></span>
            )}
          </div>
          <div className="flex space-x-4">
            {!chatExists && (
              <input
                className="flex-1 text-sm font-semibold flex items-center bg-white text-[#2C3C4E] px-4 py-3 rounded-md"
                value={sendMessage}
                onChange={(e) => setSendMessage(e.target.value)}
                placeholder='Hello, is this available?'
              />
            )}
            <button
              className={`text-white px-5 py-3 rounded-3xl ${chatExists
                ? "bg-[#0A84FF] w-full"
                : "bg-[#0A84FF]"}`}
              onClick={() => {
                if (chatExists) {
                  // Redirect to messages page when chat exists
                  router.push("/messages");
                } else {
                  // Send message when chat doesn't exist
                  handleSendMessage();
                }
              }}
            >
              {chatExists ? "Message Sent" : "Send"}
            </button>
          </div>
        </div>)}

        {/* Mobile Bottom Navigation */}

        <SignUpModal />
        <ForgotPasswordModal />
        <LoginModal />

        <OnBoardingPopup />
      </div>
    </div>
  );
}