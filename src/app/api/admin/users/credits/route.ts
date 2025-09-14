import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    await requireAdminAuth();

    const body = await request.json();
    const { userId, amount, reason, type } = body;

    if (!userId || !amount || !reason || !type) {
      return NextResponse.json(
        { error: "User ID, amount, reason, and type are required" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    let newCredits: number;
    let transactionType: "CREDIT_PURCHASE" | "ADMIN_CREDIT";

    if (type === "ADD") {
      newCredits = user.credits + amount;
      transactionType = "ADMIN_CREDIT";
    } else if (type === "DEDUCT") {
      if (user.credits < amount) {
        return NextResponse.json(
          { error: "Insufficient credits to deduct" },
          { status: 400 }
        );
      }
      newCredits = user.credits - amount;
      transactionType = "ADMIN_CREDIT";
    } else {
      return NextResponse.json(
        { error: "Invalid type. Must be ADD or DEDUCT" },
        { status: 400 }
      );
    }

    // Update user credits and create transaction record
    const [updatedUser, transaction] = await Promise.all([
      prisma.user.update({
        where: { id: userId },
        data: { credits: newCredits },
      }),
      prisma.transaction.create({
        data: {
          userId,
          type: transactionType,
          amount: type === "ADD" ? amount : -amount,
          credits: type === "ADD" ? amount : -amount,
          status: "COMPLETED",
          razorpayPaymentId: `admin_${Date.now()}`,
          description: `Admin ${type.toLowerCase()}: ${reason}`,
        },
      }),
    ]);

    return NextResponse.json({
      user: updatedUser,
      transaction,
      message: `Successfully ${type === "ADD" ? "added" : "deducted"} ${amount} credits`,
    });
  } catch (error) {
    console.error("Error updating user credits:", error);
    
    // Handle authentication errors specifically
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }
      if (error.message === "Admin access required") {
        return NextResponse.json(
          { error: "Admin access required" },
          { status: 403 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to update user credits" },
      { status: 500 }
    );
  }
}
