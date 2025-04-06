"use client";

import { Inter } from "next/font/google";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function MobileBottomTabs() {
    const router = useRouter();
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path;
    };

    return (
        <div
            className={`
        ${inter.className}
        md:hidden             /* Hide on desktop, show only on mobile */
        sticky
        left-0 right-0
        bottom-0
        w-full
        mx-auto
        bg-[#1F1F21]
        flex
        justify-between
        items-center
        px-7              /* x-axis padding 27px */
        py-4              /* y-axis padding 16px */
      `}
        >
            {/* Home */}
            <button onClick={() => { router.push('/home') }} className="flex flex-col items-center">
                <Image
                    src={isActive('/home') ? "/icons/Homea.svg" : "/icons/Home.svg"}
                    alt="Home"
                    width={20}
                    height={20}
                    className="mb-2"
                />
                <span className="text-white text-xs font-semibold leading-[151.688%]">Home</span>
            </button>

            {/* Maps */}
            <button onClick={() => { router.push('/maps') }} className="flex flex-col items-center">
                <Image
                    src={isActive('/maps') ? "/icons/Mapsa.svg" : "/icons/Maps.svg"}
                    alt="Maps"
                    width={20}
                    height={20}
                    className="mb-2"
                />
                <span className="text-white text-xs font-semibold leading-[151.688%]">Maps</span>
            </button>

            {/* Wishlist */}
            <button onClick={() => { router.push('/wishlist') }} className="flex flex-col items-center">
                <Image
                    src={isActive('/wishlist') ? "/icons/Wishlista.svg" : "/icons/Wishlist.svg"}
                    alt="Wishlist"
                    width={20}
                    height={20}
                    className="mb-2"
                />
                <span className="text-white text-xs font-semibold leading-[151.688%]">Wishlist</span>
            </button>

            {/* Messages */}
            <button onClick={() => { router.push('/messages') }} className="flex flex-col items-center">
                <Image
                    src={isActive('/messages') ? "/icons/Messagesa.svg" : "/icons/Messages.svg"}
                    alt="Messages"
                    width={20}
                    height={20}
                    className="mb-2"
                />
                <span className="text-white text-xs font-semibold leading-[151.688%]">Messages</span>
            </button>

            {/* Profile */}
            <button onClick={() => { router.push("/profile") }} className="flex flex-col items-center">
                <Image
                    src={isActive('/profile') ? "/icons/Profilea.svg" : "/icons/Profile.svg"}
                    alt="Profile"
                    width={20}
                    height={20}
                    className="mb-2"
                />
                <span className="text-white text-xs font-semibold leading-[151.688%]">Profile</span>
            </button>
        </div>
    );
}