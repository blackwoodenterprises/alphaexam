import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { UserRole } from "@prisma/client";

export async function getUserFromDB() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        _count: {
          select: {
            examAttempts: true,
            transactions: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user from database:", error);
    return null;
  }
}

export async function createOrUpdateUser() {
  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    return null;
  }

  try {
    // First check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id }
    });

    if (existingUser) {
      // User exists, just update their info from Clerk
      const user = await prisma.user.update({
        where: { clerkId: clerkUser.id },
        data: {
          email: clerkUser.emailAddresses[0]?.emailAddress || existingUser.email,
          firstName: clerkUser.firstName || existingUser.firstName,
          lastName: clerkUser.lastName || existingUser.lastName,
          phoneNumber: clerkUser.phoneNumbers[0]?.phoneNumber || existingUser.phoneNumber,
        },
      });
      return user;
    }

    // User doesn't exist, create new user
    const user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        phoneNumber: clerkUser.phoneNumbers[0]?.phoneNumber || null,
        role: UserRole.STUDENT,
        // credits will default to 0.0 as defined in schema
        onboardingComplete: false,
      },
    });

    return user;
  } catch (error) {
    console.error("Error creating/updating user:", error);
    return null;
  }
}

export async function requireAuth() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }
  
  return userId;
}

export async function requireAdminAuth() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true },
  });

  if (!user || user.role !== UserRole.ADMIN) {
    throw new Error("Admin access required");
  }

  return user;
}

export async function isAdmin(userId?: string): Promise<boolean> {
  if (!userId) {
    const { userId: authUserId } = await auth();
    if (!authUserId) return false;
    userId = authUserId;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });

    return user?.role === UserRole.ADMIN;
  } catch {
    return false;
  }
}
