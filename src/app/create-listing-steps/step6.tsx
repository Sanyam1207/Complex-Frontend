// components/PropertyPhotos.tsx
import React from 'react';

interface PropertyPhotosProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  totalSlots: number;
  handleSubmitListing: () => Promise<void>;
  isSubmitting: boolean;
}

const PropertyPhotos: React.FC<PropertyPhotosProps> = ({
  images,
  handleFileUpload,
  handleRemoveImage,
  totalSlots,
  handleSubmitListing,
  isSubmitting
}) => {
  return (
    <div className="bg-white md:flex md:justify-around rounded-t-[2rem] p-6 h-full -mt-2">
      <div className="flex flex-col items-center p-4 min-h-screen bg-white">
        {/* Grid: 2 columns on mobile, 3 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl mb-4">
          {Array.from({ length: totalSlots }, (_, i) => {
            if (i < images.length) {
              // Uploaded image slot
              return (
                <div
                  key={i}
                  className="relative w-full aspect-square md:h-64 md:aspect-auto bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={images[i]}
                    alt={`Uploaded ${i}`}
                    className="object-cover w-full h-full"
                  />
                  {/* Cancel icon */}
                  <div
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-white text-black rounded-full flex items-center justify-center cursor-pointer shadow-md"
                  >
                    ✕
                  </div>
                </div>
              );
            } else if (i === images.length) {
              // Active upload slot (with camera icon)
              return (
                <div
                  key={i}
                  className="relative w-full aspect-square md:h-64 md:aspect-auto bg-gray-100 rounded-lg flex items-center justify-center"
                >
                  <label className="cursor-pointer flex flex-col items-center justify-center">
                    <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center shadow">
                      <span className="text-gray-400 text-2xl">📷</span>
                      <span className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                        +
                      </span>
                    </div>
                    {/* Hidden file input */}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              );
            } else {
              // Remaining empty placeholders (non-clickable)
              return (
                <div
                  key={i}
                  className="md:w-64 aspect-square md:h-64 md:aspect-auto bg-gray-100 rounded-lg"
                ></div>
              );
            }
          })}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleSubmitListing}
          disabled={isSubmitting}
          className={`bg-black text-white rounded-full px-6 py-3 w-full max-w-md ${
            isSubmitting ? 'opacity-70' : ''
          }`}
        >
          {isSubmitting ? 'Uploading...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default PropertyPhotos;