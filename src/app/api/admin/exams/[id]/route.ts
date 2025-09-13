import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check admin authentication
    await requireAdminAuth();

    const { id } = await params;
    const body = await request.json();
    const {
      title,
      description,
      examCategoryId,
      duration,
      questionsToServe,
      price,
      isFree,
      isActive,
      imageUrl,
    } = body;

    // Validate required fields
    if (!title || !examCategoryId || !duration) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if exam exists
    const existingExam = await prisma.exam.findUnique({
      where: { id },
    });

    if (!existingExam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // Validate exam category exists
    const examCategory = await prisma.examCategory.findUnique({
      where: { id: examCategoryId }
    });

    if (!examCategory) {
      return NextResponse.json({ error: 'Invalid exam category' }, { status: 400 });
    }

    // Update exam
    const updatedExam = await prisma.exam.update({
      where: { id },
      data: {
        title,
        description: description || null,
        examCategoryId,
        duration: parseInt(duration),
        questionsToServe: questionsToServe ? parseInt(questionsToServe) : null,
        price: isFree ? 0 : parseFloat(price),
        isFree: Boolean(isFree),
        isActive: Boolean(isActive),
        imageUrl: imageUrl || null,
        updatedAt: new Date(),
      },
      include: {
        examCategory: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            examQuestions: true,
            examAttempts: true,
          },
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Exam updated successfully',
      exam: updatedExam,
    });

  } catch (error: unknown) {
    console.error('Update exam error:', error);
    
    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    return NextResponse.json(
      { error: 'Failed to update exam', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check admin authentication
    await requireAdminAuth();

    const { id } = await params;

    // Check if exam exists
    const existingExam = await prisma.exam.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            examAttempts: true,
            examQuestions: true,
          },
        },
      },
    });

    if (!existingExam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // Check if exam has attempts (optional: prevent deletion if there are attempts)
    if (existingExam._count.examAttempts > 0) {
      return NextResponse.json(
        { error: 'Cannot delete exam with existing attempts' },
        { status: 400 }
      );
    }

    // Delete exam (this will cascade delete exam questions due to foreign key constraints)
    await prisma.exam.delete({
      where: { id },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Exam deleted successfully',
    });

  } catch (error: unknown) {
    console.error('Delete exam error:', error);
    
    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    return NextResponse.json(
      { error: 'Failed to delete exam', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check admin authentication
    await requireAdminAuth();

    const { id } = await params;

    // Get exam with all related data
    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        examCategory: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        examQuestions: {
          include: {
            question: {
              select: {
                id: true,
                questionText: true,
                imageUrl: true,
                difficultyLevel: true,
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
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            examQuestions: true,
            examAttempts: true,
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    return NextResponse.json({ exam });

  } catch (error: unknown) {
    console.error('Get exam error:', error);
    
    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch exam' },
      { status: 500 }
    );
  }
}