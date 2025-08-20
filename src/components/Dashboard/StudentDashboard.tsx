import React from 'react';
import { BookOpen, Clock, Trophy, TrendingUp, Play, Users, Star } from 'lucide-react';

export function StudentDashboard() {
  // Mock data - replace with real API calls
  const enrolledCourses = [
    {
      id: 1,
      title: 'React Fundamentals',
      instructor: 'Pranati',
      progress: 75,
      image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400',
      nextLesson: 'Advanced Hooks',
      totalLessons: 24,
      completedLessons: 18,
    },
    {
      id: 2,
      title: 'Node.js Backend Development',
      instructor: 'Anitha Phogat',
      progress: 45,
      image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
      nextLesson: 'Database Integration',
      totalLessons: 32,
      completedLessons: 14,
    },
  ];

  const stats = [
    { label: 'Courses Enrolled', value: '3', icon: BookOpen, color: 'blue' },
    { label: 'Hours Learned', value: '48', icon: Clock, color: 'green' },
    { label: 'Certificates', value: '2', icon: Trophy, color: 'yellow' },
    { label: 'Progress Rate', value: '85%', icon: TrendingUp, color: 'purple' },
  ];

  const recentActivity = [
    { course: 'React Fundamentals', action: 'Completed lesson', time: '2 hours ago' },
    { course: 'UI/UX Design', action: 'Started quiz', time: '1 day ago' },
    { course: 'Node.js Backend', action: 'Watched video', time: '2 days ago' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600 mt-2">Continue your learning journey</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Continue Learning</h2>
          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all hover:scale-[1.01]">
                <div className="flex items-start space-x-4">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-20 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-600">by {course.instructor}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                      </div>
                      <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <Play className="h-4 w-4" />
                        <span>Continue</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.course}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Browse new courses</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="h-5 w-5 text-green-600" />
                <span className="text-sm">Join study groups</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                <Star className="h-5 w-5 text-yellow-600" />
                <span className="text-sm">Rate courses</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}