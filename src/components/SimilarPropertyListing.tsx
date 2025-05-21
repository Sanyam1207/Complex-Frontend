"use client";

import { useEffect, useState } from "react";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "./ui/carousel";
import Image from "next/image";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { openPopup } from "@/redux/slices/showPopups";
import api from "@/lib/axios";

interface SimilarPropertyListingInt {
  images: string[];
  location: string;
  price: string;
  date: string;
  propertyId: string;
  initialIsWishlisted?: boolean;
}

// Single listing card with a carousel on top and details below
const SimilarPropertyListing = ({ 
  images, 
  location, 
  price, 
  date, 
  propertyId,
  initialIsWishlisted = false
}: SimilarPropertyListingInt) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);

  const handleAddWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent triggering parent onClick

    if (localStorage.getItem('token') === null) {
      toast("Please login to use the wishlist feature", {
        icon: (
          <div className="bg-[rgba(52,178,51,1)] p-2 rounded-full items-center text-center justify-center flex">
            <img src="/icons/tick.svg" />
          </div>
        ),
        duration: 3000,
        position: "bottom-right",
        style: {
          background: "rgba(31,31,33,1)",
          color: "#fff",
        }
      });

      // Open the onboarding popup
      dispatch(openPopup('onboarding'));
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isWishlisted) {
        // Remove from wishlist
        const response = await api.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/wishlist/${propertyId}`
        );

        if (response.status === 401) {
          // Styled toast for unauthorized access
          toast("Please login to use the wishlist feature", {
            icon: (
              <div className="bg-[rgba(52,178,51,1)] p-2 rounded-full items-center text-center justify-center flex">
                <img src="/icons/tick.svg" />
              </div>
            ),
            duration: 3000,
            position: "bottom-right",
            style: {
              background: "rgba(31,31,33,1)",
              color: "#fff",
            }
          });

          // Open the onboarding popup
          dispatch(openPopup('onboarding'));
          return;
        }

        if (response.data.success) {
          setIsWishlisted(false);
          toast.success("Removed from wishlist");
        } else {
          toast.error(response.data.message || "Failed to remove from wishlist");
        }
      } else {
        // Add to wishlist
        const response = await api.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/wishlist`,
          { propertyId }
        );

        if (response.data.success) {
          setIsWishlisted(true);
          toast.success("Added to wishlist");
        } else {
          toast.error(response.data.message || "Failed to add to wishlist");
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error toggling wishlist:", error);

      // Check for 401 errors in the catch block
      if (error.response && error.response.status === 401) {
        // Styled toast for unauthorized access
        toast("Please login to use the wishlist feature", {
          icon: (
            <div className="bg-[rgba(52,178,51,1)] p-2 rounded-full items-center text-center justify-center flex">
              <img src="/icons/tick.svg" />
            </div>
          ),
          duration: 3000,
          position: "bottom-right",
          style: {
            background: "rgba(31,31,33,1)",
            color: "#fff",
          }
        });

        // Open the onboarding popup
        dispatch(openPopup('onboarding'));
      } else {
        toast.error(error.response?.data?.message || "An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only render carousel on the client to avoid SSR mismatch
    setIsClient(true);

    if (!carouselApi) return;
    setCurrentSlide(carouselApi.selectedScrollSnap());

    carouselApi.on("select", () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  if (!isClient) return null;

  return (
    <div className="relative cursor-pointer max-w-sm rounded-3xl overflow-hidden outline outline-[#F4F4F4] shadow-sm bg-white">
      {/* Top Section: Carousel */}
      <Carousel setApi={setCarouselApi} className="relative w-full">
        <CarouselContent>
          {images.map((src, idx) => (
            <CarouselItem key={idx} className="h-[16rem] w-[21.875rem]">
              <Image
                src={src}
                alt={`Slide ${idx}`}
                width={350}
                height={266}
                className="w-full h-full object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Dots Indicator - Styled like PropertyCard */}
        <div className="absolute bottom-2 left-10 transform -translate-x-1/2 flex space-x-1">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`h-1 w-1.5 rounded-full transition-all duration-300 
                ${currentSlide === idx ? "bg-white w-5" : "bg-[#000000] opacity-30 w-2"}`}
            />
          ))}
        </div>
      </Carousel>

      {/* Property Info - Styled like PropertyCard */}
      <div className="py-5 px-4">
        <div className="flex justify-between items-center">
          <h2 className="font-medium text-[#2C3C4E] text-sm">{location}</h2>
          <p className="font-medium text-[#2C3C4E] text-sm">
            {price}<span className="font-light text-xs">/month</span>
          </p>
        </div>
        <p className="mt-1 text-[0.75rem] text-[#2C3C4E] flex flex-row items-center">
          <Image
            src={'/icons/calender.svg'}
            alt="calender"
            height={12}
            width={12}
            className="mr-2"
          />
          {date}
        </p>

        {/* Heart Icon - Wishlist toggle */}
        <button
          onClick={handleAddWishlist}
          disabled={isLoading}
          className={`absolute top-4 right-4 flex items-center justify-center h-7 w-7 bg-white p-1.5 rounded-full shadow-md transition-transform ${
            isLoading ? "opacity-70" : ""
          } active:scale-95`}
        >
          {isWishlisted ? (
            // Filled heart when wishlisted
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="#FF385C"
              stroke="#FF385C"
              strokeWidth="1"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          ) : (
            // Empty heart when not wishlisted
            <Image
              alt="Add to Wishlist"
              src="/icons/heart2.svg"
              width={20}
              height={20}
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default SimilarPropertyListing;