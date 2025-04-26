// components/RentalDetails.tsx
import React from 'react';

interface RentalDetailsProps {
  setActiveStep: (step: number) => void;
  monthlyPrice: string;
  setMonthlyPrice: (price: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  leaseDuration: string;
  setLeaseDuration: (duration: string) => void;
}

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

  const [month, setMonth] = React.useState('01');
  const [day, setDay] = React.useState('01');
  const [year, setYear] = React.useState('2023');

  // Initialize date when component mounts
  React.useEffect(() => {
    if (!startDate) {
      handleDateChange(month, day, year);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              bg-[#F4F4F4]
              border
              border-gray-300
              rounded-lg
              p-3
              text-sm
              focus:outline-none
              focus:ring-1
              focus:ring-black
            "
          />
        </div>

        {/* Start date */}
        <div className="flex flex-col space-y-3">
          <label className="text-sm font-base ">
            Pick a start date for your rental
          </label>
          <div className="flex space-x-2">
            <select
              value={month}
              onChange={(e) => {
                setMonth(e.target.value);
                handleDateChange(e.target.value, day, year);
              }}
              className="
                flex-1
                border
                border-gray-300
                rounded-lg
                p-3
                text-sm
                focus:outline-none
                focus:ring-1
                focus:ring-black
              "
            >
              <option value="01">January</option>
              <option value="02">February</option>
              <option value="03">March</option>
              <option value="04">April</option>
              <option value="05">May</option>
              <option value="06">June</option>
              <option value="07">July</option>
              <option value="08">August</option>
              <option value="09">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>

            <select
              value={day}
              onChange={(e) => {
                setDay(e.target.value);
                handleDateChange(month, e.target.value, year);
              }}
              className="
                flex-1
                border
                border-gray-300
                rounded-lg
                p-3
                text-sm
                focus:outline-none
                focus:ring-1
                focus:ring-black
              "
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map(num => (
                <option key={num} value={num < 10 ? `0${num}` : `${num}`}>
                  {num < 10 ? `0${num}` : num}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                handleDateChange(month, day, e.target.value);
              }}
              className="
                flex-1
                border
                border-gray-300
                rounded-lg
                p-3
                text-sm
                focus:outline-none
                focus:ring-1
                focus:ring-black
              "
            >
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>
        </div>

        {/* Lease duration */}
        <div className="flex flex-col space-y-3">
          <label className="text-sm font-base ">
            How long is the lease duration?
          </label>
          <select
            value={leaseDuration}
            onChange={(e) => setLeaseDuration(e.target.value)}
            className="
              w-full
              border
              border-gray-300
              rounded-lg
              p-3
              text-sm
              text-gray-700
              focus:outline-none
              focus:ring-1
              focus:ring-black
            "
          >
            <option value="Month-To-Month / Flexible">Month-to-Month / Flexible</option>
            <option value="6 Months">6 Months</option>
            <option value="12 Months">12 Months</option>
          </select>
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