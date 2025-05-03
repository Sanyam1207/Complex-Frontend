"use client";

import React, { JSX, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Inter } from "next/font/google";
import api from '@/lib/axios';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

interface UserProfile {
  _id: string;
  fullName: string;
  profilePicture?: string;
  gender?: string;
  languages?: string[];
  aboutYou?: string;
}

export default function ShowProfile(): JSX.Element {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [parsedLanguages, setParsedLanguages] = useState<string[]>([]);

  useEffect(() => {
    async function fetchUserProfile(): Promise<void> {
      try {
        setLoading(true);
        // Make API call to get user profile by ID
        const response = await api.get(`/api/auth/profile-details/${userId}`);
        
        if (response.data.success) {
          // Store the user profile in state
          setUserProfile(response.data.user);
          
          // Handle the specific format from your API
          let languagesArray: string[] = [];
          
          if (response.data.user.languages && response.data.user.languages.length > 0) {
            // Get the first (and only) element of the array which contains the JSON string
            const languagesString = response.data.user.languages[0];
            
            // Try to parse the JSON string into an array
            try {
              if (typeof languagesString === 'string' && languagesString.includes('[')) {
                // This handles the format from your API: "[\"Mandarin\",\"Telugu\",\"Korean\"]"
                languagesArray = JSON.parse(languagesString);
              } else {
                // If it's a regular string, just use it as a single item
                languagesArray = [languagesString];
              }
            } catch (e) {
              console.error("Error parsing languages:", e);
              languagesArray = [languagesString];
            }
          }
          
          setParsedLanguages(languagesArray);
        } else {
          setError('Failed to load user profile');
        }
      } catch (err) {
        setError('Error fetching user profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#1C1C1C]">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#1C1C1C] text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Could not load profile</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-[#353537] rounded-full"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen bg-[#1C1C1C] ${inter.className}`}>
      {/* Header */}
      <header className="bg-[#1C1C1C] px-4 pt-4 pb-2 flex flex-col">
        <div className='flex justify-between items-center'>
          <button onClick={() => router.back()} className="p-1">
            <Image
              src="/icons/backbuttonn.svg"
              alt="Back"
              width={24}
              height={24}
            />
          </button>
          <h1 className="text-white text-base font-medium">
            {userProfile.fullName}
          </h1>
          <button
            className="rounded-full bg-[#0A84FF] text-white px-4 py-1.5 text-sm"
          >
            unmute
          </button>
        </div>
      </header>

      {/* Profile Picture - In its own section */}
      <div className="flex justify-center py-5 bg-[#1C1C1C]">
        <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center overflow-hidden">
          {userProfile.profilePicture ? (
            <Image
              src={userProfile.profilePicture}
              alt={userProfile.fullName}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-pink-100 flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="18" r="4" fill="#1F0287" />
                <circle cx="18" cy="18" r="2" fill="#1F0287" />
                <circle cx="30" cy="18" r="2" fill="#1F0287" />
                <path d="M16 26C19.3333 30.6667 28.6667 30.6667 32 26" stroke="#1F0287" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <main className="flex-grow bg-white rounded-t-3xl overflow-y-auto">
        {/* Profile Details */}
        <div className="px-6 py-5">
          {/* Gender - with divider */}
          <div className="border-b border-gray-100 pb-5">
            <p className="text-[#2C3C4E] text-base">
              <span className="font-medium">Gender:</span> {userProfile.gender}
            </p>
          </div>

          {/* Languages */}
          <div className="py-5 border-b border-gray-100">
            <p className="text-[#2C3C4E] text-base mb-3">
              Languages:
            </p>
            <div className="flex flex-wrap gap-2">
              {parsedLanguages.length > 0 ? (
                parsedLanguages.map((language, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 border border-gray-300 rounded-full text-sm text-[#2C3C4E]"
                  >
                    {language}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No languages specified</span>
              )}
            </div>
          </div>

          {/* About */}
          <div className="pt-5">
            <p className="text-[#2C3C4E] text-base font-medium mb-3">
              About {userProfile.fullName}:
            </p>
            <p className="text-[#2C3C4E] text-base leading-relaxed">
              {userProfile.aboutYou}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}