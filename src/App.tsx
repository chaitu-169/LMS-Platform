import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { Layout } from './components/Layout/Layout';
import { StudentDashboard } from './components/Dashboard/StudentDashboard';
import { InstructorDashboard } from './components/Dashboard/InstructorDashboard';
import { AdminDashboard } from './components/Dashboard/AdminDashboard';
import { CourseList } from './components/Courses/CourseList';
import { QuizComponent } from './components/Assessments/QuizComponent';
import { Course, Assessment } from './types';

// Mock data for demonstration - replace with real API calls
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learn the basics of React including components, props, state, and hooks. Perfect for beginners looking to start their React journey.',
    instructor_id: '1',
    instructor: { id: '1', email: 'sarah@example.com', name: 'Pranati', role: 'instructor', created_at: '2024-01-01' },
    price: 99,
    duration_hours: 20,
    level: 'beginner',
    image_url: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '2',
    title: 'Advanced JavaScript Patterns',
    description: 'Master advanced JavaScript concepts including closures, prototypes, async patterns, and design patterns.',
    instructor_id: '2',
    instructor: { id: '2', email: 'mike@example.com', name: 'Not you Buddy', role: 'instructor', created_at: '2024-01-01' },
    price: 149,
    duration_hours: 35,
    level: 'advanced',
    image_url: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: '3',
    title: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js, Express, and MongoDB. Includes authentication, APIs, and deployment.',
    instructor_id: '3',
    instructor: { id: '3', email: 'alex@example.com', name: 'Akira', role: 'instructor', created_at: '2024-01-01' },
    price: 199,
    duration_hours: 45,
    level: 'intermediate',
    image_url: 'https://images.pexels.com/photos/574073/pexels-photo-574073.jpeg?auto=compress&cs=tinysrgb&w=400',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
];

const mockAssessment: Assessment = {
  id: '1',
  course_id: '1',
  title: 'React Fundamentals Quiz',
  description: 'Test your knowledge of React basics',
  time_limit_minutes: 30,
  passing_score: 70,
  created_at: '2024-01-01',
  questions: [
    {
      id: '1',
      question: 'What is the purpose of the useState hook in React?',
      type: 'multiple_choice',
      options: [
        'To manage component state',
        'To handle side effects',
        'To create refs',
        'To optimize performance'
      ],
      correct_answer: 0,
      points: 10,
    },
    {
      id: '2',
      question: 'React components must return a single parent element.',
      type: 'true_false',
      correct_answer: false,
      points: 10,
    },
    {
      id: '3',
      question: 'Explain the difference between props and state in React.',
      type: 'essay',
      correct_answer: 'Props are read-only data passed from parent to child components, while state is mutable data managed within a component.',
      points: 20,
    },
  ],
};

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showQuiz, setShowQuiz] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const handleEnroll = (courseId: string) => {
    console.log('Enrolling in course:', courseId);
    // Implement enrollment logic with API call
  };

  const handleQuizSubmit = (answers: Record<string, any>) => {
    console.log('Quiz submitted:', answers);
    setShowQuiz(false);
    // Implement quiz submission logic with API call
  };

  const getDashboardComponent = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'instructor':
        return <InstructorDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  const getTabContent = () => {
    if (showQuiz) {
      return <QuizComponent assessment={mockAssessment} onSubmit={handleQuizSubmit} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return getDashboardComponent();
      case 'courses':
      case 'my-courses':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {activeTab === 'courses' ? 'Browse Courses' : 'My Courses'}
                </h1>
                <p className="text-gray-600 mt-2">
                  {activeTab === 'courses' 
                    ? 'Discover new courses and expand your knowledge' 
                    : 'Continue your learning journey'
                  }
                </p>
              </div>
              {user.role === 'instructor' && (
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Create New Course
                </button>
              )}
            </div>
            <CourseList 
              courses={mockCourses} 
              onEnroll={handleEnroll}
              showEnrollButton={activeTab === 'courses'}
            />
          </div>
        );
      case 'assessments':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Assessments</h1>
                <p className="text-gray-600 mt-2">Test your knowledge and track your progress</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">React Fundamentals Quiz</h3>
                <p className="text-gray-600 text-sm mb-4">Test your basic React knowledge</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>30 minutes</span>
                  <span>40 points</span>
                </div>
                <button
                  onClick={() => setShowQuiz(true)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600 mt-2">Manage platform users and permissions</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-gray-600">User management interface will be implemented here.</p>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-600 mt-2">Platform performance and insights</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-gray-600">Advanced analytics dashboard will be implemented here.</p>
            </div>
          </div>
        );
      case 'students':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
                <p className="text-gray-600 mt-2">Track student progress and engagement</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-gray-600">Student management interface will be implemented here.</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-2">Manage your account and preferences</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-gray-600">Settings interface will be implemented here.</p>
            </div>
          </div>
        );
      default:
        return getDashboardComponent();
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {getTabContent()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;