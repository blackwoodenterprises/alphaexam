"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  required?: boolean;
  error?: string;
  clearable?: boolean;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "search";
  icon?: React.ComponentType<{ className?: string }>;
  onClear?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      required = false,
      error,
      clearable = false,
      size = "default",
      variant = "default",
      icon: Icon,
      onClear,
      value,
      disabled,
      placeholder,
      ...props
    },
    ref
  ) => {
    // Size classes matching dropdown component
    const sizeClasses = {
      sm: "h-8 px-3 text-sm",
      default: "h-10 px-3 text-sm",
      lg: "h-12 px-4 text-base",
    };

    // Adjust padding for icons
    const getInputClasses = () => {
      let paddingClass = sizeClasses[size];
      
      if (variant === "search" || Icon) {
        // Add left padding for icon
        paddingClass = paddingClass.replace("px-3", "pl-10 pr-3");
        if (size === "sm") paddingClass = paddingClass.replace("px-2", "pl-9 pr-2");
        if (size === "lg") paddingClass = paddingClass.replace("px-4", "pl-12 pr-4");
      }
      
      if (clearable && value) {
        // Add right padding for clear button
        paddingClass = paddingClass.replace(/pr-\d+/, "pr-10");
      }
      
      return paddingClass;
    };

    const handleClear = () => {
      if (onClear) {
        onClear();
      }
    };

    return (
      <div className={cn("relative", className)}>
        {/* Label */}
        {label && (
          <label className="block text-left text-sm font-medium text-gray-700 mb-1" suppressHydrationWarning>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {/* Icon */}
          {(variant === "search" || Icon) && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {variant === "search" ? (
                <Search className={cn(
                  "text-gray-400",
                  size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"
                )} />
              ) : Icon ? (
                <Icon className={cn(
                  "text-gray-400",
                  size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"
                )} />
              ) : null}
            </div>
          )}

          {/* Input */}
          <input
            type={type}
            className={cn(
              "w-full bg-white border border-gray-200 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
              getInputClasses(),
              disabled && "bg-gray-50 text-gray-400 cursor-not-allowed",
              error && "border-red-300 focus:ring-red-500"
            )}
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            ref={ref}
            {...props}
          />

          {/* Clear Button */}
          {clearable && value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
              tabIndex={-1}
            >
              <X className={cn(
                "text-gray-400",
                size === "sm" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-3 h-3"
              )} />
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export default Input;