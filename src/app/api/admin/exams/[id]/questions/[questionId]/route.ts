import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; questionId: string }> }
) {
  try {
    // Check admin authentication
    await requireAdminAuth();

    const { id: examId, questionId } = await params;

    if (!examId || !questionId) {
      return NextResponse.json(
        { error: 'Exam ID and Question ID are required' },
        { status: 400 }
      );
    }

    // Verify the exam question exists
    const examQuestion = await prisma.examQuestion.findFirst({
      where: {
        examId,
        id: questionId,
      },
      include: {
        exam: {
          select: {
            title: true,
          },
        },
        question: {
          select: {
            questionText: true,
          },
        },
      },
    });

    if (!examQuestion) {
      return NextResponse.json(
        { error: 'Question not found in this exam' },
        { status: 404 }
      );
    }

    // Delete the exam question relationship
    await prisma.examQuestion.delete({
      where: {
        id: questionId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Question removed from exam successfully',
    });

  } catch (error: unknown) {
    console.error('Delete exam question error:', error);
    
    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    return NextResponse.json(
      { error: 'Failed to remove question from exam' },
      { status: 500 }
    );
  }
}