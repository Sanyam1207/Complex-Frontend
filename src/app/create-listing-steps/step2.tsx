// components/RentalDetails.tsx
import React, { useState, useEffect, useRef } from 'react';

interface RentalDetailsProps {
  setActiveStep: (step: number) => void;
  monthlyPrice: string;
  setMonthlyPrice: (price: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  leaseDuration: string;
  setLeaseDuration: (duration: string) => void;
}

// Custom dropdown component
const CustomDropdown = ({ 
  options, 
  value, 
  onChange, 
  className = "" 
}: { 
  options: { value: string; label: string }[]; 
  value: string; 
  onChange: (value: string) => void;
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
          p-3 
          text-sm 
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
        <span>{selectedOption?.label || "Select"}</span>
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
          className="h-5 w-5 text-gray-500"
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
                text-sm 
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

const RentalDetails: React.FC<RentalDetailsProps> = ({
  setActiveStep,
  monthlyPrice,
  setMonthlyPrice,
  startDate,
  setStartDate,
  leaseDuration,
  setLeaseDuration
}) => {
  // Helper function to construct date string
  const handleDateChange = (month: string, day: string, year: string) => {
    const formattedDate = `${year}-${month}-${day}`;
    setStartDate(formattedDate);
  };

  const [month, setMonth] = useState('01');
  const [day, setDay] = useState('01');
  const [year, setYear] = useState('2023');

  // Initialize date when component mounts
  useEffect(() => {
    if (!startDate) {
      handleDateChange(month, day, year);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Month options
  const monthOptions = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  // Day options
  const dayOptions = Array.from({ length: 31 }, (_, i) => {
    const num = i + 1;
    const value = num < 10 ? `0${num}` : `${num}`;
    return { value, label: value };
  });

  // Year options
  const yearOptions = [
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' },
    { value: '2027', label: '2027' },
    { value: '2028', label: '2028' },
    { value: '2029', label: '2029' },
    { value: '2030', label: '2030' },
    { value: '2031', label: '2031' },

  ];

  // Lease duration options
  const leaseDurationOptions = [
    { value: 'Month-To-Month / Flexible', label: 'Month-to-Month / Flexible' },
    { value: '6 Months', label: '6 Months' },
    { value: '12 Months', label: '12 Months' },
  ];

  return (
    <div className="bg-white md:flex md:justify-around rounded-t-[2rem] p-6 h-full -mt-2">
      <div className="max-w-md mx-auto w-full flex flex-col pt-5 md:pt-6 justify-center md:justify-start space-y-4">
        {/* Monthly price */}
        <div className="flex flex-col space-y-3">
          <label className="text-sm font-base">
            Monthly price for your rental?
          </label>
          <input
            type="text"
            placeholder="$2000"
            value={monthlyPrice}
            onChange={(e) => setMonthlyPrice(e.target.value.replace(/\D/g, ''))}
            className="
              w-full
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
        </div>

        {/* Start date */}
        <div className="flex flex-col space-y-3">
          <label className="text-sm font-base">
            Pick a start date for your rental
          </label>
          <div className="flex space-x-2">
            <CustomDropdown
              options={monthOptions}
              value={month}
              onChange={(value) => {
                setMonth(value);
                handleDateChange(value, day, year);
              }}
              className="flex-1"
            />

            <CustomDropdown
              options={dayOptions}
              value={day}
              onChange={(value) => {
                setDay(value);
                handleDateChange(month, value, year);
              }}
              className="flex-1"
            />

            <CustomDropdown
              options={yearOptions}
              value={year}
              onChange={(value) => {
                setYear(value);
                handleDateChange(month, day, value);
              }}
              className="flex-1"
            />
          </div>
        </div>

        {/* Lease duration */}
        <div className="flex flex-col space-y-3">
          <label className="text-sm font-base">
            How long is the lease duration?
          </label>
          <CustomDropdown
            options={leaseDurationOptions}
            value={leaseDuration}
            onChange={(value) => setLeaseDuration(value)}
            className="w-full"
          />
        </div>

        <div className="h-64 md:h-8">
        </div>

        {/* Continue button */}
        <button onClick={() => { setActiveStep(3) }}
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

export default RentalDetails;