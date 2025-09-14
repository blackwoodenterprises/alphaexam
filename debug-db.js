const { PrismaClient } = require('@prisma/client');

async function debugDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Connecting to database...');
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Check exam categories
    console.log('\n📂 Checking ExamCategory table:');
    const examCategories = await prisma.examCategory.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        _count: {
          select: {
            exams: true
          }
        }
      }
    });
    console.log(`Found ${examCategories.length} exam categories:`);
    examCategories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat._count.exams} exams)`);
    });
    
    // Check exams
    console.log('\n📝 Checking Exam table:');
    const exams = await prisma.exam.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        isActive: true,
        examCategory: {
          select: {
            name: true
          }
        }
      },
      take: 10
    });
    console.log(`Found ${exams.length} active exams:`);
    exams.forEach(exam => {
      console.log(`  - ${exam.title} (Category: ${exam.examCategory?.name || 'None'})`);
    });
    
    // Check total counts
    console.log('\n📊 Database Statistics:');
    const totalExamCategories = await prisma.examCategory.count();
    const totalExams = await prisma.exam.count();
    const activeExams = await prisma.exam.count({ where: { isActive: true } });
    
    console.log(`Total Exam Categories: ${totalExamCategories}`);
    console.log(`Total Exams: ${totalExams}`);
    console.log(`Active Exams: ${activeExams}`);
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Disconnected from database');
  }
}

debugDatabase().catch(console.error);