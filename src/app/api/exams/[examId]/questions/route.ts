import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { examId } = await params;

    // Verify exam exists and is active
    const exam = await prisma.exam.findUnique({
      where: {
        id: examId,
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        questionsToServe: true,
        price: true,
        isFree: true,
        duration: true,
      },
    });

    if (!exam) {
      return NextResponse.json(
        { error: "Exam not found or inactive" },
        { status: 404 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, credits: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has sufficient credits (unless exam is free)
    if (!exam.isFree && user.credits < exam.price) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 403 }
      );
    }

    // Check if user already has an active attempt
    const existingAttempt = await prisma.examAttempt.findFirst({
      where: {
        examId,
        userId: user.id,
        status: "IN_PROGRESS",
      },
      select: {
        id: true,
        servedQuestions: true,
      },
    });

    if (existingAttempt) {
      // If attempt exists, get the questions that were already served
      const examQuestions = await prisma.examQuestion.findMany({
        where: { 
          examId,
          questionId: { in: existingAttempt.servedQuestions }
        },
        include: {
          question: {
            select: {
              id: true,
              questionText: true,
              optionA: true,
              optionB: true,
              optionC: true,
              optionD: true,
              imageUrl: true,
              figures: true,
            },
          },
        },
        orderBy: { order: "asc" },
      });

      const questions = examQuestions.map((eq) => eq.question);

      return NextResponse.json({
        exam: {
          id: exam.id,
          title: exam.title,
          duration: exam.duration,
          questionsToServe: exam.questionsToServe,
        },
        questions,
      });
    }

    // Get questions for this exam
    const examQuestions = await prisma.examQuestion.findMany({
      where: { examId },
      include: {
        question: {
          select: {
            id: true,
            questionText: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
            imageUrl: true,
            figures: true,
          },
        },
      },
      orderBy: { order: "asc" },
      take: exam.questionsToServe || undefined,
    });

    if (examQuestions.length < (exam.questionsToServe || 0)) {
      return NextResponse.json(
        { error: "Not enough questions available for this exam" },
        { status: 400 }
      );
    }

    // Extract questions from the exam questions
    const questions = examQuestions.map((eq) => eq.question);
    const servedQuestionIds = questions.map((q) => q.id);

    // Use transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Create exam attempt with served questions
      await tx.examAttempt.create({
        data: {
          userId: user.id,
          examId,
          creditsUsed: exam.isFree ? 0 : exam.price,
          servedQuestions: servedQuestionIds,
        },
      });

      // Deduct credits and create transaction record if exam is not free
      if (!exam.isFree) {
        // Deduct credits from user account
        await tx.user.update({
          where: { id: user.id },
          data: {
            credits: {
              decrement: exam.price,
            },
          },
        });

        // Create transaction record for the credit deduction
        await tx.transaction.create({
          data: {
            userId: user.id,
            type: "EXAM_PAYMENT",
            amount: exam.price,
            credits: exam.price,
            status: "COMPLETED",
            description: `Credits deducted for exam: ${exam.title}`,
          },
        });
      }
    });

    return NextResponse.json({
      exam: {
        id: exam.id,
        title: exam.title,
        duration: exam.duration,
        questionsToServe: exam.questionsToServe,
      },
      questions,
    });
  } catch (error) {
    console.error("Error fetching exam questions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}