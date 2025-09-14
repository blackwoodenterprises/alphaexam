import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

interface ExamAttemptWithExam {
  id: string;
  totalMarks: number | null;
  percentage: number | null;
  status: string;
  createdAt: Date;
  answers?: unknown[];
  exam: {
    title: string;
    description: string | null;
  };
}

export const runtime = 'nodejs';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        examAttempts: {
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            exam: {
              select: {
                title: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Transform exam attempts to include calculated fields
    const transformedExamAttempts = user.examAttempts.map((attempt: ExamAttemptWithExam) => ({
      id: attempt.id,
      score: attempt.totalMarks || 0,
      totalQuestions: attempt.answers?.length || 0,
      totalMarks: attempt.totalMarks || 0,
      percentage: attempt.percentage || 0,
      status: attempt.status,
      createdAt: attempt.createdAt,
      exam: {
        title: attempt.exam.title,
        subject: attempt.exam.description || 'General',
      },
    }));

    return NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        credits: user.credits,
      },
      examAttempts: transformedExamAttempts,
    });

  } catch (error) {
    console.error('Get user profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}