"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectIsPopupOpen, closePopup } from "@/redux/slices/showPopups";
import { RootState } from "@/redux/store/store";
import Image from "next/image";

interface ProfileCreationModalProps {
  onConfirm: () => void;
}

const ProfileCreationModal: React.FC<ProfileCreationModalProps> = ({ onConfirm }) => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => selectIsPopupOpen(state, 'ProfileCreation'));

  // Handle close action
  const handleClose = () => {
    dispatch(closePopup('ProfileCreation'));
  };

  // Handle confirm action with redirection
  const router = useRouter();

  const handleConfirm = () => {
    onConfirm();
    dispatch(closePopup('ProfileCreation'));
    router.push('/complete-account');
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 z-[900] flex items-center min-w-full justify-center">
      {/* Overlay / Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-80"
        onClick={handleClose}
      />

      {/* Popup Content */}
      <div className="relative z-50 w-full max-w-md mx-auto rounded-t-3xl bg-white px-6 py-8 shadow-lg">
        {/* Close Button */}
        <div className="absolute top-4 right-4">
          <button onClick={handleClose} aria-label="Close" className="text-gray-700">
            <Image src={"/icons/closeicon.svg"} alt="close" height={27} width={27} />
          </button>
        </div>

        {/* Star Icon (top-left) */}
        <div className="absolute top-8 left-8">
          <Image alt="stars" src={"/icons/stars.svg"} height={32} width={32} />
        </div>

        {/* Profile Icon */}
        <div className="flex items-center justify-center">
          <div className="">
            <Image src={"/icons/profilecreation.svg"} alt="complete profile" height={300} width={300} />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
          Help landlords choose you!
        </h2>

        {/* Subheading */}
        <p className="text-center text-gray-600 mb-8">
          Profile help landlords find the right candidates
          <br />
          by filtering through potential renters.
        </p>

        {/* Create Profile Button */}
        <button
          onClick={handleConfirm}
          className="w-full rounded-full bg-black py-4 text-white font-semibold hover:bg-gray-800 transition"
        >
          Create Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCreationModal;