export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'instructor' | 'student';
  created_at: string;
  avatar_url?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  instructor?: User;
  price: number;
  duration_hours: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  image_url?: string;
  video_url?: string;
  materials?: string[];
  created_at: string;
  updated_at: string;
  maxEnrollments?: number;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  enrolled_at: string;
  progress_percentage: number;
  completed_at?: string;
  student?: User;
  course?: Course;
}

export interface Assessment {
  id: string;
  course_id: string;
  title: string;
  description: string;
  questions: Question[];
  time_limit_minutes?: number;
  passing_score: number;
  created_at: string;
}

export interface Question {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'essay';
  options?: string[];
  correct_answer: string | number | boolean;
  points: number;
}

export interface AssessmentResult {
  id: string;
  assessment_id: string;
  student_id: string;
  answers: Record<string, any>;
  score: number;
  total_points: number;
  completed_at: string;
  time_taken_minutes: number;
}

export interface ProgressTracking {
  id: string;
  student_id: string;
  course_id: string;
  lesson_id: string;
  completed: boolean;
  time_spent_minutes: number;
  last_accessed: string;
}