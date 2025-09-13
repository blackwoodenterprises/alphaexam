import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

async function checkAdminAccess() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  let user;
  try {
    user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true, firstName: true, lastName: true, email: true },
    });
  } catch {
    redirect("/");
  }

  if (!user) {
    redirect("/");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return user;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await checkAdminAccess();

  return (
    <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
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
