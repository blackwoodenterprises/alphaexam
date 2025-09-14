"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, CreditCard, Save } from "lucide-react";

interface AddCreditsModalProps {
  userId: string;
  userName: string;
}

export function AddCreditsModal({ userId, userName }: AddCreditsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    reason: "",
  });

  // Form validation state
  const isFormValid = () => {
    return (
      formData.amount &&
      parseInt(formData.amount) > 0 &&
      formData.reason.trim().length >= 20
    );
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Form should already be validated by button state, but double-check
    if (!isFormValid()) {
      setIsSubmitting(false);
      return;
    }

    const requestData = {
      userId,
      amount: parseInt(formData.amount),
      reason: formData.reason.trim(),
      type: "ADD",
    };

    console.log("Sending request data:", requestData);
    console.log("Form data state:", formData);

    try {
      const response = await fetch("/api/admin/users/credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Credits updated successfully:", data);
        setFormData({ amount: "", reason: "" });
        setIsOpen(false);
        // Refresh the page to show updated credits
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Failed to update credits:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          requestData: requestData
        });
        alert(`Error: ${errorData.error || 'Failed to update credits'}\n\nRequest data: ${JSON.stringify(requestData, null, 2)}`);
      }
    } catch (error) {
      console.error("Error updating credits:", error);
    } finally {
      setIsSubmitting(false);
    }
  };



  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-gray-600 border-gray-300 hover:bg-gray-50"
      >
        <CreditCard className="w-4 h-4 mr-1" />
        Add Credit
      </Button>
    );
  }



  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-300">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800">Add Credit</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Adjusting credits for: <span className="font-medium text-gray-900">{userName}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="Enter amount"
                min="1"
                required
                size="lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason *
              </label>
              <Textarea
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Enter reason for credit adjustment (minimum 20 characters)"
                required
                rows={3}
                size="lg"
                minLength={20}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.reason.length}/20 characters minimum
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-300">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
                size="lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !isFormValid()}
                size="lg"
                className={`text-white ${
                  isFormValid() && !isSubmitting
                    ? "bg-gray-700 hover:bg-gray-800"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Add Credits
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
