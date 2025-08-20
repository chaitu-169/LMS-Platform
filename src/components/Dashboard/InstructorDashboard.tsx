import React from 'react';
import { BookOpen, Users, BarChart3, TrendingUp, Eye, Edit, Plus } from 'lucide-react';

export function InstructorDashboard() {
  const stats = [
    { label: 'Total Courses', value: '12', icon: BookOpen, color: 'blue', change: '+2' },
    { label: 'Total Students', value: '1,247', icon: Users, color: 'green', change: '+89' },
    { label: 'Course Rating', value: '4.8', icon: BarChart3, color: 'yellow', change: '+0.2' },
    { label: 'Monthly Revenue', value: '$8,450', icon: TrendingUp, color: 'purple', change: '+12%' },
  ];

  const myCourses = [
    {
      id: 1,
      title: 'React Advanced Patterns',
      students: 324,
      rating: 4.9,
      revenue: '$2,450',
      status: 'active',
      image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 2,
      title: 'Node.js Masterclass',
      students: 256,
      rating: 4.7,
      revenue: '$1,890',
      status: 'active',
      image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 3,
      title: 'Full-Stack Development',
      students: 89,
      rating: 4.6,
      revenue: '$890',
      status: 'draft',
      image: 'https://images.pexels.com/photos/574073/pexels-photo-574073.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const recentStudents = [
    { name: 'Alice Johnson', course: 'React Advanced Patterns', joined: '2 hours ago' },
    { name: 'Bob Smith', course: 'Node.js Masterclass', joined: '5 hours ago' },
    { name: 'Carol Davis', course: 'React Advanced Patterns', joined: '1 day ago' },
    { name: 'David Wilson', course: 'Full-Stack Development', joined: '1 day ago' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your courses and track performance</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-5 w-5" />
          <span>Create Course</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="text-sm text-green-600 font-medium">{stat.change}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Courses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>All Courses</option>
              <option>Active</option>
              <option>Draft</option>
              <option>Archived</option>
            </select>
          </div>
          
          <div className="space-y-4">
            {myCourses.map((course) => (
              <div key={course.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
                <div className="flex items-start space-x-4">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-20 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{course.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>{course.students} students</span>
                          <span>★ {course.rating}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            course.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {course.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{course.revenue}</p>
                        <p className="text-sm text-gray-600">Revenue</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Students */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Enrollments</h2>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="space-y-4">
              {recentStudents.map((student, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-blue-600">
                      {student.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.course}</p>
                    <p className="text-xs text-gray-400">{student.joined}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">This Month</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Enrollments</span>
                <span className="text-sm font-semibold text-gray-900">143</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Course Completions</span>
                <span className="text-sm font-semibold text-gray-900">67</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Rating</span>
                <span className="text-sm font-semibold text-gray-900">4.7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}