// components/PropertyFeatures.tsx
import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import toast from 'react-hot-toast';

// Custom dropdown component
const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  className = ""
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    // Handle continue with validation


    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Find the selected option's label
  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className="
          bg-white 
          border 
          border-gray-200 
          rounded-lg 
          p-4 
          text-xs 
          font-medium 
          text-gray-700 
          cursor-pointer 
          flex 
          justify-between 
          items-center
        "
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption?.label || placeholder}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-gray-500"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {isOpen && (
        <div className="
          absolute 
          z-10 
          mt-1 
          w-full 
          bg-white 
          border 
          border-gray-200 
          rounded-lg 
        
          max-h-60 
          overflow-auto
        ">
          {options.map((option) => (
            <div
              key={option.value}
              className="
                p-3 
                hover:bg-gray-100 
                cursor-pointer 
                text-xs 
                font-medium
              "
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface PropertyFeaturesProps {
  bedrooms: string;
  setBedrooms: (value: string) => void;
  bathrooms: string;
  setBathrooms: (value: string) => void;
  isCoupleFriendly: boolean;
  setIsCoupleFriendly: (value: boolean) => void;
  selectedAmenities: string[];
  handleAmenityToggle: (amenity: string) => void;
  availableAmenities: { title: string; icon: string }[];
  setActiveStep: (step: number) => void;
}

const PropertyFeatures: React.FC<PropertyFeaturesProps> = ({
  bedrooms,
  setBedrooms,
  bathrooms,
  setBathrooms,
  isCoupleFriendly,
  setIsCoupleFriendly,
  selectedAmenities,
  handleAmenityToggle,
  availableAmenities,
  setActiveStep
}) => {
  // Bedroom options

  const handleContinue = () => {
    if (!bedrooms) {
      toast("Please select number of bedrooms", {
        icon: (
          <div className="bg-[rgba(220,38,38,1)] p-2 rounded-full items-center text-center justify-center flex">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        ),
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "rgba(31,31,33,1)",
          color: "#fff",
        }
      });
      return;
    }

    if (!bathrooms) {
      toast("Please select number of bathrooms", {
        icon: (
          <div className="bg-[rgba(220,38,38,1)] p-2 rounded-full items-center text-center justify-center flex">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        ),
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "rgba(31,31,33,1)",
          color: "#fff",
        }
      });
      return;
    }

    // If validation passes, proceed to next step
    setActiveStep(5);
  };

  const bedroomOptions = [
    { value: '1', label: '1 Bedroom' },
    { value: '2', label: '2 Bedrooms' },
    { value: '3', label: '3 Bedrooms' },
    { value: '4', label: '4 Bedrooms' },
    { value: '5', label: '5 Bedrooms' },
  ];

  // Bathroom options
  const bathroomOptions = [
    { value: '1', label: '1 Bathroom' },
    { value: '2', label: '2 Bathrooms' },
    { value: '3', label: '3 Bathrooms' },
    { value: '4', label: '4 Bathrooms' },
    { value: '5', label: '5 Bathrooms' },
  ];

  return (
    <div className="bg-white rounded-t-[2rem] h-full overflow-y-auto">
      <div className="p-6 max-w-md mx-auto w-full flex flex-col space-y-4">
        {/* 1) First Div: Title + Dropdowns */}
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-sm text-[#2C3C4E] font-medium">
              Total number of beds + baths in your house?
            </h2>
          </div>
          <div className="flex flex-row space-x-2">
            {/* Bedrooms Dropdown */}
            <CustomDropdown
              options={bedroomOptions}
              value={bedrooms}
              onChange={(value) => setBedrooms(value)}
              placeholder="Bedrooms"
              className="flex-1"
            />

            {/* Bathrooms Dropdown */}
            <CustomDropdown
              options={bathroomOptions}
              value={bathrooms}
              onChange={(value) => setBathrooms(value)}
              placeholder="Bathrooms"
              className="flex-1"
            />
          </div>
        </div>

        <hr />

        {/* 2) Second Div: Couple-friendly Toggle */}
        <div className="flex flex-row items-center justify-between">
          {/* Label + Sub-caption */}
          <div className="flex flex-col space-y-2">
            <span className="text-sm text-[#2C3C4E] font-medium">Couple-friendly</span>
            <span className="text-sm font-normal text-[#2C3C4E]">
              Couple can share this private room
            </span>
          </div>

          {/* Toggle Button */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isCoupleFriendly}
              onChange={(e) => setIsCoupleFriendly(e.target.checked)}
              className="sr-only peer"
            />
            <div
              className="
                w-11 h-6 
                bg-gray-200 
                peer-focus:outline-none 
                rounded-full peer
                dark:bg-gray-700 
                peer-checked:bg-blue-600 
                peer-checked:after:translate-x-full 
                peer-checked:after:border-white 
                after:content-[''] 
                after:absolute 
                after:top-[2px] 
                after:left-[2px] 
                after:bg-white 
                after:border-gray-300 
                after:border 
                after:rounded-full 
                after:h-5 
                after:w-5 
                after:transition-all
              "
            />
          </label>
        </div>

        <hr />

        {/* 3) Third Div: Amenities Title + Chips */}
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-sm text-[#2C3C4E] font-medium font-[Inter] leading-[124%]">
              Select all the amenities your rental offers
            </h2>
          </div>

          {/* Amenities grid */}
          <div className="flex flex-wrap gap-2">
            {availableAmenities.map((amenity) => {
              const isSelected = selectedAmenities.includes(amenity.title);
              return (
                <button
                  key={amenity.title}
                  type="button"
                  onClick={() => handleAmenityToggle(amenity.title)}
                  className={`
                    px-4 h-9 py-1 flex items-center justify-center space-x-1 
                    transition border text-[12px] font-normal font-[Inter] 
                    rounded-[42px] 
                    ${isSelected ? "bg-[#0A84FF] text-white border-[#0A84FF]" : "border-[#2C3C4E]  text-[#2C3C4E] hover:bg-gray-100"}
                  `}
                >
                  <Image
                    alt={amenity.title}
                    src={amenity.icon}
                    width={16}
                    height={16}
                    className={isSelected ? "invert brightness-200" : ""}

                  />
                  <span>{amenity.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        <hr />

        {/* 4) Fourth Div: Caption + Continue Button */}
        <div className="flex flex-col space-y-4 py-4">
          <p className="text-sm">
            If you don&apos;t see an amenity listed, you can mention it in the next step.
          </p>

         <br />
          <button
            onClick={handleContinue}
            className="
              bg-black
              text-white
              w-full
              py-4
              rounded-full
              font-semibold
              text-sm
              focus:outline-none
              focus:ring-2
              focus:ring-black
            "
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFeatures;