// components/RentalDetails.tsx
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

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
  const [month, setMonth] = useState('01');
  const [day, setDay] = useState('01');
  const [year, setYear] = useState('2025');

  // Helper function to check if date is in the past
  const isPastDate = (selectedMonth: string, selectedDay: string, selectedYear: string) => {
    const selectedDate = new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, parseInt(selectedDay));
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates
    return selectedDate < today;
  };


  // Helper function to construct date string with validation
  const handleDateChange = (selectedMonth: string, selectedDay: string, selectedYear: string) => {
    if (isPastDate(selectedMonth, selectedDay, selectedYear)) {
      toast("Please select a future date for your rental start date.", {
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
      return false;
    }

    const formattedDate = `${selectedYear}-${selectedMonth}-${selectedDay}`;
    setStartDate(formattedDate);
    return true;
  };

  // Initialize date when component mounts
  useEffect(() => {
    if (!startDate) {
      // Set to today's date or tomorrow to avoid past date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowMonth = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
      const tomorrowDay = tomorrow.getDate().toString().padStart(2, '0');
      const tomorrowYear = tomorrow.getFullYear().toString();

      setMonth(tomorrowMonth);
      setDay(tomorrowDay);
      setYear(tomorrowYear);
      handleDateChange(tomorrowMonth, tomorrowDay, tomorrowYear);
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

  // Year options (current year and future years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 7 }, (_, i) => {
    const yearValue = (currentYear + i).toString();
    return { value: yearValue, label: yearValue };
  });

  // Lease duration options
  const leaseDurationOptions = [
    { value: 'Month-To-Month / Flexible', label: 'Month-to-Month / Flexible' },
    { value: '1 Months', label: '1 Months' },
    { value: '2 Months', label: '2 Months' },
    { value: '3 Months', label: '3 Months' },
    { value: '4 Months', label: '4 Months' },
    { value: '5 Months', label: '5 Months' },
    { value: '6 Months', label: '6 Months' },
    { value: '7 Months', label: '7 Months' },
    { value: '8 Months', label: '8 Months' },
    { value: '9 Months', label: '9 Months' },
    { value: '10 Months', label: '10 Months' },
    { value: '11 Months', label: '11 Months' },
    { value: '12 Months', label: '12 Months' },
  ];

  // Handle continue button with validation
  const handleContinue = () => {
    if (!monthlyPrice || monthlyPrice === '0') {
      // showToastMessage('');
       toast("Please enter a valid monthly price.", {
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

    if (isPastDate(month, day, year)) {

      toast("Please select a future date for your rental start date.", {
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

    setActiveStep(3);
  };

  return (
    <div className="bg-white rounded-t-[2rem] h-full overflow-y-auto">
     
      <div className="p-6 max-w-md mx-auto w-full h-full flex flex-col space-y-4">
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
              focus:border-black
              focus:outline-none
              focus:border
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

        <br /><br />

        {/* Continue button */}
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

export default RentalDetails;