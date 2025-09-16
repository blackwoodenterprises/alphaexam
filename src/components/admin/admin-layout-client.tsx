"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
}

export function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Set initial sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true); // Always open on desktop
      } else {
        setSidebarOpen(false); // Collapsed on mobile by default
      }
    };

    // Set initial state
    handleResize();

    // Listen for window resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
      {/* Admin Header */}
      <AdminHeader user={user} onToggleSidebar={toggleSidebar} />

      <div className="flex pt-16">
        {/* Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        
        {/* Main Content */}
        <main
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out",
            "lg:ml-64", // Always account for sidebar on desktop
            "ml-0" // No margin on mobile
          )}
        >
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}