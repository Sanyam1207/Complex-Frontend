// components/PropertyFeatures.tsx
import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";

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
          shadow-sm
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
          shadow-lg 
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
    <div
      className="
        bg-white 
        md:flex 
        md:justify-center 
        md:items-center 
        rounded-t-[2rem] 
        p-2
        h-screen
        -mt-5
      "
    >
      <div
        className="
          flex 
          flex-col 
          space-y-2 
          p-4 
          
          w-full 
          md:max-w-[450px] 
        "
      >
        {/* 1) First Div: Title + Dropdowns */}
        <div className="flex flex-col pb-4 space-y-4">
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
        <div className="flex py-4 flex-row items-center justify-between">
          {/* Label + Sub-caption */}
          <div className="flex flex-col space-y-2">
            {/* Updated styling here */}
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
        <div className="flex py-4 flex-col space-y-2">
          <div>
            {/* Title */}
            <h2 className="mb-3 text-sm text-[#2C3C4E] font-medium font-[Inter] leading-[124%]">
              Select all the amenities your rental offers
            </h2>
          </div>

          {/* 3 columns, auto rows */}
          <div className="flex flex-wrap space-x-2 space-y-2">
            <div className="hidden">
              {/* This div prevents the first item from getting the space-x-2 margin */}
            </div>
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
                    rounded-[42px] border-[#2C3C4E] 
                    ${isSelected ? "bg-[#0A84FF] text-white" : "text-[#2C3C4E] hover:bg-gray-100"}
                  `}
                >
                  {/* Example icon; adjust src, width, height, or remove if not needed */}
                  <Image
                    alt={amenity.title}
                    src={amenity.icon}
                    width={16}
                    height={16}
                  />
                  <span>{amenity.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        <hr />

        {/* 4) Fourth Div: Caption + Continue Button */}
        <div className="flex flex-col py-4 space-y-4">
          <p className="text-sm mb-2">
            If you don&apos;t see an amenity listed, you can mention it in the next step.
          </p>
          <button
            onClick={() => {
              setActiveStep(5);
            }}
            className="px-4 py-3 bg-black text-white rounded-full hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFeatures;