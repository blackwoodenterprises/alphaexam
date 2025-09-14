import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test exam categories
    const examCategories = await prisma.examCategory.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
      orderBy: { name: "asc" },
    });
    console.log('📂 Found exam categories:', examCategories.length);
    
    // Test exams
    const exams = await prisma.exam.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        isActive: true,
        examCategory: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: 5,
    });
    console.log('📝 Found active exams:', exams.length);
    
    // Return debug info
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
      examCategories: {
        count: examCategories.length,
        data: examCategories,
      },
      exams: {
        count: exams.length,
        data: exams,
      },
    });
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}