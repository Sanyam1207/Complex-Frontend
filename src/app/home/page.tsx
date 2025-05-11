'use client';

import AuthCallback from '@/components/AuthCallback';
import MobileBottomTabs from '@/components/MobileBottomTabs';
import Navbar from '@/components/NavBar';
import PropertyCardCarousel from '@/components/PropertyCard';
import TabsBar from '@/components/TabsBar';
import { fetchPropertiesByCategory } from '@/redux/slices/categorySlice';
import { selectIsPopupOpen } from '@/redux/slices/showPopups';
import { RootState } from '@/redux/store/store';
import axios from 'axios';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const inter = Inter({ subsets: ['latin'] });

// Your API base URL - should come from env vars in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Define category type for type safety
type CategoryType = 'privateRoom' | 'apartments' | 'houses' | 'sharing' | 'basement';

// Define the property type map
const categoryToPropertyTypeMap: Record<CategoryType, string[]> = {
    privateRoom: ['Private room in Apartment', 'Private room in House'],
    apartments: ['Apartment / Condo'],
    houses: ['House / Townhouse'],
    sharing: ['Shared Room in House', 'Shared Room in Apartment'],
    basement: ['Basement'],
};

export default function Home() {
    const router = useRouter();
    const dispatch = useDispatch();

    const isAnyAuthPopupOpen = useSelector((state: RootState) => 
    selectIsPopupOpen(state, 'onboarding') || 
    selectIsPopupOpen(state, 'login') || 
    selectIsPopupOpen(state, 'signup'));

    // State and ref for bottom bar visibility
    const [bottomBarVisible, setBottomBarVisible] = useState(true);
    // New state for tracking if the content is docked
    const [contentDocked, setContentDocked] = useState(false);
    // New state for tracking transition position - using actual numeric value instead of boolean
    const [dockPosition, setDockPosition] = useState(0);
    // New state to store navbar height
    const [navbarHeight, setNavbarHeight] = useState(0);
    console.log('Navbar height:', navbarHeight);
    
    // Add state to track initial load
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    // State for properties filtered by location
    const [propertiesByLocation, setPropertiesByLocation] = useState([]);
    const [isLoadingLocationProperties, setIsLoadingLocationProperties] = useState(false);
    const [locationError, setLocationError] = useState(null);

    // Get location state from Redux
    const { selectedLocation } = useSelector((state: RootState) => state.location);

    const prevScrollY = useRef(0);
    const scrollableContentRef = useRef<HTMLDivElement>(null);
    const whiteContainerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    // Get category state values
    const selectedCategory = useSelector((state: RootState) => state.category.selectedCategory) as CategoryType;
    const properties = useSelector((state: RootState) => state.category.properties);
    const status = useSelector((state: RootState) => state.category.status);
    const error = useSelector((state: RootState) => state.category.error);
    const shouldRefetch = useSelector((state: RootState) => state.category.shouldRefetch);
    const isFilterModalOpen = useSelector((state: RootState) => state.filterModal.isOpen);

    // Measure header height on mount and window resize
    useEffect(() => {
        const measureHeaderHeight = () => {
            if (headerRef.current) {
                // Get the actual height of the header element
                const height = headerRef.current.offsetHeight;
                setNavbarHeight(height);
            }
        };

        // Measure initially
        measureHeaderHeight();

        // Re-measure on window resize
        window.addEventListener('resize', measureHeaderHeight);

        return () => {
            window.removeEventListener('resize', measureHeaderHeight);
        };
    }, []);

    // Calculate how far to move the content when docked
    const dockedTopPosition = -165;

    // Set up scroll event listener for the inner scrollable div
    useEffect(() => {
        const scrollableContent = scrollableContentRef.current;

        if (!scrollableContent) return;

        let isScrollingUp = false;
        let lastScrollTop = 0;

        const handleScroll = () => {
            const currentScrollY = scrollableContent.scrollTop;

            // Determine scroll direction
            isScrollingUp = currentScrollY < lastScrollTop;
            lastScrollTop = currentScrollY;

            // If we're scrolling down, hide the bottom bar and dock the content
            if (!isScrollingUp && currentScrollY > 50) {
                setBottomBarVisible(false);
                setContentDocked(true);
                setDockPosition(dockedTopPosition);
            }
            // If we're scrolling up and near the top (< 50px)
            else if (isScrollingUp && currentScrollY < 50) {
                setBottomBarVisible(true);

                // No delay - immediately start the animation
                setDockPosition(0);

                // Only change the contentDocked state after animation completes
                // This ensures the animation plays smoothly without a sudden snap
                setTimeout(() => {
                    setContentDocked(false);
                }, 300); // Match this with the transition duration
            }
            // If scrolling up but not near the top
            else if (isScrollingUp) {
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
    }, [dockedTopPosition]);

    // Initial fetch on component mount - This ensures properties are loaded on initial page load
    useEffect(() => {
        if (!initialLoadComplete) {
            // @ts-expect-error - TS might complain about dispatch type
            dispatch(fetchPropertiesByCategory(selectedCategory));
            setInitialLoadComplete(true);
        }
    }, [dispatch, selectedCategory, initialLoadComplete]);
    
    // Fetch properties by category when category changes or when filters are applied
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (shouldRefetch && !selectedLocation) {
            // Only fetch by category if no location is selected
            // @ts-expect-error - TS might complain about dispatch type
            dispatch(fetchPropertiesByCategory(selectedCategory));
        } else if (selectedLocation && (shouldRefetch || initialLoadComplete)) {
            // If location is selected and category changes, refetch with both filters
            fetchPropertiesByLocationAndCategory();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, selectedCategory, shouldRefetch, selectedLocation, initialLoadComplete]);
    
    // When location changes, fetch properties filtered by both location and category
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (selectedLocation) {
            fetchPropertiesByLocationAndCategory();
        } else {
            // Clear properties by location when location is cleared
            setPropertiesByLocation([]);
            setLocationError(null);
        }
    }, [selectedLocation]);
    
    // When category changes and we have a location filter, refetch properties
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (selectedLocation) {
            fetchPropertiesByLocationAndCategory();
        }
    }, [selectedCategory]);
    
    // Function to fetch properties by location AND category
    const fetchPropertiesByLocationAndCategory = async () => {
        if (!selectedLocation) return;
        
        setIsLoadingLocationProperties(true);
        setLocationError(null);
        
        try {
            // Get the property types for the selected category from our type-safe mapping
            const propertyTypes = categoryToPropertyTypeMap[selectedCategory] || [];
            
            console.log(`Fetching properties for location: ${selectedLocation} and category: ${selectedCategory}`);
            console.log('Property types:', propertyTypes);
            
            // Create params object with location
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const params: any = { 
                location: selectedLocation 
            };
            
            // CRITICAL: Always include property types for the current category
            // This ensures we only get properties of the correct type for this category
            if (propertyTypes.length > 0) {
                // For axios to properly send multiple values for the same parameter name
                // we need to use the propertyType[] format in the query string
                propertyTypes.forEach((type, index) => {
                    params[`propertyType[${index}]`] = type;
                });
            }
            
            console.log('Request params:', params);
            
            // Make API call to fetch properties by location AND category
            const response = await axios.get(`${API_BASE_URL}/api/rentals`, { params });
            
            console.log('API Response for location + category:', response.data);
            
            if (response.data && response.data.success) {
                console.log(`Found ${response.data.count} properties in location: ${selectedLocation} for category: ${selectedCategory}`);
                
                // Additional safety check: Filter results to ensure they match the current category's property types
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const filteredResults = response.data.data.filter((property: any) => 
                    propertyTypes.includes(property.propertyType)
                );
                
                console.log(`After filtering: ${filteredResults.length} properties match the ${selectedCategory} category`);
                
                setPropertiesByLocation(filteredResults);
                
                // If no properties found, set a user-friendly message
                if (filteredResults.length === 0) {
                    setLocationError(null);
                }
            } else {
                console.error('Failed to fetch properties by location and category');
                setLocationError(response.data?.message || 'Failed to fetch properties');
            }
        } catch (error) {
            console.error('Error fetching properties by location and category:', error);
            
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error('Response status:', error.response.status);
                    setLocationError(null);
                } else if (error.request) {
                    console.error('No response received');
                    setLocationError(null);
                } else {
                    setLocationError(null);
                }
            } else {
                setLocationError(null);
            }
        } finally {
            setIsLoadingLocationProperties(false);
        }
    };
    
    // Get display name for selected category
    const getCategoryDisplayName = (category: CategoryType): string => {
        switch(category) {
            case 'privateRoom': return 'private rooms';
            case 'apartments': return 'apartments';
            case 'houses': return 'houses';
            case 'sharing': return 'shared rooms';
            case 'basement': return 'basements';
            default: return 'properties';
        }
    };
    
    // Determine which properties to show - if location is selected, show location-filtered properties
    const displayProperties = selectedLocation ? propertiesByLocation : properties;
    const isLoading = selectedLocation ? isLoadingLocationProperties : status === 'loading';
    const displayError = selectedLocation ? locationError : error;

    return (
        <div className={`${inter.className} h-screen flex flex-col bg-[#1F1F21]`}>
            <Suspense fallback={null}>
                <AuthCallback />
            </Suspense>

            {/* Fixed header section - z-20 so it appears above the content when docked */}
            <header ref={headerRef} className="flex-none z-20">
                <Navbar />
                <TabsBar />
            </header>

            {/* Main container - takes full height */}
            <main className="flex-grow relative rounded-t-3xl bg-[#1F1F21]">
                {/* White container with rounded top corners */}
                <div
                    ref={whiteContainerRef}
                    style={{
                        top: contentDocked ? `${dockPosition}px` : 0,
                        height: contentDocked ? `calc(100% + ${-dockedTopPosition}px)` : '100%',
                        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)' // Smoother easing
                    }}
                    className={`absolute inset-x-0 bottom-0 bg-white rounded-t-3xl flex flex-col overflow-hidden
                        ${contentDocked ? 'z-20 rounded-t-3xl' : 'rounded-t-3xl'}`}
                >
                    {/* Scrollable content area */}
                    <div
                        ref={scrollableContentRef}
                        className="flex-grow overflow-y-auto pb-16 box-border"
                    >
                        {isLoading ? (
                            // Loading state
                            <div className="flex justify-center items-center p-12 h-full">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                            </div>
                        ) : (
                            <div className="max-w-7xl md:max-w-full mx-auto grid grid-cols-1 p-4 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:px-20 overflow-hidden">
                                {displayProperties && displayProperties.length > 0 ? (
                                    // Properties from API
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    displayProperties.map((property: any, index: number) => (
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
                                ) : displayError ? (
                                    // No properties found with error message
                                    <div className="col-span-full text-center py-12">
                                        <p className="text-lg font-medium">
                                            {selectedLocation ? 
                                                `No ${getCategoryDisplayName(selectedCategory)} found in ${selectedLocation}` : 
                                                "No properties found with these filters"}
                                        </p>
                                        <p className="text-gray-500">
                                            {selectedLocation ?
                                                "Try searching for a different location or changing the category" :
                                                "Try adjusting your filters or selecting a different category"}
                                        </p>
                                    </div>
                                ) : (
                                    // No properties found without error message
                                    <div className="col-span-full text-center py-12">
                                        <p className="text-lg font-medium">No properties found with these filters</p>
                                        <p className="text-gray-500">Try adjusting your filters or selecting a different category</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom tabs as overlay at the bottom of the screen */}
                <div
                    style={{
                        transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)' // Match transition timing
                    }}
                    className={`fixed bottom-0 left-0 right-0 
                        ${bottomBarVisible ? 'translate-y-0 z-0' : 'translate-y-full md:translate-y-0'} ${isFilterModalOpen ? 'z-10' : 'z-20'} ${isAnyAuthPopupOpen ? '-z-10' : 'z-20'}`}
                >
                    <MobileBottomTabs />
                </div>
            </main>
        </div>
    );
}   