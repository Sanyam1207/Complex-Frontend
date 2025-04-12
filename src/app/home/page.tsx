'use client';

import { Inter } from 'next/font/google';
import MobileBottomTabs from '@/components/MobileBottomTabs';
import Navbar from '@/components/NavBar';
import TabsBar from '@/components/TabsBar';
import PropertyCardCarousel from '@/components/PropertyCard';
import { useRouter } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
    const router = useRouter();
    const dummyProperties = [
        {
            images: [
                "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
                "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
                "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
                "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
            ],
            address: "265 Mainstreet, Toronto",
            price: 1200,
            date: new Date(),
        },
        {
            images: [
                "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
                "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
                "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
                "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
            ],
            address: "266 Mainstreet, Toronto",
            price: 1200,
            date: new Date(),
        },
        {
            images: [
                "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
                "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
                "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
                "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
            ],
            address: "266 Mainstreet, Toronto",
            price: 1200,
            date: new Date(),
        },
        {
            images: [
                "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
                "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
                "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
                "https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg",
            ],
            address: "266 Mainstreet, Toronto",
            price: 1200,
            date: new Date(),
        },
    ];

    return (
        <div className={`${inter.className} flex flex-col h-screen bg-[#1F1F21]`}>
            {/* Fixed header section */}
            <header className="flex-none sticky top-0 z-10">
                <Navbar />
                
            </header>

            {/* Scrollable content area */}
            <main className="flex-grow overflow-y-auto bg-[#1F1F21]  rounded-t-3xl">
            <TabsBar />
                <div className="max-w-7xl rounded-t-3xl bg-gray-100 mx-auto grid grid-cols-1 p-4 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dummyProperties.map((property, index) => (
                        <PropertyCardCarousel
                            key={index}
                            images={property.images}
                            address={property.address}
                            price={property.price}
                            date={property.date}
                            onClick={() => router.push('show-listing')}
                        />
                    ))}
                </div>
            </main>

            {/* Fixed mobile bottom tabs */}
            <footer className="flex-none sticky bottom-0">
                <MobileBottomTabs />
            </footer>
        </div>

    );
}
