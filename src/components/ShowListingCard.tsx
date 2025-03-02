"use client";

import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ShowListingCardProps {
  images: string[];

}

export default function ShowListingCard({
  images,
}: ShowListingCardProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

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
    <div className=" bg-white overflow-hidden">
      {/* Top Section (Carousel) */}
      <div className="relative">
        <Carousel setApi={setCarouselApi} className="relative w-full h-64">
          <CarouselContent>
            {images.map((src, idx) => (
              <CarouselItem key={idx} className="w-full h-64">
                <Image
                  src={src}
                  alt={`Slide ${idx}`}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Dot Indicators */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${currentSlide === idx
                  ? "bg-white w-6"
                  : "bg-black/30"
                  }`}
              />
            ))}
          </div>
        </Carousel>

        {/* Heart / Favorite Icon */}
        <button className="absolute top-4 right-4 flex items-center justify-center h-8 w-8 bg-white p-1 rounded-full shadow-md z-[1]">
          <Image alt="Favourite" src="/icons/heart.svg" width={20} height={20} />
        </button>
        <button className="absolute top-4 right-16 flex items-center justify-center h-8 w-8 pr-2 bg-white p-1 rounded-full shadow-md z-[1]">
          <Image alt="Favourite" src="/icons/share.svg" width={18} height={20} />
        </button>
        <button onClick={() => {router.push('/home')}} className="absolute top-4 left-4 flex items-center justify-center h-8 w-8  bg-white p-1 rounded-full shadow-md z-[1]">
          <Image alt="Favourite" src="/icons/back.svg" className="text-black" width={20} height={20} />
        </button>
      </div>

      {/* Bottom Section (Text, Features, etc.) */}

    </div>
  );
}
