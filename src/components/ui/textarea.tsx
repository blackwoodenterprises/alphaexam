"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  required?: boolean;
  error?: string;
  size?: "sm" | "default" | "lg";
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      required = false,
      error,
      size = "default",
      disabled,
      placeholder,
      rows = 3,
      ...props
    },
    ref
  ) => {
    // Size classes matching input component
    const sizeClasses = {
      sm: "px-2 py-1 text-sm",
      default: "px-3 py-2 text-sm",
      lg: "px-4 py-3 text-base",
    };

    return (
      <div className={cn("relative", className)}>
        {/* Label */}
        {label && (
          <label className="block text-left text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Textarea */}
        <textarea
          className={cn(
            "w-full bg-white border border-gray-200 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical",
            sizeClasses[size],
            disabled && "bg-gray-50 text-gray-400 cursor-not-allowed",
            error && "border-red-300 focus:ring-red-500"
          )}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          ref={ref}
          {...props}
        />

        {/* Error Message */}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
export default Textarea;