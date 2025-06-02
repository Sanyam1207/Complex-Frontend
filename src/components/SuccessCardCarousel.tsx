import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";

interface SuccessCardCarouselProps {
    onClick?: () => void;
    images: string[];
    address: string;
    price: number;
    date: Date;
    propertyId?: string;
    initialIsWishlisted?: boolean;
}

export default function SuccessCardCarousel({
    onClick,
    images,
    address,
    price,
    date,
}: SuccessCardCarouselProps) {
    const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
    const [current, setCurrent] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [count, setCount] = useState(0);
    const [isClient, setIsClient] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsClient(true); // Ensure it only renders on the client

        if (!carouselApi) return;

        setCount(carouselApi.scrollSnapList().length);
        setCurrent(carouselApi.selectedScrollSnap() + 1);

        carouselApi.on("select", () => {
            setCurrent(carouselApi.selectedScrollSnap() + 1);
        });
    }, [carouselApi]);

    if (!isClient) return null; // Prevent SSR mismatch

    return (
        <div onClick={onClick} className="relative cursor-pointer max-w-sm rounded-3xl overflow-hidden outline outline-[#F4F4F4] shadow-sm bg-white">
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
                {/* Dots Indicator */}
                <div className="absolute bottom-2 left-10 transform -translate-x-1/2 flex space-x-1">
                    {images.map((_, idx) => (
                        <span
                            key={idx}
                            className={`h-1 w-1.5 rounded-full transition-all duration-300 
                            ${current === idx + 1 ? "bg-white w-5" : "bg-[#000000] opacity-30 w-2"}`}
                        />
                    ))}
                </div>
            </Carousel>

            {/* Property Info */}
            <div className="py-5 px-4">
                <div className="flex justify-between items-center">
                    <h2 className="font-medium text-[#2C3C4E] text-sm">{address}</h2>
                    <p className="font-medium text-[#2C3C4E] text-sm">
                        ${price}<span className="font-light text-xs">/month</span>
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
                    {new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </p>
            </div>
        </div>
    );
}