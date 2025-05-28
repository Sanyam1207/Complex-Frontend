// components/LocationSelector.tsx
import React from 'react';
import toast from 'react-hot-toast';

interface LocationSelectorProps {
  setActiveStep: (step: number) => void;
  location: string;
  setLocation: (location: string) => void;
  intersection: string;
  setIntersection: (intersection: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  setActiveStep,
  location,
  setLocation,
  intersection,
  setIntersection
}) => {
  // Handle continue with validation
  const handleContinue = () => {
    // Check if both location and intersection are empty
    if (!location.trim() && !intersection.trim()) {
      toast("Please provide either your location or nearest intersection", {
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
    setActiveStep(4);
  };

  return (
    <div className="bg-white rounded-t-[2rem] h-screen overflow-y-hidden">
      <div className="p-6 max-w-md mx-auto w-full flex flex-col justify-between h-full">
        {/* Top Section: Location & Intersection */}
        <div className="space-y-6">
          {/* "Your location?" */}
          <div className="flex flex-col space-y-3">
            <label className="text-sm font-medium text-[#2C3C4E]">
              Your location?
            </label>
            <input
              type="text"
              placeholder="Toronto, ON"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="
                w-full
                rounded-lg
                p-3
                text-sm
                text-[#2C3C4E]
                bg-[#F4F4F4] 
                focus:bg-white 
                focus:border-black
              focus:outline-none
              focus:border
              "
            />
          </div>

          {/* Divider with "or" */}
          <div className="relative flex items-center justify-center">
            <hr className="absolute w-full border-gray-200" />
            <span className="bg-white px-2 text-gray-400 text-xs">or</span>
          </div>

          {/* "Nearest intersection" */}
          <div className="flex flex-col space-y-3">
            <label className="text-sm font-medium text-[#2C3C4E]">
              Nearest intersection
            </label>
            <textarea
              placeholder="Main St & Danforth"
              value={intersection}
              onChange={(e) => setIntersection(e.target.value)}
              className="
                w-full
                rounded-lg
                p-3
                text-sm
                text-[#2C3C4E]
                bg-[#F4F4F4] 
                focus:bg-white 
                focus:border-black
              focus:outline-none
              focus:border
                h-12
                resize-none
              "
            />
          </div>
        </div>
        {/* Bottom Section: Continue Button */}
        <button
          onClick={handleContinue}
          type="button"
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
  );
};

export default LocationSelector;