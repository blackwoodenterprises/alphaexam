"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Search, Check, X } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
  dropdownClassName?: string;
  maxHeight?: string;
  loading?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  size?: "sm" | "default" | "lg";
  searchable?: boolean;
}

// Keep the old interface for backward compatibility
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SearchableDropdownProps extends DropdownProps {}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search options...",
  multiple = false,
  disabled = false,
  clearable = false,
  className,
  dropdownClassName,
  maxHeight = "200px",
  loading = false,
  error,
  label,
  required = false,
  size = "default",
  searchable = true,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Filter options based on search term (only if searchable)
  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Get selected options
  const selectedOptions = multiple
    ? options.filter((option) => Array.isArray(value) && value.includes(option.value))
    : options.find((option) => option.value === value);

  // Handle option selection
  const handleOptionSelect = useCallback(
    (optionValue: string) => {
      if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        const newValues = currentValues.includes(optionValue)
          ? currentValues.filter((v) => v !== optionValue)
          : [...currentValues, optionValue];
        onChange(newValues);
      } else {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm("");
      }
    },
    [multiple, value, onChange]
  );

  // Handle clear selection
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(multiple ? [] : "");
      setSearchTerm("");
    },
    [multiple, onChange]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case "Enter":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
            handleOptionSelect(filteredOptions[focusedIndex].value);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSearchTerm("");
          setFocusedIndex(-1);
          break;
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setFocusedIndex((prev) =>
              prev < filteredOptions.length - 1 ? prev + 1 : 0
            );
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (isOpen) {
            setFocusedIndex((prev) =>
              prev > 0 ? prev - 1 : filteredOptions.length - 1
            );
          }
          break;
        case "Tab":
          setIsOpen(false);
          break;
      }
    },
    [disabled, isOpen, focusedIndex, filteredOptions, handleOptionSelect]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
        setFocusedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens (only if searchable)
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Scroll focused option into view
  useEffect(() => {
    if (focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [focusedIndex]);

  // Size classes
  const sizeClasses = {
    sm: "h-8 text-sm",
    default: "h-10 text-sm",
    lg: "h-12 text-base",
  };

  // Render selected value display
  const renderSelectedValue = () => {
    if (multiple && Array.isArray(selectedOptions)) {
      if (selectedOptions.length === 0) {
        return <span className="text-gray-500">{placeholder}</span>;
      }
      if (selectedOptions.length === 1) {
        return selectedOptions[0].label;
      }
      return `${selectedOptions.length} items selected`;
    }

    if (!multiple && selectedOptions) {
      return (selectedOptions as DropdownOption).label;
    }

    return <span className="text-gray-500">{placeholder}</span>;
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className="block text-left text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Trigger Container */}
      <div className={cn(
        "relative w-full bg-white border border-gray-200 rounded-lg shadow-sm flex items-center transition-colors",
        sizeClasses[size],
        disabled && "bg-gray-50 text-gray-400 cursor-not-allowed",
        error && "border-red-300 focus:ring-red-500",
        isOpen && "ring-2 ring-purple-500 border-transparent"
      )}>
        {/* Main clickable area */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="flex-1 flex items-center justify-start min-w-0 h-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent rounded-l-lg pl-3 text-left"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label ? `${label}-label` : undefined}
        >
          {renderSelectedValue()}
        </button>
        
        {/* Right side controls */}
        <div className="flex items-center h-full border-l border-gray-200">
          {clearable && (multiple ? (Array.isArray(value) && value.length > 0) : value) && (
            <button
              type="button"
              onClick={handleClear}
              className="px-2 h-full hover:bg-gray-50 transition-colors flex items-center justify-center"
              tabIndex={-1}
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className="px-3 h-full hover:bg-gray-50 transition-colors flex items-center justify-center rounded-r-lg"
            tabIndex={-1}
            aria-hidden="true"
          >
            <ChevronDown
              className={cn(
                "w-4 h-4 text-gray-400 transition-transform",
                isOpen && "transform rotate-180"
              )}
            />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg",
            dropdownClassName
          )}
          style={{ maxHeight: `calc(${maxHeight} + 60px)` }}
        >
          {/* Search Input - Only show if searchable */}
          {searchable && (
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setFocusedIndex(-1);
                  }}
                  placeholder={searchPlaceholder}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-left"
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight }}
            role="listbox"
            aria-multiselectable={multiple}
          >
            {loading ? (
              <div className="p-3 text-center text-gray-500 text-sm">
                Loading...
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-gray-500 text-sm">
                No options found
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = multiple
                  ? Array.isArray(value) && value.includes(option.value)
                  : value === option.value;
                const isFocused = index === focusedIndex;

                return (
                  <div
                    key={option.value}
                    ref={(el) => {
                      optionRefs.current[index] = el;
                    }}
                    onClick={() => !option.disabled && handleOptionSelect(option.value)}
                    className={cn(
                      "flex items-center justify-start px-3 py-2 text-sm cursor-pointer transition-colors",
                      option.disabled
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-900 hover:bg-purple-50",
                      isFocused && !option.disabled && "bg-purple-50",
                      isSelected && "bg-purple-100 text-purple-900"
                    )}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled}
                  >
                    {option.icon && (
                      <option.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="truncate text-left">{option.label}</div>
                      {option.description && (
                        <div className="text-xs text-gray-500 truncate mt-0.5 text-left">
                          {option.description}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Export both for backward compatibility
export const SearchableDropdown = Dropdown;
export default Dropdown;