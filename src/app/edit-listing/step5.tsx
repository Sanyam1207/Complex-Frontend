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
    const hasDescription = descriptionPoints.some(point => point.trim() !== '');
    const hasWalkingDistance = walkingDistancePoints.some(point => point.trim() !== '');

    if (!hasDescription && !hasWalkingDistance) {
      toast("Please provide at least one description point or walking distance information", {
        icon: (
          <div className="bg-[rgba(220,38,38,1)] p-2 rounded-full flex items-center justify-center text-white">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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

    setActiveStep(6);
  };

  return (
    <div className="bg-white rounded-t-[2rem] h-full overflow-y-auto">
      <div className="p-6 max-w-md mx-auto w-full flex flex-col space-y-6">

        {/* 1) Description */}
        <div className="flex flex-col space-y-4">
          <label className="text-sm font-medium text-[#2C3C4E]">Description:</label>

          {descriptionPoints.map((point, index) => {
            const showRemove = descriptionPoints.length > 1;
            return (
              <div key={index} className="relative group">
                <input
                  type="text"
                  placeholder={`Description point ${index + 1}`}
                  value={point}
                  onChange={(e) => handleDescriptionChange(index, e.target.value)}
                  className="
                    w-full
                    rounded-lg
                    p-3
                    pr-10
                    text-sm
                    text-[#2C3C4E]
                    bg-[#F4F4F4]
                    focus:bg-white
                    focus:border
                    focus:border-black
                    focus:outline-none
                  "
                />
                {showRemove && (
                  <button
                    onClick={() => handleRemoveDescriptionPoint(index)}
                    className="
                      absolute
                      right-2
                      top-1/2
                      -translate-y-1/2
                      bg-[#f5f5f5]
                      
                      text-gray-600
                      w-6
                      h-6
                      rounded-full
                      flex items-center
                      justify-center
                      transition-opacity
                    "
                    title="Remove point"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
          <button
            onClick={handleAddDescriptionPoint}
            className="
              mt-2
              px-4
              bg-blue-500
              text-white
              rounded-full
              w-20
              py-3
              flex flex-row
              items-center justify-center
              text-sm
              hover:bg-blue-600
              transition
              font-semibold
            "
            title="Add description point"
          >
            Add &nbsp; &#43;
          </button>
        </div>  

        {/* 2) Walking Distance */}
        <div className="flex flex-col space-y-4">
          <label className="text-sm font-medium text-[#2C3C4E]">Walking Distance to:</label>

          {walkingDistancePoints.map((point, index) => {
            const showRemove = walkingDistancePoints.length > 1;
            return (
              <div key={index} className="relative group">
                <input
                  type="text"
                  placeholder={`Walking distance point ${index + 1}`}
                  value={point}
                  onChange={(e) => handleWalkingDistanceChange(index, e.target.value)}
                  className="
                    w-full
                    rounded-lg
                    p-3
                    pr-10
                    text-sm
                    text-[#2C3C4E]
                    bg-[#F4F4F4]
                    focus:bg-white
                    focus:border
                    focus:border-black
                    focus:outline-none
                  "
                />
                {showRemove && (
                  <button
                    onClick={() => handleRemoveWalkingDistancePoint(index)}
                    className="
                      absolute
                      right-2
                      top-1/2
                      -translate-y-1/2
                      bg-[#f5f5f5]
                      text-gray-600
                      w-6
                      h-6
                      rounded-full
                      flex items-center
                      justify-center
                      transition-opacity
                    "
                    title="Remove point"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
          
          <button
            onClick={handleAddWalkingDistancePoint}
            className="
              mt-2
              px-4
              bg-blue-500
              text-white
              rounded-full
              py-3
              flex flex-row
              text-sm
              hover:bg-blue-600
              transition
              w-20
              font-semibold
            "
            title="Add walking distance point"
          >
            Add &nbsp; &#43;
          </button>
        </div>

       
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