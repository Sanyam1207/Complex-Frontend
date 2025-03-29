"use client";

import React from "react";
import Image from "next/image";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center">
      {/* Overlay / Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* =======================
          DESKTOP VIEW
      ======================= */}
      <div className="hidden md:block relative z-50 w-[36rem] rounded-2xl bg-white px-28 py-10 shadow-lg">
        {/* Close Button */}
        <div className="absolute top-4 right-4 border rounded-full px-2 py-1 text-gray-500 hover:text-gray-800">
          <button onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Sparkle / Star Icon (top-left) */}
        <div className="absolute top-4 left-4">
          <Image src="/icons/stars.svg" alt="Star" width={24} height={24} />
        </div>

        {/* Key Icon */}
        <div className="flex items-center justify-center mb-4 mt-6">
          {/* Replace /icons/key.png with your actual icon path */}
          <Image src="/icons/keydoorlogout.png" alt="Key Icon" width={160} height={160} />
        </div>

        {/* Heading */}
        <h2 className="text-xl font-semibold text-center text-[#2C3C4E] mb-2">
          Log out
        </h2>

        {/* Subheading */}
        <p className="text-center text-[#2C3C4E] mb-8">
          Are you sure you want to log out?
          <br />
          You can log back in at any time.
        </p>

        {/* Confirm Button */}
        <button
          onClick={onConfirm}
          className="w-full rounded-3xl bg-black py-3 text-white font-semibold hover:bg-gray-800 transition"
        >
          Yes, log out
        </button>
      </div>

      {/* =======================
          MOBILE VIEW
      ======================= */}
      <div className="block md:hidden absolute -bottom-0 z-50 w-full max-w-md mx-auto rounded-t-2xl bg-white px-6 py-8 shadow-lg">
        {/* Close Button */}
        <div className="absolute top-10 right-10 rounded-full">
          <button onClick={onClose} aria-label="Close">
            <Image src={'/icons/cancelbutton.png'} alt="cancel" height={30} width={30} />
          </button>
        </div>

        {/* Sparkle / Star Icon (top-left) */}
        <div className="absolute top-10 left-10">
          <Image src="/icons/stars.svg" alt="Star" width={35} height={35} />
        </div>

        {/* Key Icon */}
        <div className="flex items-center justify-center mt-10 mb-6">
          {/* Replace /icons/key.png with your actual icon path */}
          <Image src="/icons/keydoorlogout.png" alt="Key Icon" width={175} height={175} />
        </div>

        {/* Heading */}
        <h2 className="text-base font-medium text-center text-[#2C3C4E] mb-2">
          Log out
        </h2>

        {/* Subheading */}
        <p className="text-center font-normal text-sm text-[#2C3C4E] mb-8">
          Are you sure you want to log out?
          <br />
          You can log back in at any time.
        </p>

        {/* Confirm Button */}
        <button
          onClick={onConfirm}
          className="w-full rounded-full bg-black py-4 text-white font-semibold hover:bg-gray-800 transition"
        >
          Yes, log out
        </button>
      </div>
    </div>
  );
};

export default LogoutModal;
