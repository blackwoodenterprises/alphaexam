"use client";

import React from "react";
import { Dropdown, DropdownOption } from "./dropdown";
import { cn } from "@/lib/utils";

export interface CountryCodeDropdownProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  size?: "sm" | "default" | "lg";
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
}

// Popular country codes with flags (using emoji flags)
const countryOptions: DropdownOption[] = [
  { value: "+1", label: "🇺🇸 +1", description: "United States" },
  { value: "+91", label: "🇮🇳 +91", description: "India" },
  { value: "+44", label: "🇬🇧 +44", description: "United Kingdom" },
  { value: "+86", label: "🇨🇳 +86", description: "China" },
  { value: "+81", label: "🇯🇵 +81", description: "Japan" },
  { value: "+49", label: "🇩🇪 +49", description: "Germany" },
  { value: "+33", label: "🇫🇷 +33", description: "France" },
  { value: "+39", label: "🇮🇹 +39", description: "Italy" },
  { value: "+34", label: "🇪🇸 +34", description: "Spain" },
  { value: "+7", label: "🇷🇺 +7", description: "Russia" },
  { value: "+55", label: "🇧🇷 +55", description: "Brazil" },
  { value: "+52", label: "🇲🇽 +52", description: "Mexico" },
  { value: "+61", label: "🇦🇺 +61", description: "Australia" },
  { value: "+82", label: "🇰🇷 +82", description: "South Korea" },
  { value: "+65", label: "🇸🇬 +65", description: "Singapore" },
  { value: "+60", label: "🇲🇾 +60", description: "Malaysia" },
  { value: "+66", label: "🇹🇭 +66", description: "Thailand" },
  { value: "+84", label: "🇻🇳 +84", description: "Vietnam" },
  { value: "+62", label: "🇮🇩 +62", description: "Indonesia" },
  { value: "+63", label: "🇵🇭 +63", description: "Philippines" },
  { value: "+92", label: "🇵🇰 +92", description: "Pakistan" },
  { value: "+880", label: "🇧🇩 +880", description: "Bangladesh" },
  { value: "+94", label: "🇱🇰 +94", description: "Sri Lanka" },
  { value: "+977", label: "🇳🇵 +977", description: "Nepal" },
  { value: "+971", label: "🇦🇪 +971", description: "UAE" },
  { value: "+966", label: "🇸🇦 +966", description: "Saudi Arabia" },
  { value: "+20", label: "🇪🇬 +20", description: "Egypt" },
  { value: "+27", label: "🇿🇦 +27", description: "South Africa" },
  { value: "+234", label: "🇳🇬 +234", description: "Nigeria" },
  { value: "+254", label: "🇰🇪 +254", description: "Kenya" },
];

export function CountryCodeDropdown({
  value = "+91", // Default to India
  onChange,
  className,
  size = "default",
  disabled = false,
  error,
  label,
  required = false,
}: CountryCodeDropdownProps) {
  return (
    <div className={cn("w-32", className)}>
      <Dropdown
        options={countryOptions}
        value={value}
        onChange={(selectedValue) => onChange(selectedValue as string)}
        placeholder="Code"
        searchPlaceholder="Search countries..."
        size={size}
        disabled={disabled}
        error={error}
        label={label}
        required={required}
        searchable={true}
        className="w-full"
        dropdownClassName="min-w-[280px]"
      />
    </div>
  );
}

export default CountryCodeDropdown;