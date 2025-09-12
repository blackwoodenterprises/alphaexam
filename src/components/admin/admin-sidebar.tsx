"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileQuestion,
  GraduationCap,
  Users,
  FolderTree,
  Settings,
  BookOpen,
  BarChart3,
  CreditCard,
  Home,
} from "lucide-react";

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

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto">
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
                  const isActive = pathname === item.href;

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
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

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Quick Stats
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Active Users</span>
              <span className="font-medium text-gray-900">1,247</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Total Questions</span>
              <span className="font-medium text-gray-900">45,892</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Exams Today</span>
              <span className="font-medium text-gray-900">128</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
