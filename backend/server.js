const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const app = express();

const allowedOrigins = [
  'https://your-frontend.vercel.app', // ✅ Your live frontend
  'http://localhost:5173',            // ✅ For local dev
  'http://localhost:3000'
];

// Middleware

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms_database')
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));


// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  createdAt: { type: Date, default: Date.now }
});

// Course Schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  instructorName: String,
  category: String,
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  duration: String,
  price: { type: Number, default: 0 },
  image: String,
  materials: [{
    type: { type: String, enum: ['video', 'document', 'link'] },
    title: String,
    url: String,
    duration: String
  }],
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxEnrollments: { 
    type: Number, 
    default: null, 
    validate: {
      validator: function(value) {
        return value === null || value > 0;
      },
      message: 'Max enrollments must be a positive number or null'
    }
  },
  createdAt: { type: Date, default: Date.now }
});

// Assessment Schema
const assessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [{
    question: { type: String, required: true },
    type: { type: String, enum: ['multiple-choice', 'true-false', 'short-answer'], default: 'multiple-choice' },
    options: [String],
    correctAnswer: String,
    points: { type: Number, default: 1 }
  }],
  totalPoints: Number,
  timeLimit: Number, // in minutes
  attempts: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Assessment Result Schema
const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assessment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  answers: [{
    questionIndex: Number,
    answer: String,
    isCorrect: Boolean,
    points: Number
  }],
  score: Number,
  totalPoints: Number,
  percentage: Number,
  timeSpent: Number, // in minutes
  submittedAt: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);
const Assessment = mongoose.model('Assessment', assessmentSchema);
const Result = mongoose.model('Result', resultSchema);

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Role-based access middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

