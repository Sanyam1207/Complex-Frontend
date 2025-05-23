"use client";

import Navbar from "@/components/NavBar";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const inter = Inter({
    subsets: ["latin"],
});

// Move FormElements outside the CompleteProfile component
interface FormElementsProps {
    gender: string;
    setGender: (gender: string) => void;
    about: string;
    setAbout: (about: string) => void;
    selectedLanguages: string[];
    toggleLanguage: (lang: string) => void;
    languages: string[];
}

// External FormElements Component
const FormElements = ({ 
    gender,
    setGender,
    about,
    setAbout,
    selectedLanguages,
    toggleLanguage,
    languages
}: FormElementsProps) => (
    <>
        {/* Gender Select */}
        <div className="mb-6">
            <label className="block mb-2 text-sm text-[#2C3C4E] font-medium">
                Gender
            </label>
            <div className="relative">
                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="border border-[#E3E2E0] text-[#2C3C4E] rounded-xl py-3 px-4 bg-transparent w-96 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                >
                    <option value="" disabled>
                        Select
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to disclose">
                        Prefer not to disclose
                    </option>
                </select>
            </div>
        </div>

        {/* Languages */}
        <div className="mb-6">
            <label className="block mb-3 text-sm font-medium text-[#2C3C4E]">
                Select the languages that apply
            </label>
            <div className="flex flex-wrap w-full gap-2">
                {languages.map((lang) => {
                    const isSelected = selectedLanguages.includes(lang);
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
                className="w-full border border-none placeholder:text-[rgba(44,60,78,0.50)] text-[#2C3C4E] focus-within:border-none rounded-xl p-4 bg-[#F4F4F4] focus:outline-none"
            />
        </div>

        {/* Save Button */}
        <button
            type="button"
            onClick={() => alert("Profile saved!")}
            className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-900 transition-colors"
        >
            Save
        </button>
    </>
);

export default function CompleteProfile() {
    const router = useRouter();
    const [gender, setGender] = useState("");
    const [about, setAbout] = useState("");
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

    const languages = [
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
        "Not listed",
        "Skip",
    ];

    const toggleLanguage = (lang: string) => {
        setSelectedLanguages((prev) =>
            prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
        );
    };

    return (
        <>
            {/* Mobile View */}
            <div
                className={`md:hidden h-full overflow-hidden w-screen bg-black flex flex-col ${inter.className}`}
            >
                <div className="relative bg-black text-white pt-6 pb-6 px-4">
                    <button
                        type="button"
                        onClick={() => {router.push('/home')}}
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
                        <h2 className="text-xl font-semibold">Complete your profile!</h2>
                        <p className="text-sm text-gray-400 mt-1">Stand out and Shine ✨</p>
                        <div className="w-20 h-20 rounded-full mt-4 relative flex items-center justify-center">
                           <Image src={'/icons/personaldetailplaceholder.svg'} alt="placeholder" height={180} width={180} className="object-contain"/>
                            <button 
                                type="button"
                                className="absolute right-0 bottom-0 bg-blue-500 text-white p-1 rounded-full"
                            >
                                <Image src="/icons/plusicon.svg" alt="Add" width={16} height={16} />
                            </button>
                        </div>
                        <button 
                            type="button"
                            className="mt-2 text-gray-400 text-sm"
                        >
                            Add your profile picture
                        </button>
                    </div>
                </div>

                <div className="bg-white flex-1 rounded-t-3xl px-4 pt-6">
                    <FormElements 
                        gender={gender}
                        setGender={setGender}
                        about={about}
                        setAbout={setAbout}
                        selectedLanguages={selectedLanguages}
                        toggleLanguage={toggleLanguage}
                        languages={languages}
                    />
                </div>
            </div>

            {/* Desktop View */}
            <div className="bg-black">
                <div
                    className={`hidden text-[#2C3C4E] md:flex min-h-screen w-full bg-[#F4F4F4] flex-col ${inter.className} rounded-t-3xl`}
                >
                    <Navbar />
                    {/* Main Content */}
                    <div className="flex-1 max-w-2xl mx-auto w-full py-12 px-4">
                        <div className="text-start mb-8">
                            <h2 className="text-xl  font-semibold mb-2">
                                Complete your profile!
                            </h2>
                            <p className="">Stand out and Shine ✨</p>

                            <div className="mt-6 mb-2">
                                <div className="w-24 h-24 bg-pink-100 rounded-full relative flex items-start justify-start">
                                    <span className="text-4xl absolute top-7 right-6">😊</span>
                                    <button 
                                        type="button"
                                        className="absolute right-0 bottom-0 bg-blue-500 text-white p-2 rounded-full"
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
                                className="text-gray-500 text-sm mt-2"
                            >
                                Add your profile picture
                            </button>
                        </div>

                        <FormElements 
                            gender={gender}
                            setGender={setGender}
                            about={about}
                            setAbout={setAbout}
                            selectedLanguages={selectedLanguages}
                            toggleLanguage={toggleLanguage}
                            languages={languages}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}