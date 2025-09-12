import { User, Exam, Question, Category, Subcategory, ExamAttempt, Transaction } from '@prisma/client'

// Extended types for UI components
export interface ExamWithDetails extends Exam {
  _count: {
    examQuestions: number
    examAttempts: number
  }
  createdBy: {
    firstName: string | null
    lastName: string | null
  }
}

export interface QuestionWithDetails extends Question {
  category: Category
  subcategory?: Subcategory | null
}

export interface ExamAttemptWithDetails extends ExamAttempt {
  exam: Exam
  answers: Array<{
    questionId: string
    selectedAnswer: string | null
    isCorrect: boolean | null
    marksObtained: number
  }>
}

export interface UserWithStats extends User {
  _count: {
    examAttempts: number
    transactions: number
  }
  stats?: {
    totalExamsAttempted: number
    averageScore: number
    totalCreditsSpent: number
  }
}

// Question processing API response types
export interface QuestionAPIResponse {
  message: string
  original_image_url: string
  processed_images: {
    figures: Array<{
      bbox: number[]
      confidence: number
      url: string
    }>
    processed_image: string
  }
  roboflow_detection: {
    image: {
      height: number
      width: number
    }
    inference_id: string
    predictions: Array<{
      class: string
      class_id: number
      confidence: number
      detection_id: string
      height: number
      width: number
      x: number
      y: number
    }>
    time: number
  }
  success: boolean
  transcription: {
    figures_detected: number
    processing_status: string
    raw_response: string
    transcription: {
      confidence: number
      figures: Array<{
        description: string
        id: string
      }>
      options: {
        A: string
        B: string
        C: string
        D: string
      }
      question_text: string
    }
  }
}

// Exam taking session state
export interface ExamSession {
  attemptId: string
  examId: string
  currentQuestionIndex: number
  answers: Record<string, string | null>
  timeRemaining: number
  isSubmitted: boolean
  startTime: Date
}

// Navigation types
export interface NavItem {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string | number
}

// Filter and sort types
export interface ExamFilters {
  category?: string
  difficulty?: string
  priceRange?: [number, number]
  duration?: [number, number]
  isFree?: boolean
}

export interface QuestionFilters {
  categoryId?: string
  subcategoryId?: string
  class?: number
  difficultyLevel?: string
  tags?: string[]
}

// Payment types
export interface PaymentOptions {
  amount: number
  credits: number
  description: string
}

export interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

// Dashboard stats
export interface AdminDashboardStats {
  totalUsers: number
  totalExams: number
  totalQuestions: number
  totalRevenue: number
  activeExamAttempts: number
  recentTransactions: Transaction[]
}

export interface StudentDashboardStats {
  examsTaken: number
  averageScore: number
  creditsRemaining: number
  lastExamDate: Date | null
  recentAttempts: ExamAttemptWithDetails[]
}
