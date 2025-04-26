'use client'
import Navbar from '@/components/NavBar';
import api from '@/lib/axios';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { User } from '../profile/page';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ["100", "200", "300", "400", "500", "600"] });

export default function PersonalDetails() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phoneNumber: ''
    });
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch user details
    useEffect(() => {
        const getDetails = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-details`);
                console.log(`\n\n Response from the personal-details${response.data.user}`)
                if (response.data.success) {
                    setUser(response.data.user);
                    // Initialize form data with user values
                    setFormData({
                        fullName: response.data.user.fullName || '',
                        email: response.data.user.email || '',
                        password: '',
                        phoneNumber: response.data.user.phoneNumber || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
                setError('Failed to load user details. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        getDetails();
    }, []);

    // Handle profile picture click to open file dialog
    const handleProfilePictureClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Handle profile picture change
    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        try {
            // Create a FormData object for sending both text fields and file
            const formDataToSend = new FormData();

            // Add text fields
            formDataToSend.append('fullName', formData.fullName);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phoneNumber', formData.phoneNumber);

            // Only add password if it's been changed
            if (formData.password) {
                formDataToSend.append('password', formData.password);
            }

            // Add profile image if selected
            if (profileImage) {
                console.log(profileImage)
                formDataToSend.append('profilePicture', profileImage);
                console.log(`FormData to send : ${formDataToSend}`)
            }

            console.log(formDataToSend)

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
                    setProfileImagePreview(null);
                }
                setProfileImage(null);
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

    // Handle delete account
    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                const response = await api.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/delete-account`);
                if (response.data.success) {
                    // Clear local storage
                    localStorage.removeItem('token');
                    // Redirect to login page
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error deleting account:', error);
                setError('Failed to delete account. Please try again.');
            }
        }
    };

    if (isLoading) {
        return (
            <div className={`${inter.className} flex items-center justify-center h-screen bg-black`}>
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    // If there was an error fetching the user
    if (!user && !isLoading) {
        return (
            <div className={`${inter.className} flex flex-col items-center justify-center h-screen bg-black`}>
                <div className="text-white mb-4">Error loading user profile</div>
                <button
                    onClick={() => router.push('/login')}
                    className="bg-white text-black px-4 py-2 rounded-full"
                >
                    Return to Login
                </button>
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

            {/* ==================== MOBILE VIEW (Android-style) ==================== */}
            <div className={`${inter.className} flex flex-col md:hidden bg-black h-screen w-full`}>
                {/* Top bar: Back arrow + Title */}
                <div className="flex flex-col items-center justify-center px-4 pt-6">
                    <button onClick={() => { router.back() }} className='absolute top-[18px] left-7 rounded-full bg-[#353537]'>
                        <Image
                            src="/icons/backbuttonn.svg"
                            alt="Back"
                            width={34}
                            height={34}
                            className=''
                        />
                    </button>
                    <h1 className="text-white text-sm font-medium">
                        Personal details
                    </h1>

                    <div className="relative w-24 h-24 mb-3 mt-2">
                        {/* Profile picture */}
                        <div
                            className="w-24 h-24 rounded-full flex items-center p-0 justify-center overflow-hidden cursor-pointer"
                            onClick={handleProfilePictureClick}
                        >
                            <Image
                                src={profileImagePreview ||
                                    (user?.profilePicture && user.profilePicture !== 'default-profile.jpg'
                                        ? user.profilePicture
                                        : "/icons/personaldetailplaceholder.svg")}
                                alt='profile picture'
                                height={120}
                                width={120}
                                className='h-full w-full object-cover'
                            />
                        </div>
                        {/* Small camera/plus icon circle on the bottom-right */}
                        <div
                            className="absolute flex items-center justify-center bottom-1 right-1 w-[23px] h-[23px] rounded-full bg-white cursor-pointer"
                            onClick={handleProfilePictureClick}
                        >
                            <Image
                                src="/icons/addprofilepic.svg"
                                alt="camera"
                                width={24}
                                height={24}
                                className='h-[31px] object-cover flex items-center justify-center'
                            />
                        </div>
                    </div>

                    {/* Heading under the profile picture */}
                    <p className="font-medium text-sm mb-5 text-white">
                        {profileImagePreview ? 'Change profile picture' :
                            user?.profilePicture === 'default-profile.jpg' ? 'Add your profile picture' : 'Change profile picture'}
                    </p>
                </div>

                {/* White container with rounded top corners */}
                <form onSubmit={handleSubmit} className="bg-white overflow-y-scroll h-full rounded-t-3xl p-4 flex flex-col items-center">
                    {/* Error and success messages */}
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

                    {/* Form fields */}
                    <div className="w-full mt-3">
                        {/* Full name */}
                        <label className="block mb-3 text-sm font-medium text-[#2C3C4E]">
                            Full name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            className="mb-5 bg-[#F4F4F4] text-[#2C3C4E] placeholder:text-[#727c86] font-medium placeholder:font-medium w-full rounded-lg focus:border-none focus:outline-none px-5 py-4 text-sm"
                        />

                        {/* Email */}
                        <label className="block mb-3 text-sm font-medium text-[#2C3C4E]">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            className="mb-5 bg-[#F4F4F4] text-[#2C3C4E] placeholder:text-[#727c86] font-medium placeholder:font-medium w-full rounded-lg focus:border-none focus:outline-none px-5 py-4 text-sm"
                        />

                        {/* Change password */}
                        <label className="block mb-3 text-sm font-medium text-[#2C3C4E]">
                            Change password
                        </label>
                        <input
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            type="password"
                            placeholder="Leave blank to keep current password"
                            className="mb-5 bg-[#F4F4F4] text-[#2C3C4E] placeholder:text-[#727c86] font-medium placeholder:font-medium w-full rounded-lg focus:border-none focus:outline-none px-5 py-4 text-sm"
                        />

                        {/* Phone number */}
                        <label className="block mb-3 text-sm font-medium text-[#2C3C4E]">
                            Phone number
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number"
                            className="mb-5 bg-[#F4F4F4] text-[#2C3C4E] placeholder:text-[#727c86] font-medium placeholder:font-medium w-full rounded-lg focus:border-none focus:outline-none px-5 py-4 text-sm"
                        />

                        {/* Save button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-black text-white text-sm font-medium py-3 rounded-full hover:bg-gray-900 disabled:bg-gray-500"
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>

                    {/* Delete account link */}
                    <button
                        type="button"
                        onClick={handleDeleteAccount}
                        className="mt-6 text-sm text-[#de4b4b]"
                    >
                        Delete account
                    </button>
                </form>
            </div>

            {/* ==================== DESKTOP VIEW (Updated) ==================== */}
            <div className="hidden md:block bg-black">
                <Navbar />

                <div className={`${inter.className} min-h-screen bg-white flex flex-col rounded-t-3xl items-center justify-center p-4`}>
                    {/* Error and success messages */}
                    {error && (
                        <div className="w-full max-w-xs bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="w-full max-w-xs bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            {successMessage}
                        </div>
                    )}

                    {/* Profile picture container */}
                    <div className="relative w-24 h-24">
                        {/* Profile picture */}
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
                            onClick={handleProfilePictureClick}
                        >
                            <Image
                                src={profileImagePreview ||
                                    (user?.profilePicture && user.profilePicture !== 'default-profile.jpg'
                                        ? user.profilePicture
                                        : "/icons/personaldetailplaceholder.svg")}
                                alt='profile picture'
                                height={120}
                                width={120}
                                className='h-full w-full object-cover'
                            />
                        </div>

                        {/* Small camera icon circle on top-right corner */}
                        <div
                            className="absolute top-[4.3rem] right-1 w-6 h-6 rounded-full bg-[#0A84FF] flex items-center justify-center border-2 border-white cursor-pointer"
                            onClick={handleProfilePictureClick}
                        >
                            <Image
                                src={"/icons/profile.svg"}
                                alt="camera"
                                width={12}
                                height={12}
                            />
                        </div>
                    </div>

                    {/* Heading under the profile picture */}
                    <p className="mt-3 text-lg font-medium text-black">
                        {profileImagePreview ? 'Change profile picture' :
                            user?.profilePicture === 'default-profile.jpg' ? 'Add your profile picture' : 'Change profile picture'}
                    </p>

                    {/* Form fields */}
                    <form onSubmit={handleSubmit} className="w-full max-w-xs mt-6">
                        {/* Full name */}
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            className="mb-7 bg-[#F4F4F4] w-full border rounded-md px-4 py-3 text-sm focus:outline-dashed"
                        />

                        {/* Email */}
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            className="mb-7 bg-[#F4F4F4] w-full border rounded-md px-4 py-3 text-sm focus:outline-dashed"
                        />

                        {/* Change password */}
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Change password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Leave blank to keep current password"
                            className="mb-7 bg-[#F4F4F4] w-full border rounded-md px-4 py-3 text-sm focus:outline-dashed"
                        />

                        {/* Phone number */}
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Phone number
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number"
                            className="mb-7 bg-[#F4F4F4] w-full border rounded-md px-4 py-3 text-sm focus:outline-dashed"
                        />

                        {/* Save button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-black text-white text-sm font-medium py-3 rounded-full hover:bg-gray-900 disabled:bg-gray-500"
                        >
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </form>

                    {/* Delete account link */}
                    <button
                        type="button"
                        onClick={handleDeleteAccount}
                        className="mt-6 text-sm text-[#0A84FF] hover:text-red-500"
                    >
                        Delete account
                    </button>
                </div>
            </div>
        </>
    );
}