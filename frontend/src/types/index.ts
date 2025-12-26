export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin' | 'admin_helper';
  phone?: string;
  avatar?: {
    public_id: string;
    url: string;
  };
  gender?: string;
  parentName?: string;
  bio?: string;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  isEmailVerified: boolean;
  isActive: boolean;
  isApproved: boolean;
  preferences?: {
    emailNotifications: boolean;
    inAppNotifications: boolean;
    newsletter: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InstructorProfile {
  _id: string;
  user: string | User;
  headline?: string;
  biography?: string;
  expertise: string[];
  qualifications: {
    degree: string;
    institution: string;
    year: number;
  }[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description?: string;
  }[];
  totalStudents: number;
  totalCourses: number;
  totalReviews: number;
  averageRating: number;
  totalEarnings: number;
  pendingPayout: number;
  isVerified: boolean;
  commissionRate: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: {
    public_id: string;
    url: string;
  };
  parent?: string | Category;
  subcategories?: Category[];
  isActive: boolean;
  courseCount: number;
}

export interface Course {
  _id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  instructor: User;
  category: Category;
  subcategory?: Category;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
  language: string;
  thumbnail: {
    public_id?: string;
    url: string;
  };
  promoVideo?: {
    public_id: string;
    url: string;
    duration?: number;
  };
  price: number;
  discountPrice?: number;
  discountValidUntil?: string;
  isFree: boolean;
  whatYouWillLearn: string[];
  requirements: string[];
  targetAudience: string[];
  tags: string[];
  curriculum: {
    sectionTitle: string;
    sectionDescription?: string;
    order: number;
    lessons: Lesson[];
  }[];
  totalLessons: number;
  totalDuration: number;
  totalSections: number;
  enrollmentCount: number;
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    five: number;
    four: number;
    three: number;
    two: number;
    one: number;
  };
  status: 'draft' | 'pending_review' | 'published' | 'rejected' | 'archived';
  isApproved: boolean;
  isFeatured: boolean;
  publishedAt?: string;
  welcomeMessage?: string;
  congratulationsMessage?: string;
  certificateEnabled: boolean;
  certificateCompletionThreshold: number;
  hasQuiz: boolean;
  effectivePrice?: number;
  discountPercentage?: number;
  formattedDuration?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  _id: string;
  title: string;
  course: string;
  sectionIndex: number;
  order: number;
  type: 'video' | 'text' | 'quiz' | 'assignment' | 'resource';
  content: {
    video?: {
      public_id: string;
      url: string;
      duration?: number;
    };
    text?: string;
    quizId?: string;
  };
  description?: string;
  resources: {
    title: string;
    type: 'pdf' | 'ppt' | 'doc' | 'zip' | 'link' | 'other';
    url: string;
    public_id?: string;
    size?: number;
    downloadable: boolean;
  }[];
  duration: number;
  isFreePreview: boolean;
  isPublished: boolean;
  formattedDuration?: string;
}

export interface Enrollment {
  _id: string;
  user: string | User;
  course: string | Course;
  enrolledAt: string;
  enrollmentType: 'free' | 'paid' | 'gifted' | 'promotional';
  payment?: string;
  pricePaid: number;
  progress: {
    completedLessons: string[];
    currentLesson?: string;
    lastAccessedAt?: string;
    totalWatchTime: number;
    percentComplete: number;
  };
  status: 'active' | 'completed' | 'expired' | 'refunded' | 'suspended';
  completedAt?: string;
  certificate?: string;
  rating?: {
    value: number;
    review?: string;
    reviewedAt?: string;
  };
  bookmarks: {
    lesson: string;
    timestamp: number;
    note?: string;
    createdAt: string;
  }[];
}

export interface Progress {
  _id: string;
  user: string;
  course: string;
  lesson: string;
  enrollment: string;
  watchedDuration: number;
  totalDuration: number;
  lastPosition: number;
  watchPercentage: number;
  isCompleted: boolean;
  completedAt?: string;
}

export interface Note {
  _id: string;
  user: string;
  course: string | Course;
  lesson: string | Lesson;
  enrollment: string;
  title?: string;
  content: string;
  timestamp: number;
  color: 'default' | 'yellow' | 'green' | 'blue' | 'pink' | 'purple';
  tags: string[];
  isPrivate: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Doubt {
  _id: string;
  user: User;
  course: Course;
  lesson?: Lesson;
  enrollment: string;
  title: string;
  description: string;
  attachments: {
    type: 'image' | 'document' | 'link';
    url: string;
    name?: string;
  }[];
  videoTimestamp?: number;
  status: 'open' | 'answered' | 'closed' | 'flagged';
  priority: 'low' | 'medium' | 'high';
  category: 'concept' | 'technical' | 'assignment' | 'other';
  replies: DoubtReply[];
  totalReplies: number;
  upvotes: string[];
  views: number;
  isResolved: boolean;
  resolvedAt?: string;
  createdAt: string;
}

export interface DoubtReply {
  _id: string;
  responder: User;
  content: string;
  attachments: {
    type: 'image' | 'document' | 'link';
    url: string;
    name?: string;
  }[];
  isInstructorReply: boolean;
  isAdminReply: boolean;
  isAcceptedAnswer: boolean;
  upvotes: string[];
  createdAt: string;
}

export interface Test {
  _id: string;
  title: string;
  description?: string;
  course: string;
  instructor: string;
  lesson?: string;
  type: 'practice' | 'quiz' | 'section_test' | 'final_exam' | 'mock_test';
  questions: Question[];
  totalQuestions: number;
  totalMarks: number;
  passingMarks: number;
  duration: number;
  isTimed: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  negativeMarking: {
    enabled: boolean;
    percentage: number;
  };
  attemptLimits: {
    maxAttempts: number;
    cooldownPeriod: number;
  };
  instructions?: string;
  isPublished: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  formattedDuration?: string;
}

export interface Question {
  _id: string;
  type: 'mcq' | 'true_false' | 'multiple_select' | 'fill_blank' | 'short_answer';
  question: string;
  questionImage?: {
    url: string;
  };
  options: {
    text: string;
    image?: {
      url: string;
    };
    isCorrect?: boolean;
  }[];
  correctAnswer?: any;
  explanation?: string;
  marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  topic?: string;
  hint?: string;
}

export interface TestResult {
  _id: string;
  user: string;
  test: string;
  course: string;
  enrollment: string;
  attemptNumber: number;
  startedAt: string;
  submittedAt?: string;
  timeTaken: number;
  status: 'in_progress' | 'submitted' | 'timed_out' | 'abandoned';
  answers: {
    question: string | Question;
    selectedAnswer: any;
    isCorrect?: boolean;
    marksObtained?: number;
    timeTaken?: number;
  }[];
  score: {
    totalMarks: number;
    obtainedMarks: number;
    percentage: number;
    correctCount: number;
    incorrectCount: number;
    unansweredCount: number;
    negativeMarks: number;
  };
  passed: boolean;
  rank?: number;
  percentile?: number;
  strengthAreas: { topic: string; score: number }[];
  weakAreas: { topic: string; score: number }[];
}

export interface Certificate {
  _id: string;
  certificateId: string;
  user: string | User;
  course: string | Course;
  enrollment: string;
  instructor: string | User;
  studentName: string;
  courseName: string;
  instructorName: string;
  completionDate: string;
  issueDate: string;
  completionPercentage: number;
  totalHours: number;
  grade: string;
  file?: {
    public_id: string;
    url: string;
  };
  verificationUrl: string;
  qrCode?: string;
  isValid: boolean;
  downloadCount: number;
}

export interface Payment {
  _id: string;
  orderId: string;
  user: string | User;
  course: string | Course;
  instructor: string | User;
  amount: {
    original: number;
    discount: number;
    final: number;
    currency: string;
  };
  couponCode?: string;
  paymentMethod: string;
  paymentGateway: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  refund: {
    isRefunded: boolean;
    refundedAmount: number;
    refundReason?: string;
    refundedAt?: string;
  };
  revenue: {
    platformCommission: number;
    instructorEarnings: number;
    commissionRate: number;
  };
  paidAt?: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  user: string;
  type: string;
  title: string;
  message: string;
  data?: {
    courseId?: string;
    lessonId?: string;
    doubtId?: string;
    testId?: string;
    certificateId?: string;
    paymentId?: string;
    link?: string;
  };
  icon?: string;
  isRead: boolean;
  readAt?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionText?: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  user: User;
  course: string;
  enrollment: string;
  rating: number;
  title?: string;
  review: string;
  pros?: string[];
  cons?: string[];
  helpfulCount: number;
  instructorResponse?: {
    content: string;
    respondedAt: string;
  };
  isEdited: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  timestamp: string;
}
