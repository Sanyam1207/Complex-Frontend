"use client";

import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ShowListingCardProps {
  images: string[];
}

export default function ShowListingCardReview({
  images,
}: ShowListingCardProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  
  // Add state for the image popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupImageIndex, setPopupImageIndex] = useState(0);

  useEffect(() => {
    // Only render on the client to avoid SSR mismatch
    setIsClient(true);

    if (!carouselApi) return;

    // Update current slide on init
    setCurrentSlide(carouselApi.selectedScrollSnap());

    // Listen for slide changes
    carouselApi.on("select", () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  if (!isClient) return null;

  return (
    <div className="bg-white overflow-hidden">
      {/* Top Section (Carousel) */}
      <div className="relative">
        <Carousel setApi={setCarouselApi} className="relative p-0 m-0 w-full h-full">
          <CarouselContent className="h-full m-0 p-0 w-full">
            {images.map((src, idx) => (
              <CarouselItem key={idx} className="w-full m-0 p-0 h-72">
                <div 
                  className="w-full h-full cursor-pointer"
                  onClick={() => {
                    setPopupImageIndex(idx);
                    setShowPopup(true);
                  }}
                >
                  <Image
                    src={src}
                    alt={`Slide ${idx}`}
                    width={600}
                    height={400}
                    className="w-full h-full object-fill m-0 p-0"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Dot Indicators */}
          <div className="absolute bottom-2 left-10 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1 w-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? "bg-white w-5" : "bg-[#000000] opacity-30 w-2"
                  }`}
              />
            ))}
          </div>
        </Carousel>

        {/* Heart / Favorite Icon */}
        <button onClick={() => { router.back() }} className="absolute top-4 left-4 flex items-center justify-center h-8 w-8  bg-white rounded-full shadow-sm z-[1]">
          <Image alt="Favourite" src="/icons/backbutton.svg" className="text-black" width={32} height={32} />
        </button>
      </div>

      {/* Image Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col justify-center items-center">
          {/* Header with counter and close button */}
          <div className="w-full flex justify-between items-center px-4 py-3 absolute top-0 left-0 z-50">
            <div className="text-white text-sm">
              {popupImageIndex + 1} of {images.length}
            </div>
            <button 
              onClick={() => setShowPopup(false)}
              className="flex items-center justify-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                className="h-5 w-5 text-white"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Image container */}
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src={images[popupImageIndex]}
              alt={`Full size image ${popupImageIndex}`}
              width={1000}
              height={800}
              className="object-contain max-h-screen"
            />
          </div>
          
        

          {/* Keyboard and swipe handling */}
          <div 
            className="absolute inset-0 z-0" 
            onTouchStart={(e) => {
              const touchStart = e.touches[0].clientX;
              const handleTouchEnd = (e: TouchEvent) => {
                const touchEnd = e.changedTouches[0].clientX;
                const diff = touchStart - touchEnd;
                
                // If the swipe is significant enough (more than 50px)
                if (Math.abs(diff) > 50) {
                  if (diff > 0) {
                    // Swiped left, go to next image
                    setPopupImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                  } else {
                    // Swiped right, go to previous image
                    setPopupImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                  }
                }
                
                document.removeEventListener('touchend', handleTouchEnd);
              };
              
              document.addEventListener('touchend', handleTouchEnd);
            }}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') {
                setPopupImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
              } else if (e.key === 'ArrowRight') {
                setPopupImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
              } else if (e.key === 'Escape') {
                setShowPopup(false);
              }
            }}
          />
        </div>
      )}

      {/* Bottom Section (Text, Features, etc.) */}
    </div>
  );
}