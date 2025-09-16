"use client";

import { UserButton } from "@clerk/nextjs";
import { Shield, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  onToggleSidebar?: () => void;
}

export function AdminHeader({ user, onToggleSidebar }: AdminHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo and Admin Badge */}
        <div className="flex items-center space-x-4">
          {/* Hamburger Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden p-2"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AlphaExam Admin
              </h1>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>

            {/* User Button */}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
