'use client';

import { Inter } from 'next/font/google';
import MobileBottomTabs from '@/components/MobileBottomTabs';
import Navbar from '@/components/NavBar';
import TabsBar from '@/components/TabsBar';
import PropertyCardCarousel from '@/components/PropertyCard';
import { useRouter } from 'next/navigation';
import AuthCallback from '@/components/AuthCallback';
import { Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPropertiesByCategory } from '@/redux/slices/categorySlice';
import { RootState } from '@/redux/store/store';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
    const router = useRouter();
    const dispatch = useDispatch();

    // Get category state values
    const selectedCategory = useSelector((state: RootState) => state.category.selectedCategory);
    const properties = useSelector((state: RootState) => state.category.properties);
    const status = useSelector((state: RootState) => state.category.status);
    const error = useSelector((state: RootState) => state.category.error);
    const shouldRefetch = useSelector((state: RootState) => state.category.shouldRefetch);

    // Fetch properties when category changes or when filters are applied
    useEffect(() => {
        if (shouldRefetch) {
            // @ts-expect-error - TS might complain about dispatch type
            dispatch(fetchPropertiesByCategory(selectedCategory));
        }
    }, [dispatch, selectedCategory, shouldRefetch]);

    // Initial fetch on component mount
    useEffect(() => {
        // @ts-expect-error - TS might complain about dispatch type
        dispatch(fetchPropertiesByCategory(selectedCategory));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fallback to dummy properties if loading fails or for development
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
    ];

    // Calculate filter count for display (optional)
    const filterState = useSelector((state: RootState) => state.filter);
    const activeFilterCount = [
        filterState.minValue.trim() !== "" ? 1 : 0,
        filterState.maxValue.trim() !== "" ? 1 : 0,
        filterState.bedrooms.trim() !== "" ? 1 : 0,
        filterState.bathrooms.trim() !== "" ? 1 : 0,
        filterState.selectedStayDuration ? 1 : 0,
        filterState.selectedFilters.length > 0 ? 1 : 0,
        filterState.selectedSort !== "price" ? 1 : 0
    ].reduce((sum, count) => sum + count, 0);
    console.log(activeFilterCount)

    return (
        <div className={`${inter.className} flex flex-col h-screen bg-[#1F1F21]`}>
            <Suspense fallback={null}>
                <AuthCallback />
            </Suspense>

            {/* Fixed header section */}
            <header className="flex-none sticky top-0 z-10">
                <Navbar />
                <TabsBar />
            </header>

            {/* Scrollable content area */}
            <main className="flex-grow overflow-y-auto bg-[#1F1F21]">

                {status === 'loading' ? (
                    // Loading state
                    <div className="flex justify-center items-center p-12 bg-gray-100 rounded-t-3xl">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <div className='min-h-full bg-white rounded-t-3xl'>

                        <div className="max-w-7xl md:max-w-full rounded-t-3xl  bg-white mx-auto grid grid-cols-1 p-4 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:px-20">
                            {properties && properties.length > 0 ? (
                                // Properties from API
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                properties.map((property: any, index: number) => (
                                    <PropertyCardCarousel
                                        propertyId={property._id}
                                        key={property._id || index}
                                        images={property.images && property.images.length > 0
                                            ? property.images
                                            : ["https://i.pinimg.com/736x/c8/42/c8/c842c87b22e9b538c8b6fe5024029f46.jpg"]}
                                        address={property.location || "No address provided"}
                                        price={property.monthlyPrice || 0}
                                        date={property.startDate ? new Date(property.startDate) : new Date()}
                                        onClick={() => router.push(`/show-listing/${property._id}`)}
                                    />
                                ))
                            ) : status === 'failed' ? (
                                // If the API call failed, use dummy properties as fallback
                                dummyProperties.map((property, index) => (
                                    <PropertyCardCarousel
                                        propertyId={"dhkfbasfasbfksd"}
                                        key={index}
                                        images={property.images}
                                        address={property.address}
                                        price={property.price}
                                        date={property.date}
                                        onClick={() => router.push('/show-listing')}
                                    />
                                ))
                            ) : (
                                // No properties found
                                <div className="col-span-full text-center py-12">
                                    <p className="text-lg font-medium">No properties found with these filters</p>
                                    <p className="text-gray-500">Try adjusting your filters or selecting a different category</p>
                                </div>
                            )}

                            {status === 'failed' && error && (
                                <div className="col-span-full text-center py-4">
                                    <p className="text-sm text-red-500">Error: {error}</p>
                                </div>
                            )}
                        </div>
                    </div>

                )}
            </main>

            {/* Fixed mobile bottom tabs */}
            <footer className="flex-none sticky bottom-0">
                <MobileBottomTabs />
            </footer>
        </div>
    );
}