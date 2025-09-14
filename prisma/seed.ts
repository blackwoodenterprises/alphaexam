import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive seed for Indian competitive exams...');
  
  // Reset database by deleting all data in correct order (respecting foreign key constraints)
  console.log('🗑️ Resetting database...');
  await prisma.examAnswer.deleteMany();
  await prisma.examAttempt.deleteMany();
  await prisma.examQuestion.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.question.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.examCategory.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Database reset completed');

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
      credits: 10000,
      onboardingComplete: true,
    },
  });

  console.log('✅ Admin user created');

  // Create Exam Categories
  const examCategories = [
    {
      name: 'Mathematical Olympiads',
      description: 'International Mathematical Olympiad, Regional Mathematical Olympiad, and other prestigious mathematical competitions'
    },
    {
      name: 'JEE Main & Advanced',
      description: 'Joint Entrance Examination for engineering colleges including IITs, NITs, and other technical institutions'
    },
    {
      name: 'NEET',
      description: 'National Eligibility cum Entrance Test for medical and dental colleges'
    },
    {
      name: 'UPSC Civil Services',
      description: 'Union Public Service Commission examinations for civil services including IAS, IPS, IFS'
    },
    {
      name: 'SSC Examinations',
      description: 'Staff Selection Commission examinations for various government positions'
    },
    {
      name: 'Banking Examinations',
      description: 'IBPS, SBI, RBI and other banking sector examinations'
    },
    {
      name: 'Railway Examinations',
      description: 'Railway Recruitment Board examinations for various railway positions'
    },
    {
      name: 'State PSC',
      description: 'State Public Service Commission examinations for state government positions'
    },
    {
      name: 'Defense Examinations',
      description: 'NDA, CDS, AFCAT and other defense services examinations'
    },
    {
      name: 'Teaching Examinations',
      description: 'CTET, TET, UGC NET and other teaching qualification examinations'
    }
  ];

  const createdExamCategories: Record<string, any> = {};
  for (const category of examCategories) {
    const examCategory = await prisma.examCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
    createdExamCategories[category.name] = examCategory;
  }

  console.log('✅ Exam categories created');

  // Create Question Categories
  const questionCategories = [
    {
      name: 'Mathematics',
      description: 'Mathematical concepts, problem solving, and numerical ability',
      subcategories: [
        'Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics', 
        'Probability', 'Number Theory', 'Coordinate Geometry', 'Mensuration', 'Arithmetic'
      ]
    },
    {
      name: 'Physics',
      description: 'Physics concepts, laws, and applications',
      subcategories: [
        'Mechanics', 'Thermodynamics', 'Optics', 'Electricity & Magnetism', 
        'Modern Physics', 'Waves', 'Atomic Physics', 'Nuclear Physics'
      ]
    },
    {
      name: 'Chemistry',
      description: 'Chemistry concepts, reactions, and applications',
      subcategories: [
        'Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 
        'Analytical Chemistry', 'Biochemistry', 'Environmental Chemistry'
      ]
    },
    {
      name: 'Biology',
      description: 'Biology and life sciences',
      subcategories: [
        'Botany', 'Zoology', 'Human Physiology', 'Genetics', 'Ecology', 
        'Biotechnology', 'Microbiology', 'Cell Biology'
      ]
    },
    {
      name: 'General Knowledge',
      description: 'Current affairs, history, geography, and general awareness',
      subcategories: [
        'Current Affairs', 'History', 'Geography', 'Polity', 'Economics', 
        'Science & Technology', 'Sports', 'Awards & Honors'
      ]
    },
    {
      name: 'English',
      description: 'English language, grammar, and comprehension',
      subcategories: [
        'Grammar', 'Vocabulary', 'Reading Comprehension', 'Writing Skills', 
        'Literature', 'Verbal Ability'
      ]
    },
    {
      name: 'Reasoning',
      description: 'Logical reasoning and analytical ability',
      subcategories: [
        'Logical Reasoning', 'Analytical Reasoning', 'Verbal Reasoning', 
        'Non-Verbal Reasoning', 'Data Interpretation', 'Puzzles'
      ]
    },
    {
      name: 'Quantitative Aptitude',
      description: 'Numerical ability and quantitative reasoning',
      subcategories: [
        'Arithmetic', 'Data Interpretation', 'Simplification', 'Approximation', 
        'Number Series', 'Quadratic Equations'
      ]
    }
  ];

  const createdCategories: Record<string, any> = {};
  for (const category of questionCategories) {
    const questionCategory = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: {
        name: category.name,
        description: category.description,
      },
    });
    createdCategories[category.name] = questionCategory;

    // Create subcategories
    for (const subcat of category.subcategories) {
      await prisma.subcategory.upsert({
        where: { name_categoryId: { name: subcat, categoryId: questionCategory.id } },
        update: {},
        create: {
          name: subcat,
          description: `${subcat} related questions and concepts`,
          categoryId: questionCategory.id,
        },
      });
    }
  }

  console.log('✅ Question categories and subcategories created');

  // Create comprehensive sample questions for different subjects
  const sampleQuestions = [
    // Mathematics Questions
    {
      imageUrl: 'https://via.placeholder.com/400x300?text=Math+Quadratic+Equation',
      questionText: 'Find the roots of the quadratic equation $2x^2 - 7x + 3 = 0$.',
      optionA: '$x = 3, \\frac{1}{2}$',
      optionB: '$x = \\frac{1}{2}, 3$',
      optionC: '$x = -3, -\\frac{1}{2}$',
      optionD: '$x = 1, 2$',
      correctAnswer: 'A' as const,
      explanation: 'Using the quadratic formula: $x = \\frac{7 \\pm \\sqrt{49-24}}{4} = \\frac{7 \\pm 5}{4}$. So $x = 3$ or $x = \\frac{1}{2}$.',
      class: 10,
      difficultyLevel: 'MEDIUM' as const,
      tags: ['quadratic', 'algebra', 'roots'],
      categoryName: 'Mathematics',
      subcategoryName: 'Algebra'
    },
    {
      imageUrl: 'https://via.placeholder.com/400x300?text=Math+Geometry+Triangle',
      questionText: 'In a right-angled triangle, if one angle is $30°$, and the hypotenuse is 10 cm, find the length of the side opposite to the $30°$ angle.',
      optionA: '5 cm',
      optionB: '10 cm',
      optionC: '$5\\sqrt{3}$ cm',
      optionD: '$10\\sqrt{3}$ cm',
      correctAnswer: 'A' as const,
      explanation: 'In a 30-60-90 triangle, the side opposite to 30° is half the hypotenuse. So the answer is 10/2 = 5 cm.',
      class: 10,
      difficultyLevel: 'EASY' as const,
      tags: ['triangle', 'trigonometry', '30-60-90'],
      categoryName: 'Mathematics',
      subcategoryName: 'Geometry'
    },
    {
      imageUrl: 'https://via.placeholder.com/400x300?text=Math+Calculus+Derivative',
      questionText: 'Find the derivative of $f(x) = x^3 + 2x^2 - 5x + 1$ with respect to $x$.',
      optionA: '$3x^2 + 4x - 5$',
      optionB: '$3x^2 + 2x - 5$',
      optionC: '$x^3 + 4x - 5$',
      optionD: '$3x + 4x - 5$',
      correctAnswer: 'A' as const,
      explanation: 'Using power rule: $f\'(x) = 3x^2 + 2(2x) - 5 + 0 = 3x^2 + 4x - 5$.',
      class: 12,
      difficultyLevel: 'MEDIUM' as const,
      tags: ['calculus', 'derivative', 'power-rule'],
      categoryName: 'Mathematics',
      subcategoryName: 'Calculus'
    },

    // Physics Questions
    {
      imageUrl: 'https://via.placeholder.com/400x300?text=Physics+Kinematics',
      questionText: 'A ball is thrown vertically upward with an initial velocity of 20 m/s. What is the maximum height reached? (Take g = 10 m/s²)',
      optionA: '10 m',
      optionB: '20 m',
      optionC: '30 m',
      optionD: '40 m',
      correctAnswer: 'B' as const,
      explanation: 'Using $v^2 = u^2 + 2as$, at maximum height $v = 0$: $0 = 20^2 - 2(10)h$, so $h = 400/20 = 20$ m.',
      class: 11,
      difficultyLevel: 'MEDIUM' as const,
      tags: ['kinematics', 'projectile', 'motion'],
      categoryName: 'Physics',
      subcategoryName: 'Mechanics'
    },
    {
      imageUrl: 'https://via.placeholder.com/400x300?text=Physics+Electricity',
      questionText: 'What is the equivalent resistance when two resistors of 4Ω and 6Ω are connected in parallel?',
      optionA: '2.4Ω',
      optionB: '10Ω',
      optionC: '5Ω',
      optionD: '1.5Ω',
      correctAnswer: 'A' as const,
      explanation: 'For parallel connection: $\\frac{1}{R} = \\frac{1}{4} + \\frac{1}{6} = \\frac{3+2}{12} = \\frac{5}{12}$. So $R = \\frac{12}{5} = 2.4Ω$.',
      class: 10,
      difficultyLevel: 'MEDIUM' as const,
      tags: ['electricity', 'resistance', 'parallel'],
      categoryName: 'Physics',
      subcategoryName: 'Electricity & Magnetism'
    },

    // Chemistry Questions
    {
      imageUrl: 'https://via.placeholder.com/400x300?text=Chemistry+Periodic+Table',
      questionText: 'Which element has the electronic configuration [Ar] 3d¹⁰ 4s²?',
      optionA: 'Copper (Cu)',
      optionB: 'Zinc (Zn)',
      optionC: 'Iron (Fe)',
      optionD: 'Nickel (Ni)',
      correctAnswer: 'B' as const,
      explanation: 'Zinc has atomic number 30. Its electronic configuration is [Ar] 3d¹⁰ 4s².',
      class: 11,
      difficultyLevel: 'MEDIUM' as const,
      tags: ['periodic-table', 'electronic-configuration', 'zinc'],
      categoryName: 'Chemistry',
      subcategoryName: 'Inorganic Chemistry'
    },
    {
      imageUrl: 'https://via.placeholder.com/400x300?text=Chemistry+Organic',
      questionText: 'What is the IUPAC name of CH₃-CH₂-CH(CH₃)-CH₂-CH₃?',
      optionA: '2-methylbutane',
      optionB: '3-methylpentane',
      optionC: '2-methylpentane',
      optionD: 'hexane',
      correctAnswer: 'B' as const,
      explanation: 'The longest carbon chain has 5 carbons (pentane) with a methyl group at position 3, so it is 3-methylpentane.',
      class: 11,
      difficultyLevel: 'MEDIUM' as const,
      tags: ['organic', 'nomenclature', 'alkanes'],
      categoryName: 'Chemistry',
      subcategoryName: 'Organic Chemistry'
    },

    // Biology Questions
    {
      imageUrl: 'https://via.placeholder.com/400x300?text=Biology+Cell+Division',
      questionText: 'During which phase of mitosis do chromosomes align at the cell\'s equator?',
      optionA: 'Prophase',
      optionB: 'Metaphase',
      optionC: 'Anaphase',
      optionD: 'Telophase',
      correctAnswer: 'B' as const,
      explanation: 'During metaphase, chromosomes align at the metaphase plate (cell\'s equator) before being separated.',
      class: 11,
      difficultyLevel: 'EASY' as const,
      tags: ['cell-division', 'mitosis', 'metaphase'],
      categoryName: 'Biology',
      subcategoryName: 'Cell Biology'
    },

    // General Knowledge Questions
    {
      imageUrl: 'https://via.placeholder.com/400x300?text=GK+Indian+History',
      questionText: 'Who was the first President of India?',
      optionA: 'Jawaharlal Nehru',
      optionB: 'Dr. Rajendra Prasad',
      optionC: 'Sardar Vallabhbhai Patel',
      optionD: 'Dr. A.P.J. Abdul Kalam',
      correctAnswer: 'B' as const,
      explanation: 'Dr. Rajendra Prasad was the first President of India, serving from 1950 to 1962.',
      class: 8,
      difficultyLevel: 'EASY' as const,
      tags: ['indian-history', 'president', 'independence'],
      categoryName: 'General Knowledge',
      subcategoryName: 'History'
    },
    {
      imageUrl: 'https://via.placeholder.com/400x300?text=GK+Geography',
      questionText: 'Which is the longest river in India?',
      optionA: 'Yamuna',
      optionB: 'Brahmaputra',
      optionC: 'Ganga',
      optionD: 'Godavari',
      correctAnswer: 'C' as const,
      explanation: 'The Ganga (Ganges) is the longest river in India, flowing for about 2,525 km.',
      class: 7,
      difficultyLevel: 'EASY' as const,
      tags: ['geography', 'rivers', 'india'],
      categoryName: 'General Knowledge',
      subcategoryName: 'Geography'
    },

    // Reasoning Questions
    {
      imageUrl: 'https://via.placeholder.com/400x300?text=Reasoning+Series',
      questionText: 'Find the next number in the series: 2, 6, 12, 20, 30, ?',
      optionA: '40',
      optionB: '42',
      optionC: '44',
      optionD: '46',
      correctAnswer: 'B' as const,
      explanation: 'The differences are 4, 6, 8, 10, so the next difference is 12. Therefore, 30 + 12 = 42.',
      class: 8,
      difficultyLevel: 'MEDIUM' as const,
      tags: ['number-series', 'pattern', 'sequence'],
      categoryName: 'Reasoning',
      subcategoryName: 'Logical Reasoning'
    }
  ];

  // Create questions with proper category and subcategory references
  for (const questionData of sampleQuestions) {
    const category = createdCategories[questionData.categoryName];
    const subcategory = await prisma.subcategory.findFirst({
      where: {
        name: questionData.subcategoryName,
        categoryId: category.id
      }
    });

    await prisma.question.create({
      data: {
        imageUrl: questionData.imageUrl,
        questionText: questionData.questionText,
        optionA: questionData.optionA,
        optionB: questionData.optionB,
        optionC: questionData.optionC,
        optionD: questionData.optionD,
        correctAnswer: questionData.correctAnswer,
        explanation: questionData.explanation,
        class: questionData.class,
        difficultyLevel: questionData.difficultyLevel,
        status: 'PUBLISHED',
        tags: questionData.tags,
        categoryId: category.id,
        subcategoryId: subcategory?.id,
        apiResponse: {
          message: 'Processed successfully',
          success: true,
          transcription: {
            question_text: questionData.questionText,
            options: {
              A: questionData.optionA,
              B: questionData.optionB,
              C: questionData.optionC,
              D: questionData.optionD
            }
          }
        }
      },
    });
  }

  console.log('✅ Sample questions created');

  // Create comprehensive Indian competitive exams
  const indianExams = [
    // Mathematical Olympiads
    {
      title: 'Regional Mathematical Olympiad (RMO) Practice Test',
      description: 'Comprehensive practice test for Regional Mathematical Olympiad covering algebra, geometry, number theory, and combinatorics.',
      price: 0,
      duration: 180,
      isActive: true,
      isFree: true,
      imageUrl: 'https://via.placeholder.com/400x200?text=RMO+Practice',
      examCategoryName: 'Mathematical Olympiads'
    },
    {
      title: 'Indian National Mathematical Olympiad (INMO) Mock Test',
      description: 'Advanced mathematical problem-solving test designed for INMO preparation with proof-based questions.',
      price: 50,
      duration: 240,
      isActive: true,
      isFree: false,
      imageUrl: 'https://via.placeholder.com/400x200?text=INMO+Mock',
      examCategoryName: 'Mathematical Olympiads'
    },
    {
      title: 'International Mathematical Olympiad (IMO) Preparation',
      description: 'Elite-level mathematical olympiad preparation with challenging problems from various mathematical domains.',
      price: 100,
      duration: 270,
      isActive: true,
      isFree: false,
      imageUrl: 'https://via.placeholder.com/400x200?text=IMO+Prep',
      examCategoryName: 'Mathematical Olympiads'
    },

    // JEE Examinations
    {
      title: 'JEE Main Physics Mock Test - Mechanics',
      description: 'Comprehensive physics mock test focusing on mechanics, kinematics, and dynamics for JEE Main preparation.',
      price: 30,
      duration: 120,
      isActive: true,
      isFree: false,
      imageUrl: 'https://via.placeholder.com/400x200?text=JEE+Physics',
      examCategoryName: 'JEE Main & Advanced'
    },
    {
      title: 'JEE Main Mathematics - Algebra & Calculus',
      description: 'Mathematics mock test covering algebra, calculus, coordinate geometry, and trigonometry.',
      price: 30,
      duration: 120,
      isActive: true,
      isFree: false,
      imageUrl: 'https://via.placeholder.com/400x200?text=JEE+Math',
      examCategoryName: 'JEE Main & Advanced'
    },
    {
      title: 'JEE Main Chemistry - Organic & Inorganic',
      description: 'Chemistry mock test focusing on organic chemistry reactions and inorganic chemistry concepts.',
      price: 30,
      duration: 120,
      isActive: true,
      isFree: false,
      imageUrl: 'https://via.placeholder.com/400x200?text=JEE+Chemistry',
      examCategoryName: 'JEE Main & Advanced'
    },
    {
      title: 'JEE Advanced Mock Test - Full Syllabus',
      description: 'Complete JEE Advanced mock test covering all subjects with advanced level questions.',
      price: 75,
      duration: 180,
      isActive: true,
      isFree: false,
      imageUrl: 'https://via.placeholder.com/400x200?text=JEE+Advanced',
      examCategoryName: 'JEE Main & Advanced'
    },

    // NEET Examinations
    {
      title: 'NEET Biology Mock Test - Botany & Zoology',
      description: 'Comprehensive biology mock test covering botany, zoology, and human physiology for NEET preparation.',
      price: 25,
      duration: 120,
      isActive: true,
      isFree: false,
      imageUrl: 'https://via.placeholder.com/400x200?text=NEET+Biology',
      examCategoryName: 'NEET'
    },
    {
      title: 'NEET Physics Mock Test',
      description: 'Physics mock test for NEET covering mechanics, optics, electricity, and modern physics.',
      price: 25,
      duration: 90,
      isActive: true,
      isFree: false,
      imageUrl: 'https://via.placeholder.com/400x200?text=NEET+Physics',
      examCategoryName: 'NEET'
    },
    {
      title: 'NEET Chemistry Mock Test',
      description: 'Chemistry mock test covering organic, inorganic, and physical chemistry for NEET.',
      price: 25,
      duration: 90,
      isActive: true,
      isFree: false,
      imageUrl: 'https://via.placeholder.com/400x200?text=NEET+Chemistry',
      examCategoryName: 'NEET'
    },
    {
      title: 'NEET Full Mock Test',
      description: 'Complete NEET mock test with all subjects - Physics, Chemistry, and Biology.',
      price: 50,
      duration: 180,
      isActive: true,
      isFree: true,
      imageUrl: 'https://via.placeholder.com/400x200?text=NEET+Full',
      examCategoryName: 'NEET'
    },

    // UPSC Civil Services
    {
      title: 'UPSC Prelims - General Studies Paper 1',
      description: 'UPSC Civil Services Preliminary examination practice test for General Studies Paper 1.',
      price: 40,
      duration: 120,
      isActive: true,
      isFree: false,
      imageUrl: 'https://via.placeholder.com/400x200?text=UPSC+GS1',
      examCategoryName: 'UPSC Civil Services'
    },
    {
      title: 'UPSC Prelims - CSAT (Paper 2)',
      description: 'Civil Services Aptitude Test focusing on comprehension, logical reasoning, and analytical ability.',
      price: 40,
      duration: 120,
      isActive: true,
      isFree: false,
      imageUrl: 'https://via.placeholder.com/400x200?text=UPSC+CSAT',
      examCategoryName: 'UPSC Civil Services'
    },

    // SSC Examinations
    {
      title: 'SSC CGL Tier 1 Mock Test',
      description: 'Staff Selection Commission Combined Graduate Level Tier 1 examination practice test.',
      price: 20,
      duration: 60,
      isActive: true,
      isFree: true,
      imageUrl: 'https://via.placeholder.com/400x200?text=SSC+CGL',
      examCategoryName: 'SSC Examinations'
    },
    {
      title: 'SSC CHSL Mock Test',
      description: 'Combined Higher Secondary Level examination for Lower Divisional Clerk and Data Entry Operator posts.',
      price: 15,
      duration: 60,
      isActive: true,
      isFree: false,
      imageUrl: 'https://via.placeholder.com/400x200?text=SSC+CHSL',
      examCategoryName: 'SSC Examinations'
    },
    {
      title: 'SSC MTS Mock Test',
      description: 'Multi-Tasking Staff examination covering general intelligence, numerical aptitude, and general awareness.',
      price: 10,
      duration: 90,
      isActive: true,
      isFree: false,
      imageUrl: 'https://via.placeholder.com/400x200?text=SSC+MTS',
      examCategoryName: 'SSC Examinations'
    },

    // Banking Examinations
    {
      title: 'IBPS PO Preliminary Exam',
      description: 'Institute of Banking Personnel Selection Probationary Officer preliminary examination.',
      price: 25,
      duration: 60,
      isActive: true,
      isFree: false,
      imageUrl: 'https://via.placeholder.com/400x200?text=IBPS+PO',
      examCategoryName: 'Banking Examinations'
    },
    {
      title: 'SBI Clerk Mock Test',
      description: 'State Bank of India Clerk examination covering reasoning, numerical ability, and English language.',
      price: 20,
      duration: 60,
      isActive: true,
      isFree: false,
      imageUrl: 'https://via.placeholder.com/400x200?text=SBI+Clerk',
      examCategoryName: 'Banking Examinations'
    },
    {
      title: 'RBI Grade B Mock Test',
      description: 'Reserve Bank of India Grade B Officer examination for various specialist positions.',
      price: 50,
      duration: 120,
      isActive: true,
      isFree: false,
      imageUrl: 'https://via.placeholder.com/400x200?text=RBI+Grade+B',
      examCategoryName: 'Banking Examinations'
    },

    // Railway Examinations
    {
      title: 'RRB NTPC Mock Test',
      description: 'Railway Recruitment Board Non-Technical Popular Categories examination.',
      price: 15,
      duration: 90,
      isActive: true,
      isFree: false,
      imageUrl: 'https://via.placeholder.com/400x200?text=RRB+NTPC',
      examCategoryName: 'Railway Examinations'
    },
    {
      title: 'RRB JE Mock Test',
      description: 'Railway Junior Engineer examination covering technical and general awareness sections.',
      price: 25,
      duration: 90,
      isActive: true,
      isFree: false,
      imageUrl: 'https://via.placeholder.com/400x200?text=RRB+JE',
      examCategoryName: 'Railway Examinations'
    },

    // Defense Examinations
    {
      title: 'NDA Mock Test',
      description: 'National Defence Academy examination for Army, Navy, and Air Force training.',
      price: 30,
      duration: 150,
      isActive: true,
      isFree: false,
      imageUrl: 'https://via.placeholder.com/400x200?text=NDA+Mock',
      examCategoryName: 'Defense Examinations'
    },
    {
      title: 'CDS Mock Test',
      description: 'Combined Defence Services examination for Indian Military Academy, Naval Academy, and Air Force Academy.',
      price: 35,
      duration: 120,
      isActive: true,
      isFree: false,
      imageUrl: 'https://via.placeholder.com/400x200?text=CDS+Mock',
      examCategoryName: 'Defense Examinations'
    },
    {
      title: 'AFCAT Mock Test',
      description: 'Air Force Common Admission Test for Flying Branch, Ground Duty, and Technical Branch.',
      price: 30,
      duration: 120,
      isActive: true,
      isFree: false,
      imageUrl: 'https://via.placeholder.com/400x200?text=AFCAT+Mock',
      examCategoryName: 'Defense Examinations'
    },

    // Teaching Examinations
    {
      title: 'CTET Paper 1 Mock Test',
      description: 'Central Teacher Eligibility Test for classes I-V covering child development, language, mathematics, and EVS.',
      price: 20,
      duration: 150,
      isActive: true,
      isFree: true,
      imageUrl: 'https://via.placeholder.com/400x200?text=CTET+Paper1',
      examCategoryName: 'Teaching Examinations'
    },
    {
      title: 'CTET Paper 2 Mock Test',
      description: 'Central Teacher Eligibility Test for classes VI-VIII covering child development, language, and subject-specific content.',
      price: 20,
      duration: 150,
      isActive: true,
      isFree: false,
      imageUrl: 'https://via.placeholder.com/400x200?text=CTET+Paper2',
      examCategoryName: 'Teaching Examinations'
    },
    {
      title: 'UGC NET Mock Test',
      description: 'University Grants Commission National Eligibility Test for Assistant Professor and JRF.',
      price: 40,
      duration: 180,
      isActive: true,
      isFree: false,
      imageUrl: 'https://via.placeholder.com/400x200?text=UGC+NET',
      examCategoryName: 'Teaching Examinations'
    },

    // State PSC
    {
      title: 'Maharashtra PSC Mock Test',
      description: 'Maharashtra Public Service Commission examination for various state government positions.',
      price: 25,
      duration: 120,
      isActive: true,
      isFree: false,
      imageUrl: 'https://via.placeholder.com/400x200?text=MPSC+Mock',
      examCategoryName: 'State PSC'
    },
    {
      title: 'UP PSC Mock Test',
      description: 'Uttar Pradesh Public Service Commission examination for state administrative services.',
      price: 25,
      duration: 120,
      isActive: true,
      isFree: false,
      imageUrl: 'https://via.placeholder.com/400x200?text=UPPSC+Mock',
      examCategoryName: 'State PSC'
    }
  ];

  // Create exams with proper category references
  const createdExams = [];
  for (const examData of indianExams) {
    const examCategory = createdExamCategories[examData.examCategoryName];
    
    const exam = await prisma.exam.create({
      data: {
        title: examData.title,
        description: examData.description,
        price: examData.price,
        duration: examData.duration,
        isActive: examData.isActive,
        isFree: examData.isFree,
        imageUrl: examData.imageUrl,
        examCategoryId: examCategory.id,
        createdById: adminUser.id,
        questionsToServe: Math.floor(Math.random() * 50) + 50, // Random between 50-100 questions
      },
    });
    createdExams.push(exam);
  }

  console.log('✅ Indian competitive exams created');

  // Add questions to exams by creating exam-question relationships
  console.log('🔗 Creating exam-question relationships...');
  
  // Get all created questions
  const allQuestions = await prisma.question.findMany();
  
  // For each exam, add a subset of relevant questions
   for (const exam of createdExams) {
     const examCategory = exam.examCategoryId ? await prisma.examCategory.findUnique({
       where: { id: exam.examCategoryId }
     }) : null;
     
     let relevantQuestions = [];
     
     // Select questions based on exam category
      const categoryName = examCategory?.name ?? '';
      if (categoryName && (categoryName.includes('Mathematical') || categoryName.includes('JEE') || categoryName.includes('NEET'))) {
      // For academic exams, include Math, Physics, Chemistry, Biology questions
      relevantQuestions = allQuestions.filter(q => {
        const category = Object.values(createdCategories).find(cat => cat.id === q.categoryId);
        return category && ['Mathematics', 'Physics', 'Chemistry', 'Biology'].includes(category.name);
      });
    } else {
      // For competitive exams, include GK, Reasoning, English, Quantitative Aptitude
      relevantQuestions = allQuestions.filter(q => {
        const category = Object.values(createdCategories).find(cat => cat.id === q.categoryId);
        return category && ['General Knowledge', 'Reasoning', 'English', 'Quantitative Aptitude'].includes(category.name);
      });
      
      // If no specific questions found, include some math questions as well
      if (relevantQuestions.length === 0) {
        relevantQuestions = allQuestions.filter(q => {
          const category = Object.values(createdCategories).find(cat => cat.id === q.categoryId);
          return category && ['Mathematics', 'General Knowledge', 'Reasoning'].includes(category.name);
        });
      }
    }
    
    // If still no questions, use all available questions
    if (relevantQuestions.length === 0) {
      relevantQuestions = allQuestions;
    }
    
    // Add questions to exam (limit to questionsToServe or available questions)
     const questionsToAdd = relevantQuestions.slice(0, Math.min(exam.questionsToServe || 50, relevantQuestions.length));
    
    for (let i = 0; i < questionsToAdd.length; i++) {
      await prisma.examQuestion.create({
        data: {
          examId: exam.id,
          questionId: questionsToAdd[i].id,
          order: i + 1,
        },
      });
    }
  }
  
  console.log('✅ Exam-question relationships created');

  console.log('🎉 Comprehensive seed completed successfully!');
  console.log('');
  console.log('📋 Summary:');
  console.log(`- ${await prisma.examCategory.count()} exam categories`);
  console.log(`- ${await prisma.category.count()} question categories`);
  console.log(`- ${await prisma.subcategory.count()} subcategories`);
  console.log(`- ${await prisma.question.count()} questions`);
  console.log(`- ${await prisma.exam.count()} exams`);
  console.log(`- ${await prisma.examQuestion.count()} exam-question relationships`);
  console.log('');
  console.log('🔧 Next steps:');
  console.log('1. Sign up/sign in to the application');
  console.log('2. Manually set your user role to ADMIN in the database');
  console.log('3. Access the admin panel at /admin');
  console.log('4. Add more questions through the admin interface');
  console.log('5. Create exam-question relationships for comprehensive tests');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
