import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    await requireAdminAuth();

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

    // Create question
    const question = await prisma.question.create({
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
      message: 'Question created successfully',
      question 
    });

  } catch (error: unknown) {
    console.error('Create question error:', error);
    
    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    await requireAdminAuth();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const categoryId = searchParams.get('categoryId');
    const subcategoryId = searchParams.get('subcategoryId');
    const difficultyLevel = searchParams.get('difficultyLevel');
    const questionClass = searchParams.get('class');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: {
      categoryId?: string;
      subcategoryId?: string;
      difficultyLevel?: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
      class?: number;
      OR?: Array<{
        questionText?: { contains: string; mode: 'insensitive' };
        tags?: { has: string };
      }>;
    } = {};
    
    if (categoryId) where.categoryId = categoryId;
    if (subcategoryId) where.subcategoryId = subcategoryId;
    if (difficultyLevel) where.difficultyLevel = difficultyLevel as 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
    if (questionClass) where.class = parseInt(questionClass);
    if (search) {
      where.OR = [
        { questionText: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.question.count({ where }),
    ]);

    return NextResponse.json({ 
      questions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });

  } catch (error: unknown) {
    console.error('Get questions error:', error);
    
    if (error instanceof Error && error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}
