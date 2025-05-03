'use client';

import { Inter } from 'next/font/google';
import MobileBottomTabs from '@/components/MobileBottomTabs';
import Navbar from '@/components/NavBar';
import TabsBar from '@/components/TabsBar';
import PropertyCardCarousel from '@/components/PropertyCard';
import { useRouter } from 'next/navigation';
import AuthCallback from '@/components/AuthCallback';
import { Suspense, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPropertiesByCategory } from '@/redux/slices/categorySlice';
import { RootState } from '@/redux/store/store';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
    const router = useRouter();
    const dispatch = useDispatch();
    
    // State and ref for bottom bar visibility
    const [bottomBarVisible, setBottomBarVisible] = useState(true);
    const prevScrollY = useRef(0);
    const scrollableContentRef = useRef<HTMLDivElement>(null);
    
    // Set up scroll event listener for the inner scrollable div
    useEffect(() => {
        const scrollableContent = scrollableContentRef.current;
        
        if (!scrollableContent) return;
        
        const handleScroll = () => {
            const currentScrollY = scrollableContent.scrollTop;
            
            // If we're scrolling down, hide the bottom bar
            // If we're scrolling up, show the bottom bar
            if (currentScrollY > prevScrollY.current && currentScrollY > 20) {
                setBottomBarVisible(false);
            } else if (currentScrollY < prevScrollY.current) {
                setBottomBarVisible(true);
            }
            
            // Update previous scroll position
            prevScrollY.current = currentScrollY > 0 ? currentScrollY : 0;
        };
        
        // Add scroll event listener to the scrollable content
        scrollableContent.addEventListener('scroll', handleScroll, { passive: true });
        
        // Clean up event listener
        return () => {
            if (scrollableContent) {
                scrollableContent.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

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
        <div className={`${inter.className} h-screen flex flex-col bg-[#1F1F21]`}>
            <Suspense fallback={null}>
                <AuthCallback />
            </Suspense>

            {/* Fixed header section */}
            <header className="flex-none z-20">
                <Navbar />
                <TabsBar />
            </header>

            {/* Main container - takes full height */}
            <main className="flex-grow relative bg-[#1F1F21]">
                {/* White container with rounded top corners */}
                <div className="absolute inset-0 bg-white rounded-t-3xl flex flex-col">
                    {/* Scrollable content area */}
                    <div 
                        ref={scrollableContentRef}
                        className="flex-grow overflow-y-auto pb-16"
                    >
                        {status === 'loading' ? (
                            // Loading state
                            <div className="flex justify-center items-center p-12 h-full">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                            </div>
                        ) : (
                            <div className="max-w-7xl md:max-w-full mx-auto grid grid-cols-1 p-4 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:px-20">
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
                        )}
                    </div>
                </div>
                
                {/* Bottom tabs as overlay at the bottom of the screen */}
                <div 
                    className={`fixed bottom-0 left-0 right-0 z-10 transition-transform duration-300 ease-in-out ${
                        bottomBarVisible ? 'translate-y-0' : 'translate-y-full md:translate-y-0'
                    }`}
                >
                    <MobileBottomTabs />
                </div>
            </main>
        </div>
    );
}