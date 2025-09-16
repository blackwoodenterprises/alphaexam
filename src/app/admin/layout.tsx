import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { AdminLayoutClient } from "@/components/admin/admin-layout-client";

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

  return <AdminLayoutClient user={user}>{children}</AdminLayoutClient>;
}
