// components/PropertyDescription.tsx
import React from 'react';
import toast from 'react-hot-toast';

interface PropertyDescriptionProps {
  descriptionPoints: string[];
  handleDescriptionChange: (index: number, value: string) => void;
  handleAddDescriptionPoint: () => void;
  handleRemoveDescriptionPoint: (index: number) => void;
  walkingDistancePoints: string[];
  handleWalkingDistanceChange: (index: number, value: string) => void;
  handleAddWalkingDistancePoint: () => void;
  handleRemoveWalkingDistancePoint: (index: number) => void;
  setActiveStep: (step: number) => void;
}

const PropertyDescription: React.FC<PropertyDescriptionProps> = ({
  descriptionPoints,
  handleDescriptionChange,
  handleAddDescriptionPoint,
  handleRemoveDescriptionPoint,
  walkingDistancePoints,
  handleWalkingDistanceChange,
  handleAddWalkingDistancePoint,
  handleRemoveWalkingDistancePoint,
  setActiveStep
}) => {
  // Handle continue with validation
  const handleContinue = () => {
    // Check if at least one description point is filled
    const hasDescription = descriptionPoints.some(point => point.trim() !== '');
    const hasWalkingDistance = walkingDistancePoints.some(point => point.trim() !== '');

    if (!hasDescription && !hasWalkingDistance) {
      toast("Please provide at least one description point or walking distance information", {
        icon: (
          <div className="bg-[rgba(220,38,38,1)] p-2 rounded-full items-center text-center justify-center flex">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        ),
        duration: 3000,
        position: "bottom-right",
        style: {
          background: "rgba(31,31,33,1)",
          color: "#fff",
        }
      });
      return;
    }

    // If validation passes, proceed to next step
    setActiveStep(6);
  };

  return (
    <div className="bg-white rounded-t-[2rem] h-full overflow-y-auto">
      <div className="p-6 max-w-md mx-auto w-full flex flex-col space-y-6">
        {/* 1) First Division: Description */}
        <div className="flex flex-col space-y-4">
          <label className="text-sm font-medium text-[#2C3C4E]">Description:</label>

          {descriptionPoints.map((point, index) => {
            const isLast = index === descriptionPoints.length - 1;
            const showRemove = descriptionPoints.length > 1;
            return (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={`Description point ${index + 1}`}
                  value={point}
                  onChange={(e) => handleDescriptionChange(index, e.target.value)}
                  className="
                    flex-1
                    rounded-lg
                    p-3
                    text-sm
                    text-[#2C3C4E]
                    bg-[#F4F4F4] 
                    focus:bg-white 
                    focus:outline-black
                    focus:outline
                  "
                />

                {/* Remove button */}
                {showRemove && (
                  <button
                    onClick={() => handleRemoveDescriptionPoint(index)}
                    className="
                      bg-red-500 
                      text-white 
                      p-2 
                      rounded-full 
                      hover:bg-red-600 
                      transition
                      flex-shrink-0
                    "
                    title="Remove point"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}

                {/* Add button */}
                {isLast && (
                  <button
                    onClick={handleAddDescriptionPoint}
                    className="
                      bg-blue-500 
                      text-white 
                      p-2 
                      rounded-full 
                      hover:bg-blue-600 
                      transition
                      flex-shrink-0
                    "
                    title="Add point"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* 2) Second Division: Walking Distance */}
        <div className="flex flex-col space-y-4">
          <label className="text-sm font-medium text-[#2C3C4E]">Walking Distance to:</label>

          {walkingDistancePoints.map((point, index) => {
            const isLast = index === walkingDistancePoints.length - 1;
            const showRemove = walkingDistancePoints.length > 1;
            return (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={`Walking distance point ${index + 1}`}
                  value={point}
                  onChange={(e) => handleWalkingDistanceChange(index, e.target.value)}
                  className="
                    flex-1
                    rounded-lg
                    p-3
                    text-sm
                    text-[#2C3C4E]
                    bg-[#F4F4F4] 
                    focus:bg-white 
                    focus:outline-black
                    focus:outline
                  "
                />

                {/* Remove button */}
                {showRemove && (
                  <button
                    onClick={() => handleRemoveWalkingDistancePoint(index)}
                    className="
                      bg-red-500 
                      text-white 
                      p-2 
                      rounded-full 
                      hover:bg-red-600 
                      transition
                      flex-shrink-0
                    "
                    title="Remove point"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}

                {/* Add button */}
                {isLast && (
                  <button
                    onClick={handleAddWalkingDistancePoint}
                    className="
                      bg-blue-500 
                      text-white 
                      p-2 
                      rounded-full 
                      hover:bg-blue-600 
                      transition
                      flex-shrink-0
                    "
                    title="Add point"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <br />
        {/* 3) Continue button */}
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
  );
};

export default PropertyDescription;