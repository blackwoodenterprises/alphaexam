import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const examCategories = await prisma.examCategory.findMany({
      include: {
        exams: {
          where: {
            isActive: true,
          },
          include: {
            _count: {
              select: {
                examAttempts: true,
                examQuestions: true,
              },
            },

          },
        },
        _count: {
          select: {
            exams: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    // Transform data to include statistics
    const categoriesWithStats = examCategories.map((category) => {
      const totalAttempts = category.exams.reduce(
        (sum, exam) => sum + exam._count.examAttempts,
        0
      );
      
      const totalQuestions = category.exams.reduce(
        (sum, exam) => sum + exam._count.examQuestions,
        0
      );

      const avgDuration = category.exams.length > 0 
        ? Math.round(category.exams.reduce((sum, exam) => sum + exam.duration, 0) / category.exams.length)
        : 0;



      return {
          id: category.id,
          name: category.name,
          description: category.description,
          examCount: category._count.exams,
          totalAttempts,
          totalQuestions,
          avgDuration,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        };
    });

    return NextResponse.json(categoriesWithStats);
  } catch (error) {
    console.error("Error fetching exam categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch exam categories" },
      { status: 500 }
    );
  }
}