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
      questionText: 'In a right-angled triangle, if one angle is $30°$, and the hypotenuse is 10 cm, find the length of the side opposite to the $30°$ angle.',
      optionA: '5 cm',
      optionB: '10 cm',
      optionC: '$5\\sqrt{3}$ cm',
      optionD: '$10\\sqrt{3}$ cm',
      correctAnswer: 'A' as const,
      explanation: 'In a 30-60-90 triangle, the side opposite to $30°$ is half the hypotenuse. So the answer is $10/2 = 5$ cm.',
      class: 10,
      difficultyLevel: 'EASY' as const,
      tags: ['triangle', 'trigonometry', '30-60-90'],
      categoryName: 'Mathematics',
      subcategoryName: 'Geometry'
    },
    {
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
      questionText: 'A ball is thrown vertically upward with an initial velocity of $20$ m/s. What is the maximum height reached? (Take $g = 10$ m/s²)',
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
      questionText: 'What is the equivalent resistance when two resistors of $4\Omega$ and $6\Omega$ are connected in parallel?',
      optionA: '$2.4\Omega$',
      optionB: '$10\Omega$',
      optionC: '$5\Omega$',
      optionD: '$1.5\Omega$',
      correctAnswer: 'A' as const,
      explanation: 'For parallel connection: $\\frac{1}{R} = \\frac{1}{4} + \\frac{1}{6} = \\frac{3+2}{12} = \\frac{5}{12}$. So $R = \\frac{12}{5} = 2.4\\Omega$.',
      class: 10,
      difficultyLevel: 'MEDIUM' as const,
      tags: ['electricity', 'resistance', 'parallel'],
      categoryName: 'Physics',
      subcategoryName: 'Electricity & Magnetism'
    },

    // Chemistry Questions
    {
      questionText: 'Which element has the electronic configuration $[\text{Ar}] 3d^{10} 4s^2$?',
      optionA: 'Copper (Cu)',
      optionB: 'Zinc (Zn)',
      optionC: 'Iron (Fe)',
      optionD: 'Nickel (Ni)',
      correctAnswer: 'B' as const,
      explanation: 'Zinc has atomic number $30$. Its electronic configuration is $[\text{Ar}] 3d^{10} 4s^2$.',
      class: 11,
      difficultyLevel: 'MEDIUM' as const,
      tags: ['periodic-table', 'electronic-configuration', 'zinc'],
      categoryName: 'Chemistry',
      subcategoryName: 'Inorganic Chemistry'
    },
    {
      questionText: 'What is the IUPAC name of $\text{CH}_3\text{-CH}_2\text{-CH(CH}_3\text{)-CH}_2\text{-CH}_3$?',
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
    },

    // Mathematical Olympiad Questions (20 comprehensive questions)
    {
      questionText: 'Find the number of positive integers $n \leq 100$ such that $n^2 + n + 41$ is prime.',
      optionA: '39',
      optionB: '40',
      optionC: '41',
      optionD: '42',
      correctAnswer: 'B' as const,
      explanation: 'For $n = 1$ to $39$, $n^2 + n + 41$ gives distinct primes. For $n = 40$, we get $40^2 + 40 + 41 = 1681 = 41^2$, which is not prime.',
      class: 12,
      difficultyLevel: 'HARD' as const,
      tags: ['number-theory', 'primes', 'olympiad'],
      categoryName: 'Mathematics',
      subcategoryName: 'Number Theory'
    },
    {
      questionText: 'In triangle ABC, if the angles are in arithmetic progression and the sides are in geometric progression, find the ratio of the sides.',
      optionA: '1:1:1',
      optionB: '$1:\sqrt{3}:2$',
      optionC: '3:4:5',
      optionD: '$1:\varphi:\varphi^2$ where $\varphi$ is golden ratio',
      correctAnswer: 'A' as const,
      explanation: 'If angles are in AP, they must be $60°$, $60°$, $60°$ (since sum = $180°$). If sides are in GP with this constraint, the triangle must be equilateral.',
      class: 12,
      difficultyLevel: 'HARD' as const,
      tags: ['geometry', 'sequences', 'triangles'],
      categoryName: 'Mathematics',
      subcategoryName: 'Geometry'
    },
    {
      questionText: 'Find the coefficient of $x^5$ in the expansion of $(1 + x + x^2 + x^3)^4$.',
      optionA: '15',
      optionB: '20',
      optionC: '25',
      optionD: '30',
      correctAnswer: 'B' as const,
      explanation: 'Using generating functions: $(1 + x + x^2 + x^3)^4 = \left(\frac{1-x^4}{1-x}\right)^4$. The coefficient of $x^5$ is $20$.',
      class: 12,
      difficultyLevel: 'HARD' as const,
      tags: ['combinatorics', 'generating-functions', 'binomial'],
      categoryName: 'Mathematics',
      subcategoryName: 'Algebra'
    },
    {
      questionText: 'How many ways can 8 rooks be placed on a chessboard so that no two rooks attack each other?',
      optionA: '8!',
      optionB: '64!',
      optionC: '$8^8$',
      optionD: 'C(64,8)',
      correctAnswer: 'A' as const,
      explanation: 'Each row and column must contain exactly one rook. This is equivalent to finding permutations of 8 objects, which is 8!.',
      class: 11,
      difficultyLevel: 'MEDIUM' as const,
      tags: ['combinatorics', 'permutations', 'chess'],
      categoryName: 'Mathematics',
      subcategoryName: 'Probability'
    },
    {
      questionText: 'Find the sum of all positive divisors of 360.',
      optionA: '1170',
      optionB: '1260',
      optionC: '1350',
      optionD: '1440',
      correctAnswer: 'A' as const,
      explanation: '$360 = 2^3 \times 3^2 \times 5^1$. Sum of divisors = $(1+2+4+8)(1+3+9)(1+5) = 15 \times 13 \times 6 = 1170$.',
      class: 11,
      difficultyLevel: 'MEDIUM' as const,
      tags: ['number-theory', 'divisors', 'factorization'],
      categoryName: 'Mathematics',
      subcategoryName: 'Number Theory'
    },
    {
      questionText: 'In how many ways can the letters of MATHEMATICS be arranged?',
      optionA: '4989600',
      optionB: '4989000',
      optionC: '4990000',
      optionD: '5000000',
      correctAnswer: 'A' as const,
      explanation: 'MATHEMATICS has 11 letters with M(2), A(2), T(2), H(1), E(1), I(1), C(1), S(1). Arrangements = 11!/(2!×2!×2!) = 4989600.',
      class: 11,
      difficultyLevel: 'MEDIUM' as const,
      tags: ['permutations', 'repetition', 'arrangements'],
      categoryName: 'Mathematics',
      subcategoryName: 'Probability'
    },
    {
      questionText: 'Find the area of the region bounded by $y = x^2$, $y = 2x$, and $x = 0$.',
      optionA: '$2/3$',
      optionB: '$4/3$',
      optionC: '$5/3$',
      optionD: '$8/3$',
      correctAnswer: 'B' as const,
      explanation: 'Intersection points: $x^2 = 2x$ gives $x = 0, 2$. Area = $\int_0^2 (2x - x^2)dx = [x^2 - x^3/3]_0^2 = 4 - 8/3 = 4/3$.',
      class: 12,
      difficultyLevel: 'MEDIUM' as const,
      tags: ['integration', 'area', 'curves'],
      categoryName: 'Mathematics',
      subcategoryName: 'Calculus'
    },
    {
      questionText: 'If $f(x) = x^3 - 6x^2 + 11x - 6$, find the number of real roots.',
      optionA: '1',
      optionB: '2',
      optionC: '3',
      optionD: '0',
      correctAnswer: 'C' as const,
      explanation: 'f(x) = (x-1)(x-2)(x-3). The polynomial has three distinct real roots: x = 1, 2, 3.',
      class: 12,
      difficultyLevel: 'MEDIUM' as const,
      tags: ['polynomials', 'roots', 'factoring'],
      categoryName: 'Mathematics',
      subcategoryName: 'Algebra'
    },
    {
      questionText: 'Find the minimum value of $x^2 + y^2$ subject to the constraint $x + y = 10$.',
      optionA: '25',
      optionB: '50',
      optionC: '75',
      optionD: '100',
      correctAnswer: 'B' as const,
      explanation: 'Using Lagrange multipliers or substitution $y = 10-x$: $f(x) = x^2 + (10-x)^2 = 2x^2 - 20x + 100$. Minimum at $x = 5$, giving $f(5) = 50$.',
      class: 12,
      difficultyLevel: 'HARD' as const,
      tags: ['optimization', 'lagrange', 'constraints'],
      categoryName: 'Mathematics',
      subcategoryName: 'Calculus'
    },
    {
      questionText: 'In a regular hexagon with side length 6, find the area of the largest circle that can be inscribed.',
      optionA: '$27\pi$',
      optionB: '$36\pi$',
      optionC: '$54\pi$',
      optionD: '$81\pi$',
      correctAnswer: 'A' as const,
      explanation: 'The inscribed circle radius equals the apothem of the hexagon: $r = (\sqrt{3}/2) \times 6 = 3\sqrt{3}$. Area = $\pi(3\sqrt{3})^2 = 27\pi$.',
      class: 11,
      difficultyLevel: 'MEDIUM' as const,
      tags: ['geometry', 'hexagon', 'inscribed-circle'],
      categoryName: 'Mathematics',
      subcategoryName: 'Geometry'
    },
    {
      questionText: 'Find the sum of the infinite series: $1 + 1/4 + 1/9 + 1/16 + 1/25 + ...$',
      optionA: '$\pi^2/4$',
      optionB: '$\pi^2/6$',
      optionC: '$\pi^2/8$',
      optionD: '$\pi^2/12$',
      correctAnswer: 'B' as const,
      explanation: 'This is the Basel problem: $\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}$, proven by Euler.',
      class: 12,
      difficultyLevel: 'HARD' as const,
      tags: ['series', 'infinite-series', 'basel-problem'],
      categoryName: 'Mathematics',
      subcategoryName: 'Calculus'
    },
    {
      questionText: 'How many integers from 1 to 1000 are divisible by neither 2 nor 3 nor 5?',
      optionA: '266',
      optionB: '267',
      optionC: '268',
      optionD: '269',
      correctAnswer: 'B' as const,
      explanation: 'Using inclusion-exclusion: 1000 - |A∪B∪C| where A,B,C are sets divisible by 2,3,5. Answer = 1000 - 733 = 267.',
      class: 11,
      difficultyLevel: 'HARD' as const,
      tags: ['inclusion-exclusion', 'divisibility', 'counting'],
      categoryName: 'Mathematics',
      subcategoryName: 'Number Theory'
    },
    {
      questionText: 'Find the number of solutions to $x_1 + x_2 + x_3 + x_4 = 20$ where each $x_i \geq 0$.',
      optionA: 'C(23,3)',
      optionB: 'C(23,4)',
      optionC: 'C(24,3)',
      optionD: 'C(20,4)',
      correctAnswer: 'A' as const,
      explanation: 'This is stars and bars: distributing 20 identical objects into 4 distinct boxes. Answer = C(20+4-1, 4-1) = C(23,3).',
      class: 11,
      difficultyLevel: 'MEDIUM' as const,
      tags: ['combinatorics', 'stars-bars', 'equations'],
      categoryName: 'Mathematics',
      subcategoryName: 'Probability'
    },
    {
      questionText: 'Find the remainder when $2^{2024}$ is divided by $7$.',
      optionA: '1',
      optionB: '2',
      optionC: '4',
      optionD: '6',
      correctAnswer: 'C' as const,
      explanation: 'By Fermat\'s Little Theorem, $2^6 \equiv 1 \pmod{7}$. Since $2024 = 6 \times 337 + 2$, we have $2^{2024} \equiv 2^2 \equiv 4 \pmod{7}$.',
      class: 12,
      difficultyLevel: 'HARD' as const,
      tags: ['modular-arithmetic', 'fermat-theorem', 'remainders'],
      categoryName: 'Mathematics',
      subcategoryName: 'Number Theory'
    },
    {
      questionText: 'In triangle ABC, if sin A : sin B : sin C = 3 : 5 : 7, find the ratio of the largest angle to the smallest angle.',
      optionA: '2:1',
      optionB: '7:3',
      optionC: 'Cannot be determined',
      optionD: '5:3',
      correctAnswer: 'B' as const,
      explanation: 'By sine rule, sides are in ratio 3:5:7. Using law of cosines, we can find that the angles correspond to this ratio as well.',
      class: 11,
      difficultyLevel: 'HARD' as const,
      tags: ['trigonometry', 'sine-rule', 'triangles'],
      categoryName: 'Mathematics',
      subcategoryName: 'Trigonometry'
    },
    {
      questionText: 'Find the coefficient of $x^7$ in $(1 + x + x^2 + ... + x^{10})^3$.',
      optionA: '36',
      optionB: '42',
      optionC: '48',
      optionD: '54',
      correctAnswer: 'A' as const,
      explanation: 'Using generating functions: $((1-x^{11})/(1-x))^3$. The coefficient of $x^7$ in this expansion is $36$.',
      class: 12,
      difficultyLevel: 'HARD' as const,
      tags: ['generating-functions', 'coefficients', 'polynomials'],
      categoryName: 'Mathematics',
      subcategoryName: 'Algebra'
    },
    {
      questionText: 'Find the area of the triangle formed by the lines x + y = 6, 2x - y = 3, and x - 2y = -6.',
      optionA: '15',
      optionB: '18',
      optionC: '21',
      optionD: '24',
      correctAnswer: 'C' as const,
      explanation: 'Find intersection points: (3,3), (6,0), (0,3). Using the shoelace formula: Area = ½|3(0-3) + 6(3-3) + 0(3-0)| = ½|-9| = 21.',
      class: 11,
      difficultyLevel: 'MEDIUM' as const,
      tags: ['coordinate-geometry', 'triangles', 'area'],
      categoryName: 'Mathematics',
      subcategoryName: 'Coordinate Geometry'
    },
    {
      questionText: 'If log₂(x) + log₄(x) + log₈(x) = 11, find x.',
      optionA: '32',
      optionB: '64',
      optionC: '128',
      optionD: '256',
      correctAnswer: 'B' as const,
      explanation: 'Converting to base 2: $\log_2(x) + \frac{1}{2}\log_2(x) + \frac{1}{3}\log_2(x) = 11$. This gives $\frac{11}{6}\log_2(x) = 11$, so $\log_2(x) = 6$, hence $x = 64$.',
      class: 11,
      difficultyLevel: 'MEDIUM' as const,
      tags: ['logarithms', 'equations', 'base-conversion'],
      categoryName: 'Mathematics',
      subcategoryName: 'Algebra'
    },
    {
      questionText: 'Find the number of ways to arrange 5 boys and 4 girls in a row such that no two girls are adjacent.',
      optionA: '2880',
      optionB: '14400',
      optionC: '28800',
      optionD: '43200',
      correctAnswer: 'C' as const,
      explanation: 'First arrange 5 boys in 5! ways. This creates 6 gaps. Choose 4 gaps for girls in C(6,4) ways and arrange girls in 4! ways. Total = 5! × C(6,4) × 4! = 28800.',
      class: 11,
      difficultyLevel: 'MEDIUM' as const,
      tags: ['permutations', 'arrangements', 'restrictions'],
      categoryName: 'Mathematics',
      subcategoryName: 'Probability'
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
      richDescription: `The Regional Mathematical Olympiad (RMO) is the first stage of the Indian Mathematical Olympiad program. This comprehensive practice test is designed to help students prepare for challenging mathematical problems.

<strong>Topics Covered:</strong>
<ul>
<li><strong>Algebra:</strong> Polynomials, inequalities, functional equations</li>
<li><strong>Geometry:</strong> Euclidean geometry, coordinate geometry, transformations</li>
<li><strong>Number Theory:</strong> Divisibility, modular arithmetic, Diophantine equations</li>
<li><strong>Combinatorics:</strong> Counting principles, graph theory, discrete probability</li>
</ul>

<strong>Exam Format:</strong> The test consists of 6-8 problems requiring detailed mathematical proofs and solutions. Each problem is worth equal marks and requires creative problem-solving skills.

<strong>Preparation Tip:</strong> Focus on understanding fundamental concepts and practice writing clear, logical proofs.`,
      price: 0,
      duration: 180,
      isActive: true,
      isFree: true,
      examCategoryName: 'Mathematical Olympiads'
    },
    {
      title: 'Indian National Mathematical Olympiad (INMO) Mock Test',
      description: 'Advanced mathematical problem-solving test designed for INMO preparation with proof-based questions.',
      richDescription: `The Indian National Mathematical Olympiad (INMO) is the second stage of the mathematical olympiad program in India. This mock test simulates the actual INMO experience with challenging proof-based problems.

<strong>Key Features:</strong>
<ul>
<li>6 challenging problems requiring complete mathematical proofs</li>
<li>4-hour time limit to match actual INMO conditions</li>
<li>Problems from advanced topics in algebra, geometry, number theory, and combinatorics</li>
<li>Detailed solutions and alternative approaches provided</li>
</ul>

<strong>Difficulty Level:</strong> This test is designed for students who have successfully cleared RMO and are preparing for the national level competition. Problems require deep mathematical insight and rigorous proof techniques.

<strong>Note:</strong> This is an advanced level test. Ensure you have strong foundations in mathematical reasoning before attempting.`,
      price: 50,
      duration: 240,
      isActive: true,
      isFree: false,
      examCategoryName: 'Mathematical Olympiads'
    },
    {
      title: 'International Mathematical Olympiad (IMO) Preparation',
      description: 'Elite-level mathematical olympiad preparation with challenging problems from various mathematical domains.',
      richDescription: `The International Mathematical Olympiad (IMO) is the most prestigious mathematical competition for high school students worldwide. This preparation test features problems of IMO caliber to help students reach the highest level of mathematical problem-solving.

<strong>What Makes This Special:</strong>
<ul>
<li>Problems inspired by actual IMO competitions from recent years</li>
<li>Covers all major areas: Algebra, Combinatorics, Geometry, and Number Theory</li>
<li>Each problem requires innovative thinking and elegant solutions</li>
<li>Comprehensive analysis of problem-solving strategies</li>
</ul>

<strong>Target Audience:</strong> This test is designed for:
<ul>
<li>INMO qualifiers preparing for IMO selection</li>
<li>Advanced students seeking to challenge themselves</li>
<li>Mathematics enthusiasts who enjoy beautiful problems</li>
</ul>

<strong>Goal:</strong> Develop the mathematical maturity and problem-solving skills needed for international competition.`,
      price: 100,
      duration: 270,
      isActive: true,
      isFree: false,
      examCategoryName: 'Mathematical Olympiads'
    },

    // JEE Examinations
    {
      title: 'JEE Main Physics Mock Test - Mechanics',
      description: 'Comprehensive physics mock test focusing on mechanics, kinematics, and dynamics for JEE Main preparation.',
      richDescription: `Master the fundamental concepts of mechanics with this comprehensive mock test designed specifically for JEE Main aspirants. Mechanics forms the backbone of physics and is crucial for success in JEE.

<strong>Topics Covered:</strong>
<ul>
<li><strong>Kinematics:</strong> Motion in one and two dimensions, projectile motion</li>
<li><strong>Laws of Motion:</strong> Newton's laws, friction, circular motion</li>
<li><strong>Work, Energy & Power:</strong> Conservation laws, collisions</li>
<li><strong>Rotational Motion:</strong> Moment of inertia, angular momentum</li>
<li><strong>Gravitation:</strong> Universal law, planetary motion, satellites</li>
</ul>

<strong>Exam Pattern:</strong> 25 multiple choice questions with negative marking (-1 for wrong answers). Time limit: 2 hours.

<strong>Strategy:</strong> Focus on conceptual clarity and practice numerical problems regularly.`,
      price: 30,
      duration: 120,
      isActive: true,
      isFree: false,
      examCategoryName: 'JEE Main & Advanced'
    },

    {
      title: 'JEE Advanced Mock Test - Full Syllabus',
      description: 'Complete JEE Advanced mock test covering all subjects with advanced level questions.',
      richDescription: `Experience the rigor of JEE Advanced with this comprehensive mock test that mirrors the actual exam pattern and difficulty level. This test is designed for serious JEE Main qualifiers aiming for IITs.

<strong>Exam Structure:</strong>
<ul>
<li><strong>Paper 1:</strong> Physics, Chemistry, Mathematics (3 hours)</li>
<li><strong>Multiple Question Types:</strong> MCQs, Numerical, Match the following</li>
<li><strong>Advanced Level:</strong> Conceptual and analytical questions</li>
<li><strong>Negative Marking:</strong> Varies by question type</li>
</ul>

<strong>Key Features:</strong>
<ul>
<li>Questions designed by IIT faculty and experts</li>
<li>Detailed solutions with multiple approaches</li>
<li>Performance analysis and rank prediction</li>
<li>Topic-wise strength and weakness report</li>
</ul>

<strong>Challenge Level:</strong> This test is equivalent to actual JEE Advanced difficulty. Attempt only if you're confident with JEE Main level problems.`,
      price: 75,
      duration: 180,
      isActive: true,
      isFree: false,
      examCategoryName: 'JEE Main & Advanced'
    },

    // NEET Examinations
    {
      title: 'NEET Biology Mock Test - Botany & Zoology',
      description: 'Comprehensive biology mock test covering botany, zoology, and human physiology for NEET preparation.',
      richDescription: `Biology is the highest scoring section in NEET with 50% weightage. This comprehensive mock test covers all major topics from Class 11 and 12 biology syllabus.

<strong>Botany Topics:</strong>
<ul>
<li><strong>Plant Physiology:</strong> Photosynthesis, respiration, transport</li>
<li><strong>Plant Reproduction:</strong> Sexual and asexual reproduction</li>
<li><strong>Genetics:</strong> Mendel's laws, molecular basis of inheritance</li>
<li><strong>Ecology:</strong> Ecosystem, biodiversity, environmental issues</li>
</ul>

<strong>Zoology Topics:</strong>
<ul>
<li><strong>Human Physiology:</strong> Digestive, respiratory, circulatory systems</li>
<li><strong>Reproduction:</strong> Human reproductive system, development</li>
<li><strong>Evolution:</strong> Origin of life, evidence of evolution</li>
<li><strong>Biotechnology:</strong> Principles and applications</li>
</ul>

<strong>Scoring Strategy:</strong> Biology can make or break your NEET score. Focus on NCERT and practice diagrams.`,
      price: 25,
      duration: 120,
      isActive: true,
      isFree: false,
      examCategoryName: 'NEET'
    },

    {
      title: 'NEET Full Mock Test',
      description: 'Complete NEET mock test with all subjects - Physics, Chemistry, and Biology.',
      richDescription: `Experience the complete NEET examination with this full-length mock test that replicates the actual exam conditions, timing, and difficulty level.

<strong>Complete Exam Structure:</strong>
<ul>
<li><strong>Physics:</strong> 45 questions (180 marks)</li>
<li><strong>Chemistry:</strong> 45 questions (180 marks)</li>
<li><strong>Biology:</strong> 90 questions (360 marks)</li>
<li><strong>Total:</strong> 180 questions, 720 marks, 3 hours</li>
</ul>

<strong>Key Features:</strong>
<ul>
<li>Exact NEET exam interface and timing</li>
<li>Subject-wise and overall performance analysis</li>
<li>All India rank prediction</li>
<li>Detailed solutions with explanations</li>
<li>Weak area identification and improvement tips</li>
</ul>

<strong>Exam Readiness:</strong> This test will help you assess your preparation level and build confidence for the actual NEET exam.`,
      price: 50,
      duration: 180,
      isActive: true,
      isFree: true,
      examCategoryName: 'NEET'
    },

    // UPSC Civil Services
    {
      title: 'UPSC Prelims - General Studies Paper 1',
      description: 'UPSC Civil Services Preliminary examination practice test for General Studies Paper 1.',
      richDescription: `The first paper of UPSC Civil Services Preliminary examination is crucial for qualifying to the Mains. This comprehensive test covers the vast GS syllabus with current affairs integration.

<strong>Syllabus Coverage:</strong>
<ul>
<li><strong>History:</strong> Ancient, Medieval, and Modern Indian History</li>
<li><strong>Geography:</strong> Physical, Human, and Economic Geography of India and World</li>
<li><strong>Polity:</strong> Indian Constitution, Governance, and Political System</li>
<li><strong>Economics:</strong> Indian Economy and Economic Development</li>
<li><strong>Environment:</strong> Ecology, Biodiversity, and Climate Change</li>
<li><strong>Science & Technology:</strong> Developments and Applications</li>
<li><strong>Current Affairs:</strong> National and International importance</li>
</ul>

<strong>Exam Strategy:</strong> 100 questions, 2 hours, negative marking of 1/3. Focus on accuracy and current affairs integration.

<strong>UPSC Success Tip:</strong> Read newspapers daily and connect current events with static portions of the syllabus.`,
      price: 40,
      duration: 120,
      isActive: true,
      isFree: false,
      examCategoryName: 'UPSC Civil Services'
    },
    {
      title: 'UPSC Prelims - CSAT (Paper 2)',
      description: 'Civil Services Aptitude Test focusing on comprehension, logical reasoning, and analytical ability.',
      richDescription: `The Civil Services Aptitude Test (CSAT) is a qualifying paper that tests your analytical and logical reasoning abilities. Though qualifying in nature, it's essential to score above 33% to proceed to Mains.

<strong>Key Areas:</strong>
<ul>
<li><strong>Comprehension:</strong> Reading passages and answering questions</li>
<li><strong>Logical Reasoning:</strong> Analytical and logical problems</li>
<li><strong>Mathematical Aptitude:</strong> Basic numeracy and data interpretation</li>
<li><strong>Decision Making:</strong> Problem-solving and decision-making scenarios</li>
<li><strong>General Mental Ability:</strong> Spatial reasoning and pattern recognition</li>
</ul>

<strong>Preparation Strategy:</strong> Focus on speed and accuracy. Practice comprehension passages and basic mathematics regularly.

<strong>Important:</strong> Don't neglect CSAT! Many candidates fail to qualify due to poor CSAT performance despite good GS scores.`,
      price: 40,
      duration: 120,
      isActive: true,
      isFree: false,
      examCategoryName: 'UPSC Civil Services'
    },

    // SSC Examinations
    {
      title: 'SSC CGL Tier 1 Mock Test',
      description: 'Staff Selection Commission Combined Graduate Level Tier 1 examination practice test.',
      richDescription: `The SSC Combined Graduate Level (CGL) Tier 1 is the first stage of one of India's most popular government job examinations. This mock test is designed to help you crack the preliminary stage.

<strong>Exam Sections:</strong>
<ul>
<li><strong>General Intelligence & Reasoning:</strong> 25 questions - Logical reasoning, puzzles, coding-decoding</li>
<li><strong>General Awareness:</strong> 25 questions - Current affairs, history, geography, science</li>
<li><strong>Quantitative Aptitude:</strong> 25 questions - Mathematics, data interpretation</li>
<li><strong>English Comprehension:</strong> 25 questions - Grammar, vocabulary, reading comprehension</li>
</ul>

<strong>Exam Pattern:</strong> 100 questions, 60 minutes, 2 marks each, negative marking of 0.5 marks for wrong answers.

<strong>Success Strategy:</strong> Focus on accuracy over speed. Each section has equal weightage, so balanced preparation is key.`,
      price: 20,
      duration: 60,
      isActive: true,
      isFree: true,
      examCategoryName: 'SSC Examinations'
    },


    // Banking Examinations
    {
      title: 'IBPS PO Preliminary Exam',
      description: 'Institute of Banking Personnel Selection Probationary Officer preliminary examination.',
      richDescription: `The IBPS PO (Probationary Officer) examination is one of the most sought-after banking exams in India. This prelims mock test helps you prepare for the first stage of selection.

<strong>Exam Sections:</strong>
<ul>
<li><strong>English Language:</strong> 30 questions, 20 minutes - Reading comprehension, grammar, vocabulary</li>
<li><strong>Quantitative Aptitude:</strong> 35 questions, 20 minutes - Arithmetic, algebra, geometry, data interpretation</li>
<li><strong>Reasoning Ability:</strong> 35 questions, 20 minutes - Logical reasoning, puzzles, seating arrangement</li>
</ul>

<strong>Career Prospects:</strong> Probationary Officers are future managers of banks with excellent growth opportunities, attractive salary packages, and job security.

<strong>Exam Strategy:</strong> Time management is crucial. Each section has individual timing and cut-off marks.`,
      price: 25,
      duration: 60,
      isActive: true,
      isFree: false,
      examCategoryName: 'Banking Examinations'
    },
    {
      title: 'SBI Clerk Mock Test',
      description: 'State Bank of India Clerk examination covering reasoning, numerical ability, and English language.',
      richDescription: `The SBI Clerk examination is conducted for recruitment of clerical cadre in State Bank of India. This is an entry-level position in the banking sector with good career growth prospects.

<strong>Prelims Pattern:</strong>
<ul>
<li><strong>English Language:</strong> 30 questions, 20 minutes</li>
<li><strong>Numerical Ability:</strong> 35 questions, 20 minutes</li>
<li><strong>Reasoning Ability:</strong> 35 questions, 20 minutes</li>
</ul>

<strong>Job Profile:</strong> Bank clerks handle customer service, cash transactions, account opening, and various banking operations at branch level.

<strong>Career Growth:</strong> Clerks can get promoted to Officer cadre through internal exams and gain banking experience from ground level.`,
      price: 20,
      duration: 60,
      isActive: true,
      isFree: false,
      examCategoryName: 'Banking Examinations'
    },
    {
      title: 'RBI Grade B Mock Test',
      description: 'Reserve Bank of India Grade B Officer examination for various specialist positions.',
      richDescription: `Reserve Bank of India Grade B Officer is one of the most prestigious positions in the banking and financial sector. RBI officers enjoy excellent career prospects and are part of India's central banking system.

<strong>Exam Structure:</strong>
<ul>
<li><strong>Phase I:</strong> General Awareness, English Language, Quantitative Aptitude, Reasoning</li>
<li><strong>Phase II:</strong> Economic and Social Issues, English (Descriptive), Finance and Management</li>
<li><strong>Interview:</strong> Final selection round</li>
</ul>

<strong>Career Benefits:</strong> Starting salary around ₹35,000 per month with excellent perks, housing facilities, medical benefits, and opportunities to work in monetary policy formulation.

<strong>Why RBI Grade B:</strong> Work with India's central bank, policy making roles, research opportunities, and highest respect in banking sector.`,
      price: 50,
      duration: 120,
      isActive: true,
      isFree: false,
      examCategoryName: 'Banking Examinations'
    },

    // Defense Examinations
    {
      title: 'NDA Mock Test',
      description: 'National Defence Academy examination for Army, Navy, and Air Force training.',
      price: 30,
      duration: 150,
      isActive: true,
      isFree: false,
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
      examCategoryName: 'Teaching Examinations'
    },

  ];

  // Get all created questions first to determine available questions per category
  const allQuestions = await prisma.question.findMany();
  
  // Create exams with proper category references
  const createdExams = [];
  for (const examData of indianExams) {
    const examCategory = createdExamCategories[examData.examCategoryName];
    
    // Determine available questions for this exam category
    let availableQuestions = [];
    const categoryName = examCategory?.name ?? '';
    
    if (categoryName && (categoryName.includes('Mathematical') || categoryName.includes('JEE') || categoryName.includes('NEET'))) {
      // For academic exams, include Math, Physics, Chemistry, Biology questions
      availableQuestions = allQuestions.filter(q => {
        const category = Object.values(createdCategories).find(cat => cat.id === q.categoryId);
        return category && ['Mathematics', 'Physics', 'Chemistry', 'Biology'].includes(category.name);
      });
    } else {
      // For competitive exams, include GK, Reasoning, English, Quantitative Aptitude
      availableQuestions = allQuestions.filter(q => {
        const category = Object.values(createdCategories).find(cat => cat.id === q.categoryId);
        return category && ['General Knowledge', 'Reasoning', 'English', 'Quantitative Aptitude'].includes(category.name);
      });
      
      // If no specific questions found, include some math questions as well
      if (availableQuestions.length === 0) {
        availableQuestions = allQuestions.filter(q => {
          const category = Object.values(createdCategories).find(cat => cat.id === q.categoryId);
          return category && ['Mathematics', 'General Knowledge', 'Reasoning'].includes(category.name);
        });
      }
    }
    
    // If still no questions, use all available questions
    if (availableQuestions.length === 0) {
      availableQuestions = allQuestions;
    }
    
    // Set questionsToServe to be less than available questions (80% of available or max 80)
    const maxQuestionsToServe = Math.min(80, Math.floor(availableQuestions.length * 0.8));
    const questionsToServe = Math.max(10, maxQuestionsToServe); // Minimum 10 questions
    
    const exam = await prisma.exam.create({
      data: {
        title: examData.title,
        description: examData.description,
        richDescription: examData.richDescription,
        price: examData.price,
        duration: examData.duration,
        isActive: examData.isActive,
        isFree: examData.isFree,

        examCategoryId: examCategory.id,
        createdById: adminUser.id,
        questionsToServe: questionsToServe,
      },
    });
    createdExams.push(exam);
  }

  console.log('✅ Indian competitive exams created');

  // Add questions to exams by creating exam-question relationships
  console.log('🔗 Creating exam-question relationships...');
  
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
