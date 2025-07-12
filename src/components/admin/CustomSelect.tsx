// app/components/admin/CustomSelect.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

export default function CustomSelect({
  options,
  value,
  onChange,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  // Close the dropdown if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    // --- FIX: Reduced width and prepared for a more compact design ---
    <div className="relative w-48" ref={selectRef}>
      {/* The visible part of the dropdown */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        // --- FIX: Use justify-between to space out the text and icon ---
        className="w-full flex items-center justify-between px-3 py-2 bg-[#282828] border border-gray-700 rounded-lg text-sm text-white focus:outline-none hover:bg-[#202020] transition-colors"
      >
        {/* --- FIX: Display the selected option's label --- */}
        <span className="truncate">
          {selectedOption ? selectedOption.label : "Select..."}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* The dropdown options panel */}
      {isOpen && (
        <ul className="absolute z-10 w-full mt-2 bg-[#181818] border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/20 hover:text-white cursor-pointer"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
