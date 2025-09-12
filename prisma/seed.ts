import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create a sample admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@alphaexam.in' },
    update: {},
    create: {
      clerkId: 'seed-admin-user', // Placeholder - will be updated when real admin signs up
      email: 'admin@alphaexam.in',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      credits: 1000,
    },
  });

  console.log('✅ Admin user created');

  // Create sample categories
  const mathCategory = await prisma.category.upsert({
    where: { name: 'Mathematics' },
    update: {},
    create: {
      name: 'Mathematics',
      description: 'Mathematical concepts and problem solving',
    },
  });

  const physicsCategory = await prisma.category.upsert({
    where: { name: 'Physics' },
    update: {},
    create: {
      name: 'Physics',
      description: 'Physics concepts and applications',
    },
  });

  const chemistryCategory = await prisma.category.upsert({
    where: { name: 'Chemistry' },
    update: {},
    create: {
      name: 'Chemistry',
      description: 'Chemistry concepts and reactions',
    },
  });

  const biologyCategory = await prisma.category.upsert({
    where: { name: 'Biology' },
    update: {},
    create: {
      name: 'Biology',
      description: 'Biology and life sciences',
    },
  });

  console.log('✅ Categories created');

  // Create subcategories
  const algebraSubcat = await prisma.subcategory.upsert({
    where: { name_categoryId: { name: 'Algebra', categoryId: mathCategory.id } },
    update: {},
    create: {
      name: 'Algebra',
      description: 'Algebraic equations and expressions',
      categoryId: mathCategory.id,
    },
  });

  const geometrySubcat = await prisma.subcategory.upsert({
    where: { name_categoryId: { name: 'Geometry', categoryId: mathCategory.id } },
    update: {},
    create: {
      name: 'Geometry',
      description: 'Geometric shapes and properties',
      categoryId: mathCategory.id,
    },
  });

  const calculusSubcat = await prisma.subcategory.upsert({
    where: { name_categoryId: { name: 'Calculus', categoryId: mathCategory.id } },
    update: {},
    create: {
      name: 'Calculus',
      description: 'Differential and integral calculus',
      categoryId: mathCategory.id,
    },
  });

  const mechanicsSubcat = await prisma.subcategory.upsert({
    where: { name_categoryId: { name: 'Mechanics', categoryId: physicsCategory.id } },
    update: {},
    create: {
      name: 'Mechanics',
      description: 'Classical mechanics and motion',
      categoryId: physicsCategory.id,
    },
  });

  const thermodynamicsSubcat = await prisma.subcategory.upsert({
    where: { name_categoryId: { name: 'Thermodynamics', categoryId: physicsCategory.id } },
    update: {},
    create: {
      name: 'Thermodynamics',
      description: 'Heat and energy transfer',
      categoryId: physicsCategory.id,
    },
  });

  console.log('✅ Subcategories created');

  // Create sample questions
  const sampleQuestions = [
    {
      imageUrl: 'https://via.placeholder.com/400x300?text=Math+Question+1',
      questionText: 'Solve the equation $x^2 + 5x + 6 = 0$ for real values of $x$.',
      optionA: '$x = -2, -3$',
      optionB: '$x = -1, -6$',
      optionC: '$x = 2, 3$',
      optionD: '$x = 1, 6$',
      correctAnswer: 'A' as const,
      explanation: 'Factor the quadratic: $(x+2)(x+3) = 0$, so $x = -2$ or $x = -3$.',
      class: 10,
      difficultyLevel: 'MEDIUM' as const,
      tags: ['quadratic', 'factoring', 'algebra'],
      categoryId: mathCategory.id,
      subcategoryId: algebraSubcat.id,
      apiResponse: {
        message: 'Processed successfully',
        success: true,
        transcription: {
          question_text: 'Solve the equation $x^2 + 5x + 6 = 0$ for real values of $x$.',
          options: {
            A: '$x = -2, -3$',
            B: '$x = -1, -6$',
            C: '$x = 2, 3$',
            D: '$x = 1, 6$'
          }
        }
      }
    },
    {
      imageUrl: 'https://via.placeholder.com/400x300?text=Physics+Question+1',
      questionText: 'A ball is thrown upward with an initial velocity of $20 \\text{ m/s}$. What is the maximum height reached? (Take $g = 10 \\text{ m/s}^2$)',
      optionA: '$10 \\text{ m}$',
      optionB: '$20 \\text{ m}$',
      optionC: '$30 \\text{ m}$',
      optionD: '$40 \\text{ m}$',
      correctAnswer: 'B' as const,
      explanation: 'Using $v^2 = u^2 + 2gh$, at maximum height $v = 0$: $0 = 20^2 - 2(10)h$, so $h = 20 \\text{ m}$.',
      class: 11,
      difficultyLevel: 'MEDIUM' as const,
      tags: ['kinematics', 'projectile', 'motion'],
      categoryId: physicsCategory.id,
      subcategoryId: mechanicsSubcat.id,
      apiResponse: {
        message: 'Processed successfully',
        success: true,
        transcription: {
          question_text: 'A ball is thrown upward with an initial velocity of $20 \\text{ m/s}$. What is the maximum height reached?',
          options: {
            A: '$10 \\text{ m}$',
            B: '$20 \\text{ m}$',
            C: '$30 \\text{ m}$',
            D: '$40 \\text{ m}$'
          }
        }
      }
    },
    {
      imageUrl: 'https://via.placeholder.com/400x300?text=Geometry+Question+1',
      questionText: 'Find the area of a triangle with sides $a = 3$, $b = 4$, and $c = 5$.',
      optionA: '$6 \\text{ sq units}$',
      optionB: '$12 \\text{ sq units}$',
      optionC: '$10 \\text{ sq units}$',
      optionD: '$15 \\text{ sq units}$',
      correctAnswer: 'A' as const,
      explanation: 'This is a right triangle (3-4-5). Area = $\\frac{1}{2} \\times 3 \\times 4 = 6$ square units.',
      class: 9,
      difficultyLevel: 'EASY' as const,
      tags: ['triangle', 'area', 'pythagorean'],
      categoryId: mathCategory.id,
      subcategoryId: geometrySubcat.id,
      apiResponse: {
        message: 'Processed successfully',
        success: true,
        transcription: {
          question_text: 'Find the area of a triangle with sides $a = 3$, $b = 4$, and $c = 5$.',
          options: {
            A: '$6 \\text{ sq units}$',
            B: '$12 \\text{ sq units}$',
            C: '$10 \\text{ sq units}$',
            D: '$15 \\text{ sq units}$'
          }
        }
      }
    }
  ];

  for (const questionData of sampleQuestions) {
    await prisma.question.create({
      data: questionData,
    });
  }

  console.log('✅ Sample questions created');

  // Create sample exams
  const olympiadExam = await prisma.exam.create({
    data: {
      title: 'Mathematical Olympiad Practice Test 1',
      description: 'A comprehensive practice test for mathematical olympiad preparation covering algebra, geometry, and number theory.',
      price: 50,
      duration: 180, // 3 hours
      isActive: true,
      isFree: false,
      category: 'OLYMPIAD',
      imageUrl: 'https://via.placeholder.com/400x200?text=Math+Olympiad',
      createdById: adminUser.id,
    },
  });

  const jeeExam = await prisma.exam.create({
    data: {
      title: 'JEE Main Physics Mock Test',
      description: 'Physics mock test designed for JEE Main preparation with questions from mechanics, thermodynamics, and waves.',
      price: 30,
      duration: 120, // 2 hours
      isActive: true,
      isFree: true,
      category: 'JEE',
      imageUrl: 'https://via.placeholder.com/400x200?text=JEE+Physics',
      createdById: adminUser.id,
    },
  });

  console.log('✅ Sample exams created');

  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📋 Summary:');
  console.log(`- ${await prisma.category.count()} categories`);
  console.log(`- ${await prisma.subcategory.count()} subcategories`);
  console.log(`- ${await prisma.question.count()} questions`);
  console.log(`- ${await prisma.exam.count()} exams`);
  console.log('');
  console.log('🔧 Next steps:');
  console.log('1. Sign up/sign in to the application');
  console.log('2. Manually set your user role to ADMIN in the database');
  console.log('3. Access the admin panel at /admin');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