// AUTH ROUTES
// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'student'
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// COURSE ROUTES
// Get all courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get enrolled courses
app.get('/api/courses/enrolled', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('enrolledCourses');
    res.json(user.enrolledCourses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get instructor courses
app.get('/api/courses/instructor', authenticateToken, requireRole(['instructor', 'admin']), async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get course by ID
app.get('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create course
app.post('/api/courses', authenticateToken, requireRole(['instructor', 'admin']), async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      instructor: req.user.id,
      instructorName: req.user.name
    };

    const course = new Course(courseData);
    await course.save();
    
    const populatedCourse = await Course.findById(course._id).populate('instructor', 'name email');
    res.status(201).json(populatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update course
app.put('/api/courses/:id', authenticateToken, requireRole(['instructor', 'admin']), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user owns the course or is admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('instructor', 'name email');
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete course
app.delete('/api/courses/:id', authenticateToken, requireRole(['instructor', 'admin']), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user owns the course or is admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Enroll in course
app.post('/api/courses/:id/enroll', authenticateToken, requireRole(['student']), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await User.findById(req.user.id);
    
    // Check if already enrolled
    if (user.enrolledCourses.includes(req.params.id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Add to user's enrolled courses
    user.enrolledCourses.push(req.params.id);
    await user.save();

    // Add to course's enrolled students
    course.enrolledStudents.push(req.user.id);
    await course.save();

    res.json({ message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ASSESSMENT ROUTES
// Get course assessments
app.get('/api/courses/:courseId/assessments', authenticateToken, async (req, res) => {
  try {
    const assessments = await Assessment.find({ 
      course: req.params.courseId, 
      isActive: true 
    }).populate('course', 'title');
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create assessment
app.post('/api/assessments', authenticateToken, requireRole(['instructor', 'admin']), async (req, res) => {
  try {
    const assessmentData = {
      ...req.body,
      instructor: req.user.id
    };

    // Calculate total points
    assessmentData.totalPoints = assessmentData.questions.reduce((total, q) => total + (q.points || 1), 0);

    const assessment = new Assessment(assessmentData);
    await assessment.save();

    const populatedAssessment = await Assessment.findById(assessment._id).populate('course', 'title');
    res.status(201).json(populatedAssessment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get assessment by ID
app.get('/api/assessments/:id', authenticateToken, async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate('course', 'title');
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Submit assessment
app.post('/api/assessments/:id/submit', authenticateToken, requireRole(['student']), async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const { answers, timeSpent } = req.body;
    
    // Calculate score
    let score = 0;
    const gradedAnswers = [];

    answers.forEach((answer, index) => {
      const question = assessment.questions[index];
      const isCorrect = question.correctAnswer === answer.answer;
      const points = isCorrect ? (question.points || 1) : 0;
      
      score += points;
      gradedAnswers.push({
        questionIndex: index,
        answer: answer.answer,
        isCorrect,
        points
      });
    });

    const percentage = Math.round((score / assessment.totalPoints) * 100);

    const result = new Result({
      student: req.user.id,
      assessment: req.params.id,
      course: assessment.course,
      answers: gradedAnswers,
      score,
      totalPoints: assessment.totalPoints,
      percentage,
      timeSpent
    });

    await result.save();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student results
app.get('/api/assessments/results/student', authenticateToken, requireRole(['student']), async (req, res) => {
  try {
    const results = await Result.find({ student: req.user.id })
      .populate('assessment', 'title')
      .populate('course', 'title');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// USER MANAGEMENT ROUTES (Admin only)
// Get all users
app.get('/api/users', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user by ID
app.get('/api/users/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user
app.put('/api/users/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user
app.delete('/api/users/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ANALYTICS ROUTES
// Admin analytics
app.get('/api/analytics/admin', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalAssessments = await Assessment.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });

    // Recent enrollments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentEnrollments = await User.aggregate([
      { $unwind: '$enrolledCourses' },
      { $group: { _id: null, count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      totalCourses,
      totalAssessments,
      totalStudents,
      totalInstructors,
      recentEnrollments: recentEnrollments[0]?.count || 0,
      userGrowth: [
        { month: 'Jan', users: Math.floor(totalUsers * 0.7) },
        { month: 'Feb', users: Math.floor(totalUsers * 0.8) },
        { month: 'Mar', users: Math.floor(totalUsers * 0.9) },
        { month: 'Apr', users: totalUsers }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Instructor analytics
app.get('/api/analytics/instructor', authenticateToken, requireRole(['instructor']), async (req, res) => {
  try {
    const myCourses = await Course.find({ instructor: req.user.id });
    const totalCourses = myCourses.length;
    const totalEnrollments = myCourses.reduce((total, course) => total + course.enrolledStudents.length, 0);
    
    const myAssessments = await Assessment.countDocuments({ instructor: req.user.id });
    
    res.json({
      totalCourses,
      totalEnrollments,
      totalAssessments: myAssessments,
      averageRating: 4.5, // Mock data
      coursePerformance: myCourses.map(course => ({
        name: course.title,
        enrollments: course.enrolledStudents.length
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// User analytics
app.get('/api/analytics/user', authenticateToken, requireRole(['student']), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('enrolledCourses');
    const enrolledCourses = user.enrolledCourses.length;
    
    const completedAssessments = await Result.countDocuments({ student: req.user.id });
    const results = await Result.find({ student: req.user.id });
    const averageScore = results.length > 0 
      ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
      : 0;

    res.json({
      enrolledCourses,
      completedAssessments,
      averageScore,
      totalStudyTime: 45, // Mock data
      progress: results.map(r => ({
        course: r.course,
        score: r.percentage
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Course-specific analytics
app.get('/api/analytics/course/:id', authenticateToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const enrollments = course.enrolledStudents.length;
    const assessments = await Assessment.countDocuments({ course: req.params.id });
    const results = await Result.find({ course: req.params.id });
    
    const averageScore = results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
      : 0;

    res.json({
      enrollments,
      assessments,
      averageScore,
      completionRate: 85, // Mock data
      studentProgress: results.map(r => ({
        studentId: r.student,
        score: r.percentage
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'LMS Backend is running' });
});

// Start server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
}