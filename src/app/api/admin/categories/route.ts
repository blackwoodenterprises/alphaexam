import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireAdminAuth();

    const categories = await prisma.category.findMany({
      include: {
        subcategories: {
          include: {
            _count: {
              select: {
                questions: true,
              },
            },
          },
        },
        _count: {
          select: {
            questions: true,
            subcategories: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminAuth();

    const body = await request.json();
    const { name, description, type, parentCategory } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 }
      );
    }

    if (type === "MAIN") {
      // Create main category
      const category = await prisma.category.create({
        data: {
          name,
          description,
        },
      });

      return NextResponse.json(category);
    } else if (type === "SUB") {
      // Create subcategory
      if (!parentCategory) {
        return NextResponse.json(
          { error: "Parent category is required for subcategories" },
          { status: 400 }
        );
      }

      const parentCat = await prisma.category.findFirst({
        where: {
          OR: [
            { id: parentCategory },
            { name: { equals: parentCategory, mode: "insensitive" } },
          ],
        },
      });

      if (!parentCat) {
        return NextResponse.json(
          { error: "Parent category not found" },
          { status: 404 }
        );
      }

      const subcategory = await prisma.subcategory.create({
        data: {
          name,
          description,
          categoryId: parentCat.id,
        },
      });

      return NextResponse.json(subcategory);
    }

    return NextResponse.json(
      { error: "Invalid category type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdminAuth();

    const body = await request.json();
    const { id, name, description, type } = body;

    if (!id || !name) {
      return NextResponse.json(
        { error: "ID and name are required" },
        { status: 400 }
      );
    }

    if (type === "MAIN") {
      const category = await prisma.category.update({
        where: { id },
        data: { name, description },
      });

      return NextResponse.json(category);
    } else if (type === "SUB") {
      const subcategory = await prisma.subcategory.update({
        where: { id },
        data: { name, description },
      });

      return NextResponse.json(subcategory);
    }

    return NextResponse.json(
      { error: "Invalid category type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdminAuth();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id || !type) {
      return NextResponse.json(
        { error: "ID and type are required" },
        { status: 400 }
      );
    }

    if (type === "MAIN") {
      // Check if category has questions or subcategories
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              questions: true,
              subcategories: true,
            },
          },
        },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }

      if (category._count.questions > 0 || category._count.subcategories > 0) {
        return NextResponse.json(
          { error: "Cannot delete category with questions or subcategories" },
          { status: 400 }
        );
      }

      await prisma.category.delete({
        where: { id },
      });
    } else if (type === "SUB") {
      // Check if subcategory has questions
      const subcategory = await prisma.subcategory.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              questions: true,
            },
          },
        },
      });

      if (!subcategory) {
        return NextResponse.json(
          { error: "Subcategory not found" },
          { status: 404 }
        );
      }

      if (subcategory._count.questions > 0) {
        return NextResponse.json(
          { error: "Cannot delete subcategory with questions" },
          { status: 400 }
        );
      }

      await prisma.subcategory.delete({
        where: { id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
