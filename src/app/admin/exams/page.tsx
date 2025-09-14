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
    const [totalExams, activeExams, totalAttempts, totalRevenue, completedAttempts, lastMonthAttempts] =
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
        prisma.examAttempt.count({
          where: { status: "COMPLETED" },
        }),
        prisma.examAttempt.count({
          where: {
            status: "COMPLETED",
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
        }),
      ]);

    // Calculate average duration from completed exams
    const completedAttemptsWithDuration = await prisma.examAttempt.findMany({
      where: {
        status: "COMPLETED",
        endTime: { not: null }
      },
      select: {
        startTime: true,
        endTime: true
      }
    });

    const avgDuration = completedAttemptsWithDuration.length > 0
      ? Math.round(
          completedAttemptsWithDuration.reduce((sum, attempt) => {
            const duration = attempt.endTime && attempt.startTime 
              ? (attempt.endTime.getTime() - attempt.startTime.getTime()) / (1000 * 60) // Convert to minutes
              : 0;
            return sum + duration;
          }, 0) / completedAttemptsWithDuration.length
        )
      : 0;

    // Calculate monthly growth
    const previousMonthAttempts = completedAttempts - lastMonthAttempts;
    const monthlyGrowth = previousMonthAttempts > 0 
      ? Math.round(((lastMonthAttempts - previousMonthAttempts) / previousMonthAttempts) * 100)
      : 0;

    return {
      totalExams,
      activeExams,
      totalAttempts,
      totalRevenue: totalRevenue._sum.amount || 0,
      avgDuration,
      monthlyGrowth,
    };
  } catch (error) {
    console.error("Error fetching exam stats:", error);
    return {
      totalExams: 0,
      activeExams: 0,
      totalAttempts: 0,
      totalRevenue: 0,
      avgDuration: 0,
      monthlyGrowth: 0,
    };
  }
}

export default async function ExamsManagementPage() {
  const [exams, stats] = await Promise.all([getExams(), getExamStats()]);

  return <ExamsManagementClient exams={exams} stats={stats} />;
}
