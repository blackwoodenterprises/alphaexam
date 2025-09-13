"use client";

import { ReactNode } from "react";
import { Button } from "./button";
import { X } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  children: ReactNode;
  className?: string;
}

export function Dialog({ isOpen, children, className = "" }: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg max-w-md w-full ${className}`}>
        {children}
      </div>
    </div>
  );
}

interface DialogHeaderProps {
  children: ReactNode;
  onClose?: () => void;
}

export function DialogHeader({ children, onClose }: DialogHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b">
      <div>{children}</div>
      {onClose && (
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-lg font-semibold text-gray-900">{children}</h2>;
}

export function DialogDescription({ children }: { children: ReactNode }) {
  return <p className="text-sm text-gray-600 mt-1">{children}</p>;
}

export function DialogContent({ children }: { children: ReactNode }) {
  return <div className="p-6">{children}</div>;
}

export function DialogFooter({ children }: { children: ReactNode }) {
  return <div className="flex justify-end space-x-2 p-6 border-t bg-gray-50">{children}</div>;
}

// Confirmation Dialog Component
interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "default";
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  variant = "default"
}: ConfirmationDialogProps) {
  return (
    <Dialog isOpen={isOpen}>
      <DialogHeader onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <DialogDescription>{description}</DialogDescription>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          className={variant === "danger" ? "bg-red-600 hover:bg-red-700 text-white" : ""}
        >
          {isLoading ? "Loading..." : confirmText}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}