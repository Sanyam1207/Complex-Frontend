import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PropertyCardCarousel({
    onClick,
    images,
    address,
    price,
    date,
}: {
    onClick?: () => void;
    images: string[];
    address: string;
    price: number;
    date: Date;
}) {
    const [api, setApi] = useState<CarouselApi | null>(null);
    const [current, setCurrent] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [count, setCount] = useState(0);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Ensure it only renders on the client

        if (!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    if (!isClient) return null; // Prevent SSR mismatch

    return (
        <div onClick={onClick} className="relative max-w-sm rounded-3xl overflow-hidden shadow-sm bg-[#F4F4F4]">
            {/* Heart Icon */}
            <button className="absolute top-4 right-4 flex items-center justify-center h-[2rem] w-[2rem] bg-white p-1 rounded-full shadow-md z-[1]">
                <Image alt="Favourite" src="/icons/heart.svg" width={20} height={20} />
            </button>

            <Carousel setApi={setApi} className="relative w-full">
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
                            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 
                        ${current === idx + 1 ? "bg-white w-[1.188rem]" : "bg-[#000000] opacity-30"}`}
                        />
                    ))}
                </div>
            </Carousel>



            {/* Property Info */}
            <div className="py-5 px-4">
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-[#2C3C4E] text-[0.875rem]">{address}</h2>
                    <p className="font-semibold text-[#2C3C4E] text-[0.875rem]">${price}/month</p>
                </div>
                <p className="mt-1 text-[0.75rem] text-[#2C3C4E]">{date.toLocaleDateString()}</p>
            </div>

        </div>
    );
}
