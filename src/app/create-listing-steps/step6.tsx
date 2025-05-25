// components/PropertyPhotos.tsx
import React from 'react';
import toast from 'react-hot-toast';

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
  // Handle continue with validation
  const handleContinue = async () => {
    if (images.length === 0) {
      toast("Please upload at least one photo of your property", {
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

    // If validation passes, proceed with submission
    await handleSubmitListing();
  };

  return (
    <div className="bg-white rounded-t-[2rem] h-full overflow-y-auto">
      <div className="p-6 flex flex-col h-full">
        {/* Title */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-[#2C3C4E] text-center">
            Upload photos of your property
          </h2>
          <p className="text-sm text-gray-500 text-center mt-2">
            Add at least one photo to showcase your rental
          </p>
        </div>

        {/* Photo Grid */}
        <div className="flex-1 flex flex-col items-center">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl mb-6">
            {Array.from({ length: totalSlots }, (_, i) => {
              if (i < images.length) {
                // Uploaded image slot
                return (
                  <div
                    key={i}
                    className="relative w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={images[i]}
                      alt={`Property photo ${i + 1}`}
                      className="object-cover w-full h-full"
                    />
                    {/* Remove button */}
                    <button
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-red-600 transition"
                      title="Remove photo"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                );
              } else if (i === images.length) {
                // Active upload slot (with camera icon)
                return (
                  <div
                    key={i}
                    className="relative w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-gray-400 transition"
                  >
                    <label className="cursor-pointer flex flex-col items-center justify-center p-4">
                      <div className="relative w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow mb-2">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center text-blue-500 text-xs font-bold">
                          +
                        </span>
                      </div>
                      <span className="text-xs text-gray-600 text-center">Add Photo</span>
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
                    className="w-full aspect-square bg-gray-50 rounded-lg border border-gray-200"
                  ></div>
                );
              }
            })}
          </div>

          {/* Photo count indicator */}
          <div className="text-sm text-gray-500 mb-4">
            {images.length} / 6 photos uploaded
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={isSubmitting}
            className={`
              bg-black
              text-white
              w-full
              max-w-md
              py-4
              my-5
              rounded-full
              font-semibold
              text-sm
              focus:outline-none
              focus:ring-2
              focus:ring-black
              transition
              ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800'}
            `}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Listing'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyPhotos;