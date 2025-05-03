'use client'
import Navbar from '@/components/NavBar';
import api from '@/lib/axios';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

// Define types
interface User {
    _id: string;
    email: string;
    fullName: string;
    profilePicture: string;
    NewListingNotification: boolean;
    MessagesNotifications: boolean;
    RemainderNotifications: boolean;
    SoldOutNotifications: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // For other properties
}

interface UserPreferences {
    NewListingNotification: boolean;
    MessagesNotifications: boolean;
    RemainderNotifications: boolean;
    SoldOutNotifications: boolean;
}

export default function Notifications() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userPreferences, setUserPreferences] = useState<UserPreferences>({
        NewListingNotification: false,
        MessagesNotifications: false,
        RemainderNotifications: false,
        SoldOutNotifications: false
    });

    // Fetch user details
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);

                // Fetch user preferences
                const userResponse = await api.get('/api/auth/get-details');

                if (userResponse.data.success) {
                    const user: User = userResponse.data.user;
                    setUserPreferences({
                        NewListingNotification: user.NewListingNotification || false,
                        MessagesNotifications: user.MessagesNotifications || false,
                        RemainderNotifications: user.RemainderNotifications || false,
                        SoldOutNotifications: user.SoldOutNotifications || false
                    });
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load preferences. Please try again later.");
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Update notification preferences
    const handleTogglePreference = async (preference: keyof UserPreferences) => {
        try {
            const updatedPreferences = {
                ...userPreferences,
                [preference]: !userPreferences[preference]
            };

            setUserPreferences(updatedPreferences);

            // Send update to backend
            await api.put('/api/auth/update-profile',
                { [preference]: updatedPreferences[preference] },
            );
        } catch (err) {
            console.error("Error updating preferences:", err);
            // Revert the toggle if update fails
            setUserPreferences({ ...userPreferences });
            alert("Failed to update preferences. Please try again.");
        }
    };

    return (
        <>
            {/* 
            =========== MOBILE VIEW =========== 
            Visible on screens smaller than md.
            */}
            <div className={`${inter.className} min-h-screen md:hidden h-full bg-[#1F1F21]`}>
                {/* Top bar */}
                <div className="bg-[#1F1F21] h-14 p-14 flex items-center justify-center relative">
                    <button onClick={() => { router.back() }} className="absolute left-6 top-10 rounded-full bg-[#353537] ">
                        <Image src={'/icons/backbuttonn.svg'} width={32} height={32} alt="back" />
                    </button>
                    <h1 className="text-white text-lg font-medium">
                        Notifications
                    </h1>
                </div>

                {/* Content area */}
                <div className="px-6 py-4 rounded-t-3xl bg-white h-screen space-y-4">
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <span className="text-gray-500">Loading preferences...</span>
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center py-8">
                            <span className="text-red-500">{error}</span>
                        </div>
                    ) : (
                        <>
                            {/* New Listings */}
                            <div className="flex items-start justify-between py-4 border-b border-gray-200">
                                <div className="flex flex-col">
                                    <span className="text-base font-medium text-[#2C3C4E]">
                                        New Listings
                                    </span>
                                    <span className="text-sm font-normal text-[#2C3C4E] mt-1">
                                        Stay updated with notifications for <br /> new listings in your recent search.
                                    </span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer ml-2">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={userPreferences.NewListingNotification}
                                        onChange={() => handleTogglePreference('NewListingNotification')}
                                    />
                                    <div className="w-10 h-5 bg-[#1F1F21] rounded-full peer 
                                    peer-focus:outline-none peer-checked:bg-[#0A84FF] 
                                    peer-checked:after:translate-x-5
                                    after:content-[''] after:absolute after:top-0.5 after:left-0.5
                                    after:bg-white 
                                    after:rounded-full after:h-4 after:w-4 after:transition-all 
                                    peer-checked:after:border-white" />
                                </label>
                            </div>

                            {/* Messages */}
                            <div className="flex items-start justify-between py-4 border-b border-gray-200">
                                <div className="flex flex-col">
                                    <span className="text-base font-medium text-[#2C3C4E]">
                                        Messages
                                    </span>
                                    <span className="text-sm text-[#2C3C4E] mt-1">
                                        Receive notifications for new messages.
                                    </span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer ml-2">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={userPreferences.MessagesNotifications}
                                        onChange={() => handleTogglePreference('MessagesNotifications')}
                                    />
                                    <div className="w-10 h-5 bg-[#1F1F21] rounded-full peer 
                                    peer-focus:outline-none peer-checked:bg-[#0A84FF] 
                                    peer-checked:after:translate-x-5
                                    after:content-[''] after:absolute after:top-0.5 after:left-0.5
                                    after:bg-white 
                                    after:rounded-full after:h-4 after:w-4 after:transition-all 
                                    peer-checked:after:border-white" />
                                </label>
                            </div>

                            {/* Reminders */}
                            <div className="flex items-start justify-between py-4 border-b border-gray-200">
                                <div className="flex flex-col">
                                    <span className="text-base font-medium text-[#2C3C4E]">
                                        Reminders
                                    </span>
                                    <span className="text-sm text-[#2C3C4E] mt-1">
                                        Receive reminders for any messages awaiting your response.
                                    </span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer ml-2">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={userPreferences.RemainderNotifications}
                                        onChange={() => handleTogglePreference('RemainderNotifications')}
                                    />
                                    <div className="w-10 h-5 bg-[#1F1F21] rounded-full peer 
                                    peer-focus:outline-none peer-checked:bg-[#0A84FF] 
                                    peer-checked:after:translate-x-5
                                    after:content-[''] after:absolute after:top-0.5 after:left-0.5
                                    after:bg-white  
                                    after:rounded-full after:h-4 after:w-4 after:transition-all 
                                    peer-checked:after:border-white" />
                                </label>
                            </div>

                            {/* Sold out */}
                            <div className="flex items-start justify-between py-4">
                                <div className="flex flex-col">
                                    <span className="text-base font-medium text-[#2C3C4E]">
                                        Sold out
                                    </span>
                                    <span className="text-sm text-[#2C3C4E] mt-1">
                                        Stay informed when a rental of your <br /> interest is unavailable.
                                    </span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer ml-2">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={userPreferences.SoldOutNotifications}
                                        onChange={() => handleTogglePreference('SoldOutNotifications')}
                                    />
                                    <div className="w-10 h-5 bg-[#1F1F21] rounded-full peer 
                                    peer-focus:outline-none peer-checked:bg-[#0A84FF] 
                                    peer-checked:after:translate-x-5
                                    after:content-[''] after:absolute after:top-0.5 after:left-0.5
                                    after:bg-white 
                                    after:rounded-full after:h-4 after:w-4 after:transition-all 
                                    peer-checked:after:border-white" />
                                </label>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* 
            =========== DESKTOP VIEW =========== 
            Visible on md screens and above.
            */}
            <div className={`${inter.className} hidden md:block bg-white min-h-screen text-black`}>
                <Navbar />
                <div className='p-14'>
                    <h1 className="text-2xl font-semibold mb-8">Notifications</h1>

                    {loading ? (
                        <div className="py-8">
                            <span className="text-gray-500">Loading preferences...</span>
                        </div>
                    ) : error ? (
                        <div className="py-8">
                            <span className="text-red-500">{error}</span>
                        </div>
                    ) : (
                        <div className="space-y-8 max-w-xl">
                            {/* Account Activity */}
                            <div>
                                <h2 className="text-lg font-medium mb-3">Account Activity</h2>
                                <p className="text-sm text-gray-700 mb-4">
                                    Stay on top of your account activity, and legal info, such as our Terms of Service.
                                </p>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-normal">Email:</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={userPreferences.NewListingNotification}
                                            onChange={() => handleTogglePreference('NewListingNotification')}
                                        />
                                        <div className="w-10 h-5 bg-gray-300 rounded-full peer 
                                            peer-focus:outline-none peer-checked:bg-[#0A84FF] 
                                            peer-checked:after:translate-x-5
                                            after:content-[''] after:absolute after:top-0.5 after:left-0.5
                                            after:bg-white after:border-gray-300 after:border 
                                            after:rounded-full after:h-4 after:w-4 after:transition-all 
                                            peer-checked:after:border-white" />
                                    </label>
                                </div>
                            </div>

                            {/* Listing activity */}
                            <div>
                                <h2 className="text-lg font-medium mb-3">Listing activity</h2>
                                <p className="text-sm text-gray-700 mb-4">
                                    Stay organized with notifications about all your Listings.
                                </p>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-normal">Email:</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={userPreferences.MessagesNotifications}
                                            onChange={() => handleTogglePreference('MessagesNotifications')}
                                        />
                                        <div className="w-10 h-5 bg-gray-300 rounded-full peer 
                                            peer-focus:outline-none peer-checked:bg-[#0A84FF] 
                                            peer-checked:after:translate-x-5
                                            after:content-[''] after:absolute after:top-0.5 after:left-0.5
                                            after:bg-white after:border-gray-300 after:border 
                                            after:rounded-full after:h-4 after:w-4 after:transition-all 
                                            peer-checked:after:border-white" />
                                    </label>
                                </div>
                            </div>

                            {/* Messages */}
                            <div>
                                <h2 className="text-lg font-medium mb-3">Messages</h2>
                                <p className="text-sm text-gray-700 mb-4">
                                    Never miss important messages about your interactions.
                                </p>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-normal">Email:</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={userPreferences.RemainderNotifications}
                                            onChange={() => handleTogglePreference('RemainderNotifications')}
                                        />
                                        <div className="w-10 h-5 bg-gray-300 rounded-full peer 
                                            peer-focus:outline-none peer-checked:bg-[#0A84FF] 
                                            peer-checked:after:translate-x-5
                                            after:content-[''] after:absolute after:top-0.5 after:left-0.5
                                            after:bg-white after:border-gray-300 after:border 
                                            after:rounded-full after:h-4 after:w-4 after:transition-all 
                                            peer-checked:after:border-white" />
                                    </label>
                                </div>
                            </div>

                            {/* Sold Out */}
                            <div>
                                <h2 className="text-lg font-medium mb-3">Sold Out</h2>
                                <p className="text-sm text-gray-700 mb-4">
                                    Stay informed when a rental of your interest is unavailable.
                                </p>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-normal">Email:</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={userPreferences.SoldOutNotifications}
                                            onChange={() => handleTogglePreference('SoldOutNotifications')}
                                        />
                                        <div className="w-10 h-5 bg-gray-300 rounded-full peer 
                                            peer-focus:outline-none peer-checked:bg-[#0A84FF] 
                                            peer-checked:after:translate-x-5
                                            after:content-[''] after:absolute after:top-0.5 after:left-0.5
                                            after:bg-white after:border-gray-300 after:border 
                                            after:rounded-full after:h-4 after:w-4 after:transition-all 
                                            peer-checked:after:border-white" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Save button */}
                    <button className="mt-8 px-7 py-3 bg-black w-72 text-white rounded-full">
                        Save
                    </button>
                </div>
            </div>
        </>
    );
}