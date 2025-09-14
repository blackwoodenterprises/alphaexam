import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const bulkAddQuestionsSchema = z.object({
  examId: z.string().min(1, "Exam ID is required"),
  questionIds: z.array(z.string()).min(1, "At least one question ID is required"),
  marks: z.number().min(0, "Marks must be non-negative").default(1),
  negativeMarks: z.number().min(0, "Negative marks must be non-negative").default(0),
});

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    await requireAdminAuth();

    // Parse and validate request body
    const body = await request.json();
    const validatedData = bulkAddQuestionsSchema.parse(body);
    const { examId, questionIds, marks, negativeMarks } = validatedData;

    // Verify exam exists and user has permission
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        examQuestions: {
          select: {
            questionId: true,
            order: true,
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json(
        { error: "Exam not found" },
        { status: 404 }
      );
    }

    // Verify all questions exist
    const questions = await prisma.question.findMany({
      where: {
        id: {
          in: questionIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (questions.length !== questionIds.length) {
      const foundQuestionIds = questions.map(q => q.id);
      const missingQuestionIds = questionIds.filter(id => !foundQuestionIds.includes(id));
      return NextResponse.json(
        { 
          error: "Some questions not found",
          missingQuestionIds 
        },
        { status: 400 }
      );
    }

    // Check for existing questions in the exam and filter out duplicates
    const existingQuestionIds = exam.examQuestions.map(eq => eq.questionId);
    const duplicateQuestionIds = questionIds.filter(id => existingQuestionIds.includes(id));
    const newQuestionIds = questionIds.filter(id => !existingQuestionIds.includes(id));
    
    // If no new questions to add, return success with appropriate message
    if (newQuestionIds.length === 0) {
      return NextResponse.json({
        success: true,
        message: "All selected questions are already in this exam",
        data: {
          examId,
          addedQuestions: 0,
          skippedQuestions: duplicateQuestionIds.length,
          totalQuestions: exam.examQuestions.length,
        },
      });
    }

    // Get the next order number for new questions
    const maxOrder = exam.examQuestions.length > 0 
      ? Math.max(...exam.examQuestions.map(eq => eq.order))
      : 0;

    // Prepare exam questions data only for new questions
    const examQuestionsData = newQuestionIds.map((questionId, index) => ({
      examId,
      questionId,
      marks,
      negativeMarks,
      order: maxOrder + index + 1,
    }));

    // Create exam questions in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create all exam questions
      const createdExamQuestions = await tx.examQuestion.createMany({
        data: examQuestionsData,
      });

      // Get the updated exam with question count
      const updatedExam = await tx.exam.findUnique({
        where: { id: examId },
        include: {
          _count: {
            select: {
              examQuestions: true,
            },
          },
        },
      });

      return {
        createdCount: createdExamQuestions.count,
        totalQuestions: updatedExam?._count.examQuestions || 0,
      };
    });

    // Create appropriate success message
    let message = `Successfully added ${result.createdCount} questions to the exam`;
    if (duplicateQuestionIds.length > 0) {
      message += ` (${duplicateQuestionIds.length} questions were already in the exam and were skipped)`;
    }

    return NextResponse.json({
      success: true,
      message,
      data: {
        examId,
        addedQuestions: result.createdCount,
        skippedQuestions: duplicateQuestionIds.length,
        totalQuestions: result.totalQuestions,
      },
    });

  } catch (error) {
    console.error("Error in bulk add questions:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Invalid request data",
          details: error.issues 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}