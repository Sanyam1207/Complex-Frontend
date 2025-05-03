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
        fkajfbaksfbsakfbakjsbfdksf
        <Carousel setApi={setCarouselApi} className="relative w-full h-72">
          <CarouselContent>
            {images.map((src, idx) => (
              <CarouselItem key={idx} className="w-full h-full">
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

      {/* Bottom Section (Text, Features, etc.) */}

    </div>
  );
}
