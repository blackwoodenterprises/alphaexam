import { prisma } from "@/lib/prisma";
import { ExamsManagementClient } from "../../../components/admin/exams-management-client";

async function getExams() {
  try {
    const exams = await prisma.exam.findMany({
      include: {
        examCategory: {
          select: {
            name: true,
          },
        },
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
      orderBy: { createdAt: "desc" },
    });

    return exams;
  } catch (error) {
    console.error("Error fetching exams:", error);
    return [];
  }
}

async function getExamStats() {
  try {
    const [totalExams, activeExams, totalAttempts, totalRevenue] =
      await Promise.all([
        prisma.exam.count(),
        prisma.exam.count({ where: { isActive: true } }),
        prisma.examAttempt.count(),
        prisma.transaction.aggregate({
          where: {
            status: "COMPLETED",
          },
          _sum: {
            amount: true,
          },
        }),
      ]);

    return {
      totalExams,
      activeExams,
      totalAttempts,
      totalRevenue: totalRevenue._sum.amount || 0,
    };
  } catch (error) {
    console.error("Error fetching exam stats:", error);
    return {
      totalExams: 0,
      activeExams: 0,
      totalAttempts: 0,
      totalRevenue: 0,
    };
  }
}

export default async function ExamsManagementPage() {
  const [exams, stats] = await Promise.all([getExams(), getExamStats()]);

  return <ExamsManagementClient exams={exams} stats={stats} />;
}
