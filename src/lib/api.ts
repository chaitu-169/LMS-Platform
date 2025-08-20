const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API utility functions
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (userData: { email: string; password: string; name: string; role: string }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getProfile: async () => {
    return apiRequest('/auth/profile');
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

// Courses API
export const coursesAPI = {
  getAll: async () => {
    return apiRequest('/courses');
  },

  getById: async (id: string) => {
    return apiRequest(`/courses/${id}`);
  },

  create: async (courseData: any) => {
    return apiRequest('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  },

  update: async (id: string, courseData: any) => {
    return apiRequest(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/courses/${id}`, {
      method: 'DELETE',
    });
  },

  enroll: async (courseId: string) => {
    return apiRequest(`/courses/${courseId}/enroll`, {
      method: 'POST',
    });
  },

  getEnrolled: async () => {
    return apiRequest('/courses/enrolled');
  },

  getInstructorCourses: async () => {
    return apiRequest('/courses/instructor');
  },
};

// Assessments API
export const assessmentsAPI = {
  getByCourse: async (courseId: string) => {
    return apiRequest(`/courses/${courseId}/assessments`);
  },

  getById: async (id: string) => {
    return apiRequest(`/assessments/${id}`);
  },

  create: async (assessmentData: any) => {
    return apiRequest('/assessments', {
      method: 'POST',
      body: JSON.stringify(assessmentData),
    });
  },

  update: async (id: string, assessmentData: any) => {
    return apiRequest(`/assessments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(assessmentData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/assessments/${id}`, {
      method: 'DELETE',
    });
  },

  submit: async (assessmentId: string, answers: any) => {
    return apiRequest(`/assessments/${assessmentId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  },

  getResults: async (assessmentId: string) => {
    return apiRequest(`/assessments/${assessmentId}/results`);
  },

  getStudentResults: async () => {
    return apiRequest('/assessments/results/student');
  },
};

// Progress API
export const progressAPI = {
  getByStudent: async (studentId: string) => {
    return apiRequest(`/progress/student/${studentId}`);
  },

  getByCourse: async (courseId: string) => {
    return apiRequest(`/progress/course/${courseId}`);
  },

  update: async (progressData: any) => {
    return apiRequest('/progress', {
      method: 'POST',
      body: JSON.stringify(progressData),
    });
  },

  getMyProgress: async () => {
    return apiRequest('/progress/my');
  },
};

// Analytics API
export const analyticsAPI = {
  getDashboard: async () => {
    return apiRequest('/analytics/dashboard');
  },

  getCourseStats: async (courseId: string) => {
    return apiRequest(`/analytics/course/${courseId}`);
  },

  getUserStats: async () => {
    return apiRequest('/analytics/user');
  },

  getInstructorStats: async () => {
    return apiRequest('/analytics/instructor');
  },

  getAdminStats: async () => {
    return apiRequest('/analytics/admin');
  },
};

// Users API (Admin only)
export const usersAPI = {
  getAll: async () => {
    return apiRequest('/users');
  },

  getById: async (id: string) => {
    return apiRequest(`/users/${id}`);
  },

  update: async (id: string, userData: any) => {
    return apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  getStudents: async () => {
    return apiRequest('/users/students');
  },

  getInstructors: async () => {
    return apiRequest('/users/instructors');
  },
};

// Enrollments API
export const enrollmentsAPI = {
  getAll: async () => {
    return apiRequest('/enrollments');
  },

  getByStudent: async (studentId: string) => {
    return apiRequest(`/enrollments/student/${studentId}`);
  },

  getByCourse: async (courseId: string) => {
    return apiRequest(`/enrollments/course/${courseId}`);
  },

  create: async (courseId: string) => {
    return apiRequest('/enrollments', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    });
  },

  delete: async (enrollmentId: string) => {
    return apiRequest(`/enrollments/${enrollmentId}`, {
      method: 'DELETE',
    });
  },
};