"use client";

import Navbar from "@/components/NavBar";
import api from "@/lib/axios";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "../profile/page";

const inter = Inter({
    subsets: ["latin"],
});

// Display-only FormElements component
interface FormElementsProps {
    gender: string;
    about: string;
    selectedLanguages: string[];
    languages: string[];
    user: User | null;
}

// External FormElements Component
const FormElements = ({
    gender,
    about,
    selectedLanguages,
    languages,
    user
}: FormElementsProps) => (
    <>
        {/* Gender Display */}
        <div className="mb-6">
            <label className="block mb-2 text-sm text-[#2C3C4E] font-medium">
                Gender: {gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : 'Not specified'}
            </label>
        </div>

        {/* Languages */}
        <div className="mb-6">
            <label className="block mb-3 text-sm font-medium text-[#2C3C4E]">
                Languages
            </label>
            <div className="flex flex-wrap w-full gap-2">
                {languages.map((lang) => {
                    const isSelected = selectedLanguages.includes(lang);
                    return (
                        <div
                            key={lang}
                            className={`px-3 py-1 rounded-full text-sm border ${isSelected
                                ? "bg-[#0A84FF] border-[#0A84FF] text-white"
                                : "border-[#2C3C4E] text-[#2C3C4E] opacity-40"
                                }`}
                        >
                            {lang}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* About */}
        <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-[#2C3C4E]">
                About {user?.fullName || ""}
            </label>
            <p className="w-full border-none text-[#2C3C4E] rounded-xl p-4 bg-[#F4F4F4]">
                {about || "No information provided."}
            </p>
        </div>
    </>
);

export default function CompleteProfile() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [gender, setGender] = useState("");
    const [about, setAbout] = useState("");
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [error, setError] = useState("");

    const languages = [
        "English",
        "French",
        "Hindi",
        "Gujarati",
        "Punjabi",
        "Mandarin",
        "Telugu",
    ];

    // Fetch user details
    useEffect(() => {
        const getDetails = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-details`);
                console.log("Response from API:", response.data);
                
                if (response.data.success) {
                    const userData = response.data.user;
                    setUser(userData);
                    
                    // Set values from user data
                    if (userData.gender) {
                        setGender(userData.gender);
                    }
                    
                    if (userData.about) {
                        setAbout(userData.about);
                    }
                    
                    if (userData.languages && Array.isArray(userData.languages)) {
                        setSelectedLanguages(userData.languages);
                    }
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
                setError("Failed to load user details. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        
        getDetails();
    }, []);

    if (isLoading) {
        return (
            <div className={`${inter.className} flex items-center justify-center h-screen bg-black`}>
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <>
            {/* Mobile View */}
            <div
                className={`md:hidden min-h-screen bg-black flex flex-col ${inter.className}`}
            >
                <div className="relative bg-black text-white pt-6 pb-6 px-4">
                    <button
                        type="button"
                        onClick={() => {router.push('/profile')}}
                        className="absolute top-6 left-4 text-white"
                    >
                        <Image
                            src={"/icons/backarrow.svg"}
                            alt="back icon"
                            width={20}
                            height={20}
                        />
                    </button>

                    <h1 className="text-center text-base">Profile</h1>

                    <div className="mt-4 mb-3 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full relative flex items-center justify-center overflow-hidden">
                            <Image 
                                src={user?.profilePicture && user.profilePicture !== 'default-profile.jpg' 
                                    ? user.profilePicture 
                                    : '/icons/personaldetailplaceholder.svg'} 
                                alt="profile" 
                                height={140} 
                                width={140}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <p className="mt-2 text-white text-sm">
                            {user?.fullName || "Profile"}
                        </p>
                    </div>
                </div>

                <div className="bg-white flex-1 rounded-t-3xl px-4 pt-6">
                    {error && (
                        <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}
                    
                    <FormElements 
                        gender={gender}
                        about={about}
                        selectedLanguages={selectedLanguages}
                        languages={languages}
                        user={user}
                    />
                    
                    <div className="mt-8 mb-8">
                        <button
                            onClick={() => router.push('/personal-details')}
                            className="w-full bg-black text-white py-3 rounded-full font-medium"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block bg-black">
                <Navbar />
                <div
                    className={`text-[#2C3C4E] min-h-screen w-full bg-[#F4F4F4] flex-col ${inter.className} rounded-t-3xl`}
                >
                    {/* Main Content */}
                    <div className="flex-1 max-w-2xl mx-auto w-full py-12 px-4">
                        <div className="text-start mb-8">
                            <h2 className="text-xl  font-semibold mb-2">
                                Your Profile
                            </h2>
                            <p className="">Personal Information ✨</p>

                            {error && (
                                <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4 mb-4">
                                    {error}
                                </div>
                            )}

                            <div className="mt-6 mb-2">
                                <div className="w-24 h-24 bg-gray-200 rounded-full relative flex items-center justify-center overflow-hidden">
                                    {user?.profilePicture && user.profilePicture !== 'default-profile.jpg' ? (
                                        <Image 
                                            src={user.profilePicture} 
                                            alt="profile" 
                                            width={96} 
                                            height={96}
                                            className="h-full w-full object-cover" 
                                        />
                                    ) : (
                                        <span className="text-4xl absolute top-7 right-6">😊</span>
                                    )}
                                </div>
                            </div>
                            <p className="text-black font-medium text-lg mt-2">
                                {user?.fullName || ""}
                            </p>
                        </div>

                        <FormElements 
                            gender={gender}
                            about={about}
                            selectedLanguages={selectedLanguages}
                            languages={languages}
                            user={user}
                        />
                        
                        <div className="mt-8">
                            <button
                                onClick={() => router.push('/about')}
                                className="px-8 bg-black text-white py-3 rounded-full font-medium"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}