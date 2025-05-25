"use client";

import React from "react";
import Image from "next/image";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
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

        {/* 3D X Icon (Centered) */}
        <div className="flex items-center justify-center mb-4 mt-6">
          {/* Replace /icons/3dX.png with your actual icon path */}
          <Image src="/icons/deleteaccount.svg" alt="Delete Account Icon" width={140} height={140} />
        </div>

        {/* Heading */}
        <h2 className="text-xl font-semibold text-center text-[#2C3C4E] mb-2">
          Delete account
        </h2>

        {/* Subheading */}
        <p className="text-center text-[#2C3C4E] mb-8">
          Are you sure you want to delete your account?
          <br />
          This action cannot be undone and will erase all your data.
        </p>

        {/* Confirm Button */}
        <button
          onClick={onConfirm}
          className="w-full rounded-3xl bg-black py-3 text-white font-semibold hover:bg-gray-800 transition"
        >
          Yes, delete account
        </button>
      </div>

      {/* =======================
          MOBILE VIEW
      ======================= */}
      <div className="block md:hidden absolute bottom-0 z-50 w-full max-w-md mx-auto rounded-t-2xl bg-white px-6 py-8 shadow-lg">
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

        {/* 3D X Icon (Centered) */}
        <div className="flex items-center justify-center mt-10 mb-6">
          {/* Replace /icons/3dX.png with your actual icon path */}
          <Image src="/icons/deleteaccount.svg" alt="Delete Account Icon" width={134} height={134} />
        </div>

        {/* Heading */}
        <h2 className="text-xl font-semibold text-center text-[#2C3C4E] mb-2">
          Delete account
        </h2>

        {/* Subheading */}
        <p className="text-center text-sm text-[rgba(44,60,78,0.80)] mb-8">
          Are you sure you want to delete your account?
          <br />
          This action cannot be undone <br /> and will erase all your data.
        </p>

        {/* Confirm Button */}
        <button
          onClick={onConfirm}
          className="w-full rounded-3xl bg-black py-3 text-white font-semibold hover:bg-gray-800 transition"
        >
          Yes, delete account
        </button>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
