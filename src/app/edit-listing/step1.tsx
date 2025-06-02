// components/PropertyTypeSelector.tsx
import React from 'react';

interface TypeItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface PropertyColumnProps {
  title: string;
  items: TypeItem[];
  selectedTab: string;
  isThisTab?: string;
  onSelectPropertyType: (propertyType: string) => void;
}

function PropertyColumn({
  title,
  items,
  selectedTab,
  isThisTab,
  onSelectPropertyType,
}: PropertyColumnProps) {
  return (
    <div
      className={`
        // For desktop, show both columns side-by-side
        md:w-1/2 md:block 

        // On mobile, show only the column that matches the selected tab
        ${selectedTab === isThisTab ? "block" : "hidden"}

        // Some spacing and sizing
        space-y-4 w-full max-w-md px-6 rounded-t-3xl
      `}
    >
      {/* Title is hidden on mobile (since we use tab buttons), 
          but shown on desktop */}
      <h2 className="hidden md:block text-xl font-semibold mb-6">{title}</h2>

      {items.map((item) => (
        <PropertyCard onSelectPropertyType={onSelectPropertyType} key={item.title} item={item} />
      ))}
    </div>
  );
}

function PropertyCard({ item, onSelectPropertyType }: { item: TypeItem, onSelectPropertyType: (propertyType: string) => void }) {
  return (
    <div onClick={() => onSelectPropertyType(item.title)} className="hover:cursor-pointer flex items-center space-x-4 bg-[#F4F4F4] p-4 rounded-md">
      <div className="w-10 h-10 bg-[#1F1F21] flex p-2 items-center justify-center rounded-full">
        {item.icon}
      </div>
      <div className="flex flex-col">
        <span className="font-medium">{item.title}</span>
        <span className="text-sm text-gray-500">{item.description}</span>
      </div>
    </div>
  );
}

interface PropertyTypeSelectorProps {
  selectedTab: "Apartment" | "House";
  setSelectedTab: (tab: "Apartment" | "House") => void;
  setActiveStep: (step: number) => void;
  apartmentItems: TypeItem[];
  houseItems: TypeItem[];
  onSelectPropertyType: (propertyType: string) => void;
}

const PropertyTypeSelector: React.FC<PropertyTypeSelectorProps> = ({
  selectedTab,
  setSelectedTab,
  apartmentItems,
  houseItems,
  onSelectPropertyType
}) => {
  return (
    <div className="bg-white h-full overflow-y-auto">
      <div className="bg-[#1c1c1c]">
        <div className='bg-[#1c1c1c] px-6 pt-0.5 pb-1'>
          {/* Mobile-only tabs */}
          <div className="flex bg-[#1F1F21] space-x-2 mb-4 md:hidden">
            <button
              onClick={() => setSelectedTab("Apartment")}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${selectedTab === "Apartment"
                ? "bg-white text-gray-700"
                : " bg-[#353537] text-white"
                }`}
            >
              Apartment
            </button>
            <button
              onClick={() => setSelectedTab("House")}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${selectedTab === "House"
                ? "bg-white text-gray-700"
                : " bg-[#353537] text-white"
                }`}
            >
              House
            </button>
          </div>
        </div>


        <div className="flex rounded-t-[2rem] bg-white h-full flex-col md:flex-row md:space-x-8 md:justify-around">
          <PropertyColumn
            onSelectPropertyType={onSelectPropertyType}
            title="Apartment"
            items={apartmentItems}
            selectedTab={selectedTab}
            isThisTab="Apartment"
          />
          <PropertyColumn
            title="House"
            onSelectPropertyType={onSelectPropertyType}
            items={houseItems}
            selectedTab={selectedTab}
            isThisTab="House"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyTypeSelector;