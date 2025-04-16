import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface SearchDropdownProps {
  options: string[];
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
}

export default function SearchDropdown({
  options,
  value,
  setValue,
  placeholder = "Select an option",
}: SearchDropdownProps) {
  // Local state for search query.
  const [query, setQuery] = useState(value || "");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync local query with external value when it changes.
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Close dropdown when clicking outside the component.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery(value); // Revert query back to selected value if click outside.
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  // Filter options based on the query.
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative w-64">
      {/* The main input acts as both display and search field */}
      <input
        type="text"
        placeholder={placeholder}
        className="w-full p-2 py-3.5 border border-[#E3E2E0] text-[#2C3C4E] rounded-md  outline-none cursor-pointer placeholder:text-[#2C3C4E]"
        value={query}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
      />
      <Image src={'/icons/downarrow.svg'} alt="downarrow" height={12} width={12} className="absolute top-6 right-4" />
      {isOpen && (
        <div className="absolute w-full mt-1 py-3 bg-white border rounded-md z-10">
          <ul className="max-h-40 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setValue(option);
                    setQuery(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
