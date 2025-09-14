"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

export interface DatePickerProps {
  value?: string; // ISO date string (YYYY-MM-DD)
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  minDate?: string; // ISO date string
  maxDate?: string; // ISO date string
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  className,
  size = "default",
  disabled = false,
  error,
  label,
  required = false,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize calendar to selected date or current date
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setCurrentMonth(date.getMonth());
      setCurrentYear(date.getFullYear());
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowYearDropdown(false);
        setShowMonthDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Size classes
  const sizeClasses = {
    sm: "h-8 text-sm px-3",
    default: "h-10 text-sm px-3",
    lg: "h-12 text-base px-4",
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday)
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Check if date is disabled
  const isDateDisabled = (day: number, month: number, year: number) => {
    const date = new Date(year, month, day);
    const dateString = date.toISOString().split('T')[0];
    
    if (minDate && dateString < minDate) return true;
    if (maxDate && dateString > maxDate) return true;
    
    return false;
  };

  // Handle date selection
  const handleDateSelect = (day: number) => {
    if (isDateDisabled(day, currentMonth, currentYear)) return;
    
    const date = new Date(currentYear, currentMonth, day);
    const dateString = date.toISOString().split('T')[0];
    onChange(dateString);
    setIsOpen(false);
  };

  // Navigate months
  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  // Generate year options (from 100 years ago to current year)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 100; year--) {
      years.push(year);
    }
    return years;
  };

  // Handle year selection
  const handleYearSelect = (year: number) => {
    setCurrentYear(year);
    setShowYearDropdown(false);
  };

  // Handle month selection
  const handleMonthSelect = (month: number) => {
    setCurrentMonth(month);
    setShowMonthDropdown(false);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = value && new Date(value).getDate() === day && 
                        new Date(value).getMonth() === currentMonth && 
                        new Date(value).getFullYear() === currentYear;
      const isDisabled = isDateDisabled(day, currentMonth, currentYear);
      const isToday = new Date().getDate() === day && 
                     new Date().getMonth() === currentMonth && 
                     new Date().getFullYear() === currentYear;

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateSelect(day)}
          disabled={isDisabled}
          className={cn(
            "w-8 h-8 text-sm rounded-md transition-colors flex items-center justify-center",
            isSelected && "bg-purple-600 text-white font-medium",
            !isSelected && !isDisabled && "hover:bg-purple-50 text-gray-700",
            !isSelected && isToday && "bg-purple-100 text-purple-700 font-medium",
            isDisabled && "text-gray-300 cursor-not-allowed"
          )}
        >
          {day}
        </button>
      );
    }

    return days;
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

      {/* Input Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-between transition-colors text-left",
          sizeClasses[size],
          disabled && "bg-gray-50 text-gray-400 cursor-not-allowed",
          error && "border-red-300 focus:ring-red-500",
          isOpen && "ring-2 ring-purple-500 border-transparent",
          !disabled && "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        )}
      >
        <span className={cn(
          value ? "text-gray-900" : "text-gray-500"
        )}>
          {value ? formatDate(value) : placeholder}
        </span>
        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
      </button>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Calendar Dropdown */}
      {isOpen && (
        <div 
          className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[280px]"
          onClick={(e) => {
            // Close dropdowns when clicking inside calendar but outside dropdown menus
            if (e.target === e.currentTarget) {
              setShowYearDropdown(false);
              setShowMonthDropdown(false);
            }
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            
            <div className="flex items-center space-x-2">
              {/* Month Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowMonthDropdown(!showMonthDropdown);
                    setShowYearDropdown(false);
                  }}
                  className="text-sm font-medium text-gray-900 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors"
                >
                  {MONTHS[currentMonth]}
                </button>
                {showMonthDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                    {MONTHS.map((month, index) => (
                      <button
                        key={month}
                        type="button"
                        onClick={() => handleMonthSelect(index)}
                        className={cn(
                          "block w-full text-left px-3 py-2 text-sm hover:bg-purple-50 transition-colors",
                          index === currentMonth && "bg-purple-100 text-purple-900"
                        )}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Year Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowYearDropdown(!showYearDropdown);
                    setShowMonthDropdown(false);
                  }}
                  className="text-sm font-medium text-gray-900 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors"
                >
                  {currentYear}
                </button>
                {showYearDropdown && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                    {generateYearOptions().map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => handleYearSelect(year)}
                        className={cn(
                          "block w-full text-left px-3 py-2 text-sm hover:bg-purple-50 transition-colors whitespace-nowrap",
                          year === currentYear && "bg-purple-100 text-purple-900"
                        )}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((day) => (
              <div key={day} className="w-8 h-6 text-xs font-medium text-gray-500 flex items-center justify-center">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays()}
          </div>
        </div>
      )}
    </div>
  );
}

export default DatePicker;