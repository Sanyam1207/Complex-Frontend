// components/LocationSelector.tsx
import React from 'react';

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
  return (
    <div className="bg-white md:flex md:justify-around rounded-t-[2rem] p-6 h-full -mt-2">
      <div className="flex flex-col justify-stretch h-full max-w-md mx-auto w-full">
        {/* Top Section: Location & Intersection */}
        <div className="space-y-6">
          {/* "Your location?" */}
          <div className="flex flex-col space-y-1">
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
                border
                bg-[#F4F4F4]
                rounded-lg
                p-3
                text-sm
                focus:outline-none
                focus:ring-1
                focus:ring-black
              "
            />
          </div>

          {/* Divider with "or" */}
          <div className="relative flex items-center justify-center">
            <hr className="absolute w-full border-gray-200" />
            <span className="bg-white px-2 text-gray-400 text-xs">or</span>
          </div>

          {/* "Nearest intersection" */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-[#2C3C4E]">
              Nearest intersection
            </label>
            <textarea
              placeholder="Main St & Danforth"
              value={intersection}
              onChange={(e) => setIntersection(e.target.value)}
              className="
                w-full
                border
                bg-[#F4F4F4]
                rounded-lg
                p-3
                text-sm
                focus:outline-none
                focus:ring-1
                focus:ring-black
                h-12
              "
            />
          </div>
        </div>

        {/* Bottom Section: Continue Button */}
        <button
          onClick={() => { setActiveStep(4)}}
          type="button"
          className="
            bg-black
            text-white
            w-full
            py-4    
            rounded-full
            font-semibold
            text-sm
            mt-6
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