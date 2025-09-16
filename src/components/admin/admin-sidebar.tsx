"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileQuestion,
  GraduationCap,
  Users,
  FolderTree,
  Settings,
  BarChart3,
  CreditCard,
  Palette,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        description: "Overview and analytics",
      },
    ],
  },
  {
    title: "Content Management",
    items: [
      {
        name: "Questions",
        href: "/admin/questions",
        icon: FileQuestion,
        description: "Manage question bank",
        badge: "AI Powered",
      },
      {
        name: "Exams",
        href: "/admin/exams",
        icon: GraduationCap,
        description: "Create and manage mock tests",
      },
      {
        name: "Categories",
        href: "/admin/categories",
        icon: FolderTree,
        description: "Organize subjects and topics",
      },
      {
        name: "Exam Categories",
        href: "/admin/exam-categories",
        icon: GraduationCap,
        description: "Manage exam categories",
      },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        name: "Students",
        href: "/admin/users",
        icon: Users,
        description: "Manage user accounts",
      },
      {
        name: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
        description: "Performance insights",
      },
      {
        name: "Transactions",
        href: "/admin/transactions",
        icon: CreditCard,
        description: "Payment and credits",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        name: "Settings",
        href: "/admin/settings",
        icon: Settings,
        description: "System configuration",
      },
    ],
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto z-40 transition-transform duration-300 ease-in-out",
          "lg:translate-x-0", // Always visible on large screens
          isOpen ? "translate-x-0" : "-translate-x-full" // Mobile behavior
        )}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4 border-b border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4">
          {/* Navigation */}
          <nav className="space-y-6">
            {navigationItems.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = isClient && pathname === item.href;

                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => {
                            // Close sidebar on mobile when navigating
                            if (window.innerWidth < 1024) {
                              onClose();
                            }
                          }}
                          className={cn(
                            "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                            isActive
                              ? "bg-purple-50 text-purple-700 border-r-2 border-purple-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          )}
                        >
                          <item.icon
                            className={cn(
                              "mr-3 h-5 w-5 flex-shrink-0",
                              isActive
                                ? "text-purple-600"
                                : "text-gray-400 group-hover:text-gray-500"
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="truncate">{item.name}</span>
                              {item.badge && (
                                <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

    </>
  );
}
