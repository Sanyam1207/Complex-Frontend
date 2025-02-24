"use client";

import { Inter } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function MobileBottomTabs() {
    const router = useRouter()
    return (
        <div
            className={`
        ${inter.className}
        md:hidden             /* Hide on desktop, show only on mobile */
        sticky bottom-0
        left-0 right-0
        z-50
        h-[5.875rem]          /* 78px in rem */
        w-full
        mx-auto
        bg-[#1F1F21]
        flex
        justify-around
        items-center
      `}
        >
            {/* Home */}
            <button className="flex flex-col items-center text-white space-y-1">
                <Image
                    src="/icons/Home.svg"
                    alt="Home"
                    width={25}
                    height={25}
                    className="mb-2"

                />
                <span className="text-xs">Home</span>
            </button>

            {/* Maps */}
            <button className="flex flex-col items-center text-white space-y-1">
                <Image
                    src="/icons/Maps.svg"
                    alt="Maps"
                    width={25}
                    height={25}
                    className="mb-2"

                />
                <span className="text-xs">Maps</span>
            </button>

            {/* Wishlist */}
            <button className="flex flex-col items-center text-white space-y-1">
                <Image
                    className="text-white mb-2"
                    src="/icons/Wishlist.svg"
                    alt="Wishlist"
                    width={25}
                    height={25}

                />
                <span className="text-xs">Wishlist</span>
            </button>

            {/* Messages */}
            <button className="flex flex-col items-center text-white space-y-1">
                <Image
                    src="/icons/Messages.svg"
                    alt="Messages"
                    width={25}
                    height={25}
                    className="mb-2"

                />
                <span className="text-xs">Messages</span>
            </button>

            {/* Profile */}
            <button onClick={() => {router.push("/complete-account")}} className="flex flex-col items-center justify-center text-white space-y-1">
                <Image
                    src="/icons/Profile.svg"
                    alt="Profile"
                    width={25}
                    height={25}
                    className="mb-2"
                />
                <span className="text-xs">Profile</span>
            </button>
        </div>
    );
}
