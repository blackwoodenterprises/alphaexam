import { prisma } from "@/lib/prisma";
import { QuestionsPageClient } from "@/components/admin/questions-page-client";


async function getQuestions() {
  try {
    const questions = await prisma.question.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
        subcategory: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            examQuestions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20, // Limit for performance
    });

    return questions.map(question => ({
      ...question,
      explanation: question.explanation ?? undefined,
      adminNotes: question.adminNotes ?? undefined,
      figures: question.figures as { bbox: number[]; confidence: number; url: string; }[] | undefined,
      apiResponse: question.apiResponse as Record<string, unknown> | undefined,
    }));
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            questions: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function QuestionsPage() {
  const questions = await getQuestions();
  const categories = await getCategories();
  const totalQuestionsCount = await prisma.question.count();

  return (
    <QuestionsPageClient 
      questions={questions} 
      categories={categories}
      totalQuestionsCount={totalQuestionsCount} 
    />
  );
}
