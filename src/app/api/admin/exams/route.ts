import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { requireAdminAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const adminUser = await requireAdminAuth();

    const body = await request.json();
    const {
      title,
      description,
      category,
      duration,
      price,
      isFree,
      isActive,
      imageUrl,
      questionIds = []
    } = body;

    // Validate required fields
    if (!title || !category || !duration) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate category
    if (!['OLYMPIAD', 'JEE', 'NEET', 'OTHER'].includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    // Create exam
    const exam = await prisma.exam.create({
      data: {
        title,
        description: description || null,
        category,
        duration: parseInt(duration),
        price: isFree ? 0 : parseFloat(price),
        isFree: Boolean(isFree),
        isActive: Boolean(isActive),
        imageUrl: imageUrl || null,
        createdById: adminUser.id,
      },
    });

    // Add questions to exam if provided
    if (questionIds.length > 0) {
      const examQuestions = questionIds.map((questionId: string, index: number) => ({
        examId: exam.id,
        questionId,
        marks: 1.0, // Default marks
        negativeMarks: 0.25, // Default negative marks
        order: index + 1,
      }));

      await prisma.examQuestion.createMany({
        data: examQuestions,
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Exam created successfully',
      exam: {
        id: exam.id,
        title: exam.title,
        category: exam.category,
        duration: exam.duration,
        price: exam.price,
        isFree: exam.isFree,
        isActive: exam.isActive,
        questionsCount: questionIds.length,
      }
    });

  } catch (error: any) {
    console.error('Create exam error:', error);
    
    if (error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    return NextResponse.json(
      { error: 'Failed to create exam', details: error instanceof Error ? error.message : String(error) },
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
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (category) where.category = category;
    if (isActive !== null) where.isActive = isActive === 'true';
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [exams, total] = await Promise.all([
      prisma.exam.findMany({
        where,
        include: {
          createdBy: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          _count: {
            select: {
              examQuestions: true,
              examAttempts: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.exam.count({ where }),
    ]);

    return NextResponse.json({ 
      exams,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });

  } catch (error: any) {
    console.error('Get exams error:', error);
    
    if (error.message === 'Admin access required') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch exams' },
      { status: 500 }
    );
  }
}
