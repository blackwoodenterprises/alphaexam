import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

async function checkAdminAccess() {
  const { userId } = await auth();

  console.log("Admin access check - userId:", userId);

  if (!userId) {
    console.log("No userId found, redirecting to sign-in");
    redirect("/sign-in");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true, firstName: true, lastName: true, email: true },
    });

    console.log("User found:", user);

    if (!user) {
      console.log("No user found in database, redirecting to home");
      redirect("/");
    }

    if (user.role !== "ADMIN") {
      console.log("User is not admin, role:", user.role, "redirecting to home");
      redirect("/");
    }

    console.log("Admin access granted for user:", user.email);
    return user;
  } catch (error) {
    console.error("Admin access check error:", error);
    redirect("/");
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await checkAdminAccess();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <AdminHeader user={user} />

      <div className="flex pt-16">
        {" "}
        {/* Add top padding for fixed header */}
        {/* Sidebar */}
        <AdminSidebar />
        {/* Main Content */}
        <main className="flex-1 ml-64">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
