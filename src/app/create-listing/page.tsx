'use client'
import React from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import Navbar from "@/components/NavBar";
import { useRouter } from "next/navigation";
const inter = Inter({
    subsets: ["latin"],
})



// Common step data
const steps = [
    {
        step: "Step 1",
        title: "Tell us about your rental",
        description:
            "Share some basic details such as rental cost, location, and description.",
        imgSrc: "/icons/bedroomcreatelisting.png",
        imgAlt: "bedroom image",
    },
    {
        step: "Step 2",
        title: "Make it stand out",
        description: "Click some beauty shots of your space and upload them.",
        imgSrc: "/icons/plant.png",
        imgAlt: "plant image",
    },
    {
        step: "Step 3",
        title: "Publish and make it live",
        description: "Review all your details and publish the listing.",
        imgSrc: "/icons/mailbox.png",
        imgAlt: "mailbox image",
    },
];

// A reusable component for a single step. It accepts a "variant" prop so that you can
// tweak any wrapper styling based on whether it’s rendered on mobile or desktop.
const StepItem = ({
    variant,
    step,
    title,
    description,
    imgSrc,
    imgAlt,
}: {
    variant: "mobile" | "desktop";
    step: string;
    title: string;
    description: string;
    imgSrc: string;
    imgAlt: string;
}) => {
    return (
        <div className={variant === "mobile" ? "flex flex-col space-y-3 justify-center flex-1" : ""}>
            <div
                className={`bg-gray-200 px-3 py-1 rounded-full w-max text-xs font-semibold ${variant === "desktop" ? "mb-2" : ""
                    }`}
            >
                {step}
            </div>
            <div className="flex flex-row justify-between items-start">
                <div className="flex flex-col space-y-2 text-sm max-w-[65%]">
                    <span className="font-semibold">{title}</span>
                    <p className="text-xs">{description}</p>
                </div>
                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-full">
                    <Image src={imgSrc} alt={imgAlt} width={150} height={150} />
                </div>
            </div>
        </div>
    );
};



export default function CreateListing() {
    const router = useRouter();
    return (
        <>
            {/* MOBILE LAYOUT */}
            <div className={`${inter.className} block md:hidden fixed inset-0 z-50 bg-black`}>
                {/* Top Section: Black background */}
                <div className="flex flex-col bg-[#1F1F21] text-white p-5 pb-10">
                    {/* Back arrow + Title */}
                    <div className="flex items-center w-full">
                        <button onClick={() => {router.push('/home')}} className="flex items-center justify-center h-8 w-8 bg-[#353537] rounded-full">
                            <Image src="/icons/backarrow.svg" alt="Back" width={12} height={12} />
                        </button>
                        <div className="flex-1 text-center text-sm font-medium">Listing</div>
                        <div className="h-8 w-8" />
                    </div>
                    {/* Heading text */}
                    <div className="mt-6 text-4xl font-semibold w-full">
                        It&apos;s easy to publish
                        <br />
                        your listing.
                    </div>
                </div>

                {/* Bottom Section: White background, rounded top */}
                <div className="rounded-t-2xl absolute bottom-0 text-[#2C3C4E] w-full bg-white p-6 flex flex-col h-[80vh]">
                    <div className="flex flex-col space-y-6 flex-1">
                        {/* Render each step */}
                        <div className="flex flex-col justify-around flex-1 space-y-4">
                            {steps.map((item, index) => (
                                <React.Fragment key={index}>
                                    <StepItem variant="mobile" {...item} />
                                    {index < steps.length - 1 && <hr />}
                                </React.Fragment>
                            ))}
                            {/* Placeholder div */}
                            <div className="flex-1" />
                        </div>
                        {/* Get Started Button */}
                        <button onClick={() => {router.push('create-listing-steps')}} className="bg-black text-white w-full py-3 rounded-full font-semibold text-sm">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>

            {/* DESKTOP LAYOUT */}
            <Navbar />
            <div className={`${inter.className} hidden md:flex justify-center w-full bg-white`}>
                {/* Left Column: Headline + Button */}
                <div className="flex flex-col justify-center items-start p-16">
                    <h1 className="text-4xl font-semibold mb-6">
                        It&apos;s easy to publish
                        <br />
                        your listing.
                    </h1>
                    <button onClick={() => {router.push('/create-listing-steps')}} className="bg-black text-white px-6 py-3 rounded-full font-semibold text-sm">
                        Get Started
                    </button>
                </div>
                {/* Right Column: Steps */}
                <div className="flex flex-col justify-center p-16 space-y-8">
                    {steps.map((item, index) => (
                        <React.Fragment key={index}>
                            <StepItem variant="desktop" {...item} />
                            {index < steps.length - 1 && <hr />}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </>

    );
}
