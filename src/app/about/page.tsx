"use client";

import Navbar from "@/components/NavBar";
import api from "@/lib/axios";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    weight: ["100", "200", "300", "400", "500", "600"]
});

// Define types
interface User {
    fullName?: string;
    profilePicture?: string;
    gender?: string;
    aboutYou?: string;  // Changed from about to aboutYou to match backend
    languages?: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // For any other properties
}

interface ApiResponse {
    success: boolean;
    user: User;
    message?: string;
}


// Move FormElements outside the CompleteProfile component
interface FormElementsProps {
    gender: string;
    setGender: (gender: string) => void;
    about: string;
    setAbout: (about: string) => void;
    selectedLanguages: string[];
    toggleLanguage: (lang: string) => void;
    languages: string[];
    error: string;
    successMessage: string;
    handleSave: (e: React.FormEvent) => Promise<void>;
    isSubmitting: boolean;
    handleProfilePictureClick: () => void;
    profileImagePreview: string | null;
    user: User | null;
    isGenderOpen: boolean;
    setIsGenderOpen: (isOpen: boolean) => void;
}

// External FormElements Component
const FormElements = ({
    gender,
    setGender,
    about,
    setAbout,
    selectedLanguages,
    toggleLanguage,
    languages,
    error,
    successMessage,
    handleSave,
    isSubmitting,
    isGenderOpen,
    setIsGenderOpen
}: FormElementsProps) => (
    <form onSubmit={handleSave}>
        {error && (
            <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
            </div>
        )}

        {successMessage && (
            <div className="w-full bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {successMessage}
            </div>
        )}

        {/* Gender Select */}
        <div className="mb-6">
            <label className="block mb-2 text-sm text-[#2C3C4E] font-medium">
                Gender
            </label>
            <div className="relative gender-dropdown">
                <div
                    onClick={() => setIsGenderOpen(!isGenderOpen)}
                    className="w-96 bg-white p-3 rounded-lg border border-gray-300 flex justify-between items-center cursor-pointer"
                >
                    <span className="text-gray-700">
                        {gender ? (
                            gender === "male" || gender === "Male" ? "Male" :
                                gender === "female" || gender === "Female" ? "Female" :
                                    gender === "other" || gender === "Other" ? "Other" :
                                        gender === "prefer-not-to-disclose" ? "Prefer not to disclose" :
                                            "Select"
                        ) : "Select"}
                    </span>
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isGenderOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                    </svg>
                </div>

                {/* Custom dropdown menu */}
                {isGenderOpen && (
                    <div className="absolute z-10 mt-1 w-96 bg-white rounded-lg border border-gray-200 shadow-lg">
                        <div
                            className="p-3 hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                                setGender("Male");
                                setIsGenderOpen(false);
                            }}
                        >
                            Male
                        </div>
                        <div
                            className="p-3 hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                                setGender("Female");
                                setIsGenderOpen(false);
                            }}
                        >
                            Female
                        </div>
                        <div
                            className="p-3 hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                                setGender("Other");
                                setIsGenderOpen(false);
                            }}
                        >
                            Other
                        </div>
                        <div
                            className="p-3 hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                                setGender("prefer-not-to-disclose");
                                setIsGenderOpen(false);
                            }}
                        >
                            Prefer not to disclose
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Languages */}
        <div className="mb-6">
            <label className="block mb-3 text-sm font-medium text-[#2C3C4E]">
                Select the languages that apply
            </label>
            <div className="flex flex-wrap w-full gap-2">
                {languages.map((lang) => {
                    // Case-insensitive check for selected languages
                    const isSelected = selectedLanguages.some(
                        selected => selected.toLowerCase() === lang.toLowerCase()
                    );
                    return (
                        <button
                            type="button"
                            key={lang}
                            onClick={() => toggleLanguage(lang)}
                            className={`px-3 py-1 rounded-full text-sm border transition-colors ${isSelected
                                ? "bg-[#0A84FF] border-[#0A84FF] text-white"
                                : "border-[#2C3C4E] hover:bg-gray-50 text-[#2C3C4E]"
                                }`}
                        >
                            {lang}
                        </button>
                    );
                })}
                <button
                    type="button"
                    onClick={() => toggleLanguage("Skip")}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${selectedLanguages.some(lang => lang.toLowerCase() === "skip")
                        ? "bg-[#0A84FF] border-[#0A84FF] text-white"
                        : "border-[#2C3C4E] hover:bg-gray-50 text-[#2C3C4E]"
                        }`}
                >
                    Skip
                </button>
            </div>
        </div>

        {/* About */}
        <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-[#2C3C4E]">
                About you?
            </label>
            <textarea
                rows={4}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Eg: work, hobby, lifestyle, anything"
                className="w-full border border-none placeholder:text-[rgba(44,60,78,0.50)] text-[#2C3C4E] focus-within:border-none rounded-xl p-4 bg-[#F4F4F4] focus:outline"
            />
        </div>

        {/* Save Button */}
        <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-900 transition-colors disabled:bg-gray-500"
        >
            {isSubmitting ? 'Saving...' : 'Save'}
        </button>
    </form>
);


export default function CompleteProfile() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);
    const [gender, setGender] = useState<string>("");
    const [about, setAbout] = useState<string>("");
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [error, setError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isGenderOpen, setIsGenderOpen] = useState<boolean>(false);

    const languages: string[] = [
        "English",
        "French",
        "Hindi",
        "Gujarati",
        "Punjabi",
        "Mandarin",
        "Telugu",
        "Urdu",
        "Spanish",
        "Korean",
        "Russian",
        "Filipino",
        "Tamil",
        "Malayalam",
        "Not listed"
    ];

    // Click outside handler for gender dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isGenderOpen && !target.closest(".gender-dropdown")) {
                setIsGenderOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isGenderOpen]);

    // Fetch user details
    useEffect(() => {
        const getDetails = async (): Promise<void> => {
            setIsLoading(true);
            try {
                const response = await api.get<ApiResponse>(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-details`);
                console.log("Response from API:", response.data);

                if (response.data.success) {
                    const userData: User = response.data.user;
                    setUser(userData);

                    // Set values from user data
                    if (userData.gender) {
                        setGender(userData.gender);
                    }

                    if (userData.aboutYou) {
                        setAbout(userData.aboutYou);
                    }

                    // Process and preselect languages from backend
                    if (userData.languages) {
                        console.log("Languages from backend:", userData.languages);

                        let parsedLanguages: string[] = [];

                        // Handle the specific format from the backend where languages is 
                        // an array with a single string containing a JSON array
                        if (Array.isArray(userData.languages)) {
                            if (userData.languages.length === 1 &&
                                typeof userData.languages[0] === 'string' &&
                                userData.languages[0].startsWith('[')) {

                                try {
                                    // Parse the JSON string inside the array
                                    parsedLanguages = JSON.parse(userData.languages[0]);
                                } catch (e) {
                                    console.error("Error parsing languages JSON string:", e);
                                }
                            } else {
                                // It's a normal array of strings
                                parsedLanguages = userData.languages;
                            }
                        }

                        console.log("Parsed languages:", parsedLanguages);

                        if (Array.isArray(parsedLanguages)) {
                            // Make case-insensitive matching work for languages
                            const validLanguages = parsedLanguages.filter(lang => {
                                if (typeof lang !== 'string') return false;
                                return languages.some(availableLang =>
                                    availableLang.toLowerCase() === lang.toLowerCase()
                                ) || lang.toLowerCase() === "skip";
                            });

                            console.log("Valid languages to preselect:", validLanguages);
                            setSelectedLanguages(validLanguages);
                        }
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle profile picture click to open file dialog
    const handleProfilePictureClick = (): void => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Handle profile picture change
    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            // Check if file is an image
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file');
                return;
            }

            // Check file size (limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should be less than 5MB');
                return;
            }

            setProfileImage(file);

            // Create a preview URL for the image
            const previewUrl = URL.createObjectURL(file);
            setProfileImagePreview(previewUrl);

            // Clear any previous errors
            setError('');
        }
    };

    const toggleLanguage = (lang: string): void => {
        // Case-insensitive check if language is already selected
        const isSelected = selectedLanguages.some(
            selected => selected.toLowerCase() === lang.toLowerCase()
        );

        if (isSelected) {
            // Remove language (preserving case of existing entries)
            setSelectedLanguages(selectedLanguages.filter(
                item => item.toLowerCase() !== lang.toLowerCase()
            ));
        } else {
            // Add new language with original case
            setSelectedLanguages([...selectedLanguages, lang]);
        }
    };

    const handleSave = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        try {
            // Create a FormData object for sending both text fields and file
            const formDataToSend = new FormData();

            // Add form fields
            formDataToSend.append('gender', gender);
            formDataToSend.append('aboutYou', about);

            // Add languages - make sure to send in the format expected by the backend
            if (selectedLanguages && selectedLanguages.length > 0) {
                // The backend seems to expect an array with a single string containing a JSON array
                // This matches the format we received from the backend
                formDataToSend.append('languages', JSON.stringify(selectedLanguages));
                console.log("Sending languages:", JSON.stringify(selectedLanguages));
            }

            // Add profile image if selected
            if (profileImage) {
                formDataToSend.append('profilePicture', profileImage);
            }

            const response = await api.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/update-profile`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                setSuccessMessage('Profile updated successfully!');
                // Update the user state with new data
                setUser(response.data.user);

                // Clean up the object URL to avoid memory leaks
                if (profileImagePreview) {
                    URL.revokeObjectURL(profileImagePreview);
                }

                // Redirect to profile page after successful update
                setTimeout(() => {
                    router.push('/profile');
                }, 1500);
            } else {
                setError(response.data.message || 'Failed to update profile');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            setError(error.response?.data?.message || 'An error occurred while updating your profile');
            console.error('Error updating profile:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className={`${inter.className} flex items-center justify-center h-screen bg-black`}>
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <>
            {/* Hidden file input for profile picture */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleProfilePictureChange}
            />

            {/* Desktop View */}
            <div className="bg-black hidden md:block">
                <div
                    className={`hidden text-[#2C3C4E] md:flex min-h-screen w-full bg-[#F4F4F4] flex-col ${inter.className} rounded-t-3xl`}
                >
                    <Navbar />
                    {/* Main Content */}
                    <div className="flex-1 max-w-2xl mx-auto w-full py-12 px-4">
                        <div className="text-start mb-8">
                            <h2 className="text-xl font-semibold mb-2">
                                Complete your profile!
                            </h2>
                            <p className="">Stand out and Shine ✨</p>

                            {/* Profile Picture - Updated with functionality */}
                            <div className="mt-6 mb-2">
                                <div 
                                    className="w-24 h-24 bg-pink-100 rounded-full relative flex items-center justify-center overflow-visible  cursor-pointer"
                                    onClick={handleProfilePictureClick}
                                >
                                    {profileImagePreview ? (
                                        <Image
                                            src={profileImagePreview}
                                            alt="profile"
                                            width={96}
                                            height={96}
                                            className="h-full w-full object-cover rounded-full"
                                        />
                                    ) : user?.profilePicture && user.profilePicture !== 'default-profile.jpg' ? (
                                        <Image
                                            src={user.profilePicture}
                                            alt="profile"
                                            width={96}
                                            height={96}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-4xl">😊</span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleProfilePictureClick}
                                        className="absolute right-0 bottom-0 bg-blue-500 text-white p-2 rounded-full "
                                    >
                                        <Image
                                            src="/icons/plusicon.svg"
                                            alt="Add"
                                            width={16}
                                            height={16}
                                        />
                                    </button>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleProfilePictureClick}
                                className="text-gray-500 text-sm mt-2"
                            >
                                Add your profile picture
                            </button>
                        </div>

                        {/* Updated FormElements with all functionalities */}
                        <FormElements
                            gender={gender}
                            setGender={setGender}
                            about={about}
                            setAbout={setAbout}
                            selectedLanguages={selectedLanguages}
                            toggleLanguage={toggleLanguage}
                            languages={languages}
                            error={error}
                            successMessage={successMessage}
                            handleSave={handleSave}
                            isSubmitting={isSubmitting}
                            handleProfilePictureClick={handleProfilePictureClick}
                            profileImagePreview={profileImagePreview}
                            user={user}
                            isGenderOpen={isGenderOpen}
                            setIsGenderOpen={setIsGenderOpen}
                        />
                    </div>
                </div>
            </div>


            <div className={`min-h-screen md:hidden bg-black flex flex-col ${inter.className}`}>
                {/* Header */}
                <div className="relative bg-black text-white pt-6 pb-2 px-4">
                    <button
                        type="button"
                        onClick={() => { router.push('/profile') }}
                        className=""
                    >
                        <Image
                            src={"/icons/backbuttonn.svg"}
                            alt="back icon"
                            width={32}
                            height={32}
                        />
                    </button>

                    <h1 className="text-center text-sm font-medium">Profile</h1>
                </div>

                {/* Main Content */}
                <div className="px-4 pt-2 text-white">
                    <h2 className="text-xl text-center font-medium">Complete your profile!</h2>
                    <p className="text-sm text-white font-medium text-center">Stand out and Shine ✨</p>

                    {/* Profile Picture */}
                    <div className="flex flex-col items-center justify-center my-6">
                        <div className="relative w-20 h-20">
                            {/* Profile picture */}
                            <div
                                className=" rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
                                onClick={handleProfilePictureClick}
                            >
                                {profileImagePreview ? (
                                    <Image
                                        src={profileImagePreview}
                                        alt="profile"
                                        width={80}
                                        height={80}
                                        className="h-full w-full object-cover"
                                    />
                                ) : user?.profilePicture && user.profilePicture !== 'default-profile.jpg' ? (
                                    <Image
                                        src={user.profilePicture}
                                        alt="profile"
                                        width={80}
                                        height={80}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="text-pink-500 text-2xl">😊</div>
                                )}
                            </div>

                            {/* Small camera/plus icon circle on the bottom-right */}
                            <div
                                className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center  cursor-pointer"
                                onClick={handleProfilePictureClick}
                            >
                                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                        </div>
                        <button
                            onClick={handleProfilePictureClick}
                            className="text-white font-medium text-sm mt-5"
                        >
                            Add your profile picture
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSave} className="bg-white flex-1 rounded-t-3xl px-4 pt-6 pb-6">
                    {error && (
                        <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="w-full bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            {successMessage}
                        </div>
                    )}

                    {/* Gender Selection */}
                    <div className="mb-6">
                        <label className="block mb-2 text-sm text-[#2C3C4E] font-medium">
                            Gender
                        </label>
                        <div className="relative gender-dropdown">
                            <div
                                onClick={() => setIsGenderOpen(!isGenderOpen)}
                                className="w-full bg-white p-3 rounded-lg border border-gray-300 flex justify-between items-center cursor-pointer"
                            >
                                <span className="text-gray-700">
                                    {gender ? (
                                        gender === "male" || gender === "Male" ? "Male" :
                                            gender === "female" || gender === "Female" ? "Female" :
                                                gender === "other" || gender === "Other" ? "Other" :
                                                    gender === "prefer-not-to-disclose" ? "Prefer not to disclose" :
                                                        "Select"
                                    ) : "Select"}
                                </span>
                                <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isGenderOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                                </svg>
                            </div>

                            {/* Custom dropdown menu */}
                            {isGenderOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-lg">
                                    <div
                                        className="p-3 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => {
                                            setGender("Male");
                                            setIsGenderOpen(false);
                                        }}
                                    >
                                        Male
                                    </div>
                                    <div
                                        className="p-3 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => {
                                            setGender("Female");
                                            setIsGenderOpen(false);
                                        }}
                                    >
                                        Female
                                    </div>
                                    <div
                                        className="p-3 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => {
                                            setGender("Other");
                                            setIsGenderOpen(false);
                                        }}
                                    >
                                        Other
                                    </div>
                                    <div
                                        className="p-3 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => {
                                            setGender("prefer-not-to-disclose");
                                            setIsGenderOpen(false);
                                        }}
                                    >
                                        Prefer not to disclose
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Languages */}
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-[#2C3C4E]">
                            Select the languages that apply
                        </label>
                        <div className="flex flex-wrap w-full gap-2">
                            {languages.map((lang) => {
                                // Case-insensitive check for selected languages
                                const isSelected = selectedLanguages.some(
                                    selected => selected.toLowerCase() === lang.toLowerCase()
                                );

                                return (
                                    <button
                                        type="button"
                                        key={lang}
                                        onClick={() => toggleLanguage(lang)}
                                        className={`px-4 py-1.5 rounded-full text-sm border ${isSelected
                                            ? "bg-[#0A84FF] border-[#0A84FF] text-white"
                                            : "border-[#2C3C4E] bg-white text-[#2C3C4E]"
                                            }`}
                                    >
                                        {lang}
                                    </button>
                                );
                            })}
                            <button
                                type="button"
                                onClick={() => toggleLanguage("Skip")}
                                className={`px-4 py-1.5 rounded-full text-sm border ${selectedLanguages.some(lang => lang.toLowerCase() === "skip")
                                    ? "bg-[#0A84FF] border-[#0A84FF] text-white"
                                    : "border-[#2C3C4E] bg-white text-[#2C3C4E]"
                                    }`}
                            >
                                Skip
                            </button>
                        </div>
                    </div>

                    {/* About */}
                    <div className="mb-8">
                        <label className="block mb-2 text-sm font-medium text-[#2C3C4E]">
                            About you?
                        </label>
                        <textarea
                            placeholder="Eg: work, hobby, lifestyle, anything"
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            className="w-full border-gray-300 border rounded-lg p-3 min-h-24 text-sm focus:outline-none focus:border focus:border-black"
                        ></textarea>
                    </div>

                    {/* Save Button */}
                    <div className="mt-auto">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-black text-white py-3 rounded-full font-medium disabled:bg-gray-500"
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}