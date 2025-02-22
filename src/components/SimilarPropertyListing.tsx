"use client";

import { useEffect, useState } from "react";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "./ui/carousel";
import Image from "next/image";

interface SimilarPropertyListingInt {
  images: string[];
  location: string;
  price: string;
  date: string;
}

// Single listing card with a carousel on top and details below
const SimilarPropertyListing = ({ images, location, price, date }: SimilarPropertyListingInt) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);

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
    <div className="bg-white rounded-3xl shadow-sm w-96 h-auto">
      {/* Top Section: Carousel */}
      <div className="relative w-full">
        <Carousel setApi={setCarouselApi} className="relative w-full">
          <CarouselContent>
            {images.map((src, idx) => (
              <CarouselItem key={idx} className="w-full">
                <Image
                  src={src}
                  alt={`Slide ${idx}`}
                  width={600}
                  height={400}
                  className="w-full rounded-3xl h-auto object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Dot Indicators */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? "bg-white w-6" : "bg-black/30"
                }`}
              />
            ))}
          </div>
        </Carousel>

        {/* Favorite / Share Icons (Back button removed) */}
        <button className="absolute top-4 right-4 flex items-center justify-center h-8 w-8 bg-white p-1 rounded-full shadow-md z-20">
          <Image alt="Favourite" src="/icons/heart.svg" width={20} height={20} />
        </button>
        <button className="absolute top-4 right-14 flex items-center justify-center h-8 w-8 bg-white p-1 rounded-full shadow-md z-20">
          <Image alt="Share" src="/icons/share.svg" width={18} height={20} />
        </button>
      </div>

      {/* Bottom Section: Details */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{location}</h3>
          <p className="text-sm font-semibold">{price}</p>
        </div>
        <p className="text-xs text-gray-600 mt-2">{date}</p>
      </div>
    </div>
  );
};

export default SimilarPropertyListing;
