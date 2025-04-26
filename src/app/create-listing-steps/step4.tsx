// components/PropertyFeatures.tsx
import React from 'react';
import Image from "next/image";

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
            <select
              className="border p-4 text-xs rounded"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
            >
              <option value="">Bedrooms</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4 Bedrooms</option>
              <option value="5">5 Bedrooms</option>
            </select>

            {/* Bathrooms Dropdown */}
            <select
              className="border p-4 text-xs rounded"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
            >
              <option value="">Bathrooms</option>
              <option value="1">1 Bathroom</option>
              <option value="2">2 Bathrooms</option>
              <option value="3">3 Bathrooms</option>
              <option value="4">4 Bathrooms</option>
              <option value="5">5 Bathrooms</option>
            </select>
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
            {availableAmenities.map((amenity) => {
              const isSelected = selectedAmenities.includes(amenity.title);
              return (
                <button
                  key={amenity.title}
                  type="button"
                  onClick={() => handleAmenityToggle(amenity.title)}
                  className={`
                    px-4 h-9  py-1 flex items-center justify-center space-x-1 
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