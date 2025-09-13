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
      imageUrl,
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      explanation,
      adminNotes,
      class: questionClass,
      difficultyLevel,
      status,
      tags,
      apiResponse,
      figures,
      categoryId,
      subcategoryId,
    } = body;

    // Validate required fields
    if (!imageUrl || !questionText || !optionA || !optionB || !optionC || !optionD || !correctAnswer || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate correct answer
    if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) {
      return NextResponse.json({ error: 'Invalid correct answer' }, { status: 400 });
    }

    // Validate difficulty level
    if (!['EASY', 'MEDIUM', 'HARD', 'EXPERT'].includes(difficultyLevel)) {
      return NextResponse.json({ error: 'Invalid difficulty level' }, { status: 400 });
    }

    // Validate status
    if (!['DRAFT', 'PUBLISHED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Check if question exists
    const existingQuestion = await prisma.question.findUnique({
      where: { id },
    });

    if (!existingQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Update question
    const question = await prisma.question.update({
      where: { id },
      data: {
        imageUrl,
        questionText,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        explanation: explanation || null,
        adminNotes: adminNotes || null,
        class: parseInt(questionClass),
        difficultyLevel,
        status,
        tags: Array.isArray(tags) ? tags : [],
        apiResponse: apiResponse || {},
        figures: figures || null,
        categoryId,
        subcategoryId: subcategoryId || null,
      },
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
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Question updated successfully',
      question 
    });

  } catch (error: unknown) {
    console.error('Update question error:', error);
    
    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check admin authentication
    await requireAdminAuth();

    const { id } = await params;

    // Check if question exists
    const existingQuestion = await prisma.question.findUnique({
      where: { id },
    });

    if (!existingQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Delete question
    await prisma.question.delete({
      where: { id },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Question deleted successfully'
    });

  } catch (error: unknown) {
    console.error('Delete question error:', error);
    
    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    );
  }
}