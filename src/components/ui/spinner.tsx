"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SpinnerProps {
  size?: "sm" | "default" | "lg" | "xl";
  className?: string;
  color?: "primary" | "white" | "gray";
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = "default", className, color = "primary", ...props }, ref) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      default: "w-6 h-6",
      lg: "w-8 h-8",
      xl: "w-12 h-12",
    };

    const colorClasses = {
      primary: "border-purple-600",
      white: "border-white",
      gray: "border-gray-600",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "animate-spin rounded-full border-2 border-solid border-t-transparent",
          sizeClasses[size],
          colorClasses[color],
          className
        )}
        {...props}
      />
    );
  }
);

Spinner.displayName = "Spinner";

export { Spinner };

// Loading component with spinner and optional text
export interface LoadingProps {
  size?: "sm" | "default" | "lg" | "xl";
  text?: string;
  className?: string;
  spinnerColor?: "primary" | "white" | "gray";
  center?: boolean;
}

export function Loading({
  size = "default",
  text = "Loading...",
  className,
  spinnerColor = "primary",
  center = true,
}: LoadingProps) {
  const containerClasses = center
    ? "flex flex-col items-center justify-center space-y-2"
    : "flex items-center space-x-2";

  return (
    <div className={cn(containerClasses, className)}>
      <Spinner size={size} color={spinnerColor} />
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  );
}

// Page loading component for full page loading states
export function PageLoading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loading size="lg" text={text} />
    </div>
  );
}

// Card loading component for loading states within cards
export function CardLoading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="p-8 flex items-center justify-center">
      <Loading size="default" text={text} />
    </div>
  );
}