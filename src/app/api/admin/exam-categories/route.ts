import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireAdminAuth();

    const examCategories = await prisma.examCategory.findMany({
      include: {
        _count: {
          select: {
            exams: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(examCategories);
  } catch (error) {
    console.error("Error fetching exam categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch exam categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminAuth();

    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Check if exam category with same name already exists
    const existingCategory = await prisma.examCategory.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Exam category with this name already exists" },
        { status: 400 }
      );
    }

    const examCategory = await prisma.examCategory.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(examCategory);
  } catch (error) {
    console.error("Error creating exam category:", error);
    return NextResponse.json(
      { error: "Failed to create exam category" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdminAuth();

    const body = await request.json();
    const { id, name, description } = body;

    if (!id || !name) {
      return NextResponse.json(
        { error: "ID and name are required" },
        { status: 400 }
      );
    }

    // Check if exam category exists
    const existingCategory = await prisma.examCategory.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Exam category not found" },
        { status: 404 }
      );
    }

    // Check if another category with same name exists (excluding current one)
    const duplicateCategory = await prisma.examCategory.findFirst({
      where: {
        name,
        NOT: { id },
      },
    });

    if (duplicateCategory) {
      return NextResponse.json(
        { error: "Exam category with this name already exists" },
        { status: 400 }
      );
    }

    const examCategory = await prisma.examCategory.update({
      where: { id },
      data: { name, description },
    });

    return NextResponse.json(examCategory);
  } catch (error) {
    console.error("Error updating exam category:", error);
    return NextResponse.json(
      { error: "Failed to update exam category" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdminAuth();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    // Check if exam category exists and has exams
    const examCategory = await prisma.examCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            exams: true,
          },
        },
      },
    });

    if (!examCategory) {
      return NextResponse.json(
        { error: "Exam category not found" },
        { status: 404 }
      );
    }

    if (examCategory._count.exams > 0) {
      return NextResponse.json(
        { error: "Cannot delete exam category with associated exams" },
        { status: 400 }
      );
    }

    await prisma.examCategory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting exam category:", error);
    return NextResponse.json(
      { error: "Failed to delete exam category" },
      { status: 500 }
    );
  }
}