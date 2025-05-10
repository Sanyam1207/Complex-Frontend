// components/PropertyDescription.tsx
import React from 'react';

interface PropertyDescriptionProps {
  descriptionPoints: string[];
  handleDescriptionChange: (index: number, value: string) => void;
  handleAddDescriptionPoint: () => void;
  walkingDistancePoints: string[];
  handleWalkingDistanceChange: (index: number, value: string) => void;
  handleAddWalkingDistancePoint: () => void;
  setActiveStep: (step: number) => void;
}

const PropertyDescription: React.FC<PropertyDescriptionProps> = ({
  descriptionPoints,
  handleDescriptionChange,
  handleAddDescriptionPoint,
  walkingDistancePoints,
  handleWalkingDistanceChange,
  handleAddWalkingDistancePoint,
  setActiveStep
}) => {
  return (
    <div className="bg-white md:flex md:justify-around rounded-t-[2rem] p-6 h-full -mt-2">
      <div className="flex flex-col space-y-8 p-4 md:p-8 md:w-1/2">
        {/* 1) First Division: Description */}
        <div className="flex flex-col space-y-4">
          <label className="text-base font-semibold">Description:</label>

          {descriptionPoints.map((point, index) => {
            const isLast = index === descriptionPoints.length - 1;
            return (
              <div
                key={index}
                className="flex flex-col md:flex-row md:items-center md:gap-2"
              >
                <input
                  type="text"
                  placeholder={`Point ${index + 1}`}
                  value={point}
                  onChange={(e) => handleDescriptionChange(index, e.target.value)}
                  className="border border-gray-300 focus:border-gray-900 rounded p-2 focus:outline-none flex-1"
                />
                {isLast && (
                  <button
                    onClick={handleAddDescriptionPoint}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full w-1/3 hover:bg-blue-600 transition mt-3 md:mt-0"
                  >
                    Add +
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* 2) Second Division: Walking Distance */}
        <div className="flex flex-col space-y-4">
          <label className="text-base font-semibold">Walking Distance to:</label>

          {walkingDistancePoints.map((point, index) => {
            const isLast = index === walkingDistancePoints.length - 1;
            return (
              <div
                key={index}
                className="flex flex-col md:flex-row md:items-center md:gap-2"
              >
                <input
                  type="text"
                  placeholder={`Point ${index + 1}`}
                  value={point}
                  onChange={(e) =>
                    handleWalkingDistanceChange(index, e.target.value)
                  }
                  className="border border-gray-300 focus:border-gray-900 rounded p-2 focus:outline-none flex-1"
                />
                {isLast && (
                  <button
                    onClick={handleAddWalkingDistancePoint}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full w-1/3 hover:bg-blue-600 transition mt-3 md:mt-0"
                  >
                    Add +
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* 3) Third Division: Continue button */}
        <div className="flex justify-center">
          <button
            onClick={() => { setActiveStep(6) }}
            className="bg-black text-white rounded-full px-4 py-3 w-full max-w-sm hover:bg-gray-900 transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyDescription;