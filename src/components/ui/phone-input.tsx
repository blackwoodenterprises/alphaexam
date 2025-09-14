"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CountryCodeDropdown } from "./country-code-dropdown";
import { Input } from "./input";

export interface PhoneInputProps {
  value?: string; // Full phone number with country code
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
}

export function PhoneInput({
  value = "",
  onChange,
  placeholder = "Enter phone number",
  className,
  size = "default",
  disabled = false,
  error,
  label,
  required = false,
}: PhoneInputProps) {
  // Parse the current value to extract country code and phone number
  const parsePhoneNumber = (phoneNumber: string) => {
    if (!phoneNumber) return { countryCode: "+91", number: "" };
    
    // Find the longest matching country code
    const countryCodes = ["+1", "+91", "+44", "+86", "+81", "+49", "+33", "+39", "+34", "+7", "+55", "+52", "+61", "+82", "+65", "+60", "+66", "+84", "+62", "+63", "+92", "+880", "+94", "+977", "+971", "+966", "+20", "+27", "+234", "+254"];
    
    for (const code of countryCodes.sort((a, b) => b.length - a.length)) {
      if (phoneNumber.startsWith(code)) {
        return {
          countryCode: code,
          number: phoneNumber.slice(code.length).trim()
        };
      }
    }
    
    // Default to +91 if no country code found
    return { countryCode: "+91", number: phoneNumber };
  };

  const { countryCode, number } = parsePhoneNumber(value);

  // Handle country code change
  const handleCountryCodeChange = (newCountryCode: string) => {
    const newValue = number ? `${newCountryCode} ${number}` : newCountryCode;
    onChange(newValue);
  };

  // Handle phone number change
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value.replace(/[^0-9\s-]/g, ''); // Only allow numbers, spaces, and hyphens
    const newValue = newNumber ? `${countryCode} ${newNumber}` : countryCode;
    onChange(newValue);
  };

  return (
    <div className={cn("space-y-1", className)}>
      {/* Label */}
      {label && (
        <label className="block text-left text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Phone Input Container */}
      <div className="flex space-x-2">
        {/* Country Code Dropdown */}
        <CountryCodeDropdown
          value={countryCode}
          onChange={handleCountryCodeChange}
          size={size}
          disabled={disabled}
          className="flex-shrink-0"
        />
        
        {/* Phone Number Input */}
        <div className="flex-1">
          <Input
            type="tel"
            value={number}
            onChange={handleNumberChange}
            placeholder={placeholder}
            size={size}
            disabled={disabled}
            className="w-full"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {/* Helper Text */}
      <p className="text-xs text-gray-500">
        We&apos;ll use this for exam notifications and support
      </p>
    </div>
  );
}

export default PhoneInput;