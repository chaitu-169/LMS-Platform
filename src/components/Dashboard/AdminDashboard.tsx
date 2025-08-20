import React from 'react';
import { Users, BookOpen, DollarSign, TrendingUp, UserPlus, AlertTriangle } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: '208', icon: Users, color: 'blue', change: '+12%' },
    { label: 'Active Courses', value: '3', icon: BookOpen, color: 'green', change: '+8%' },
    { label: 'Monthly Revenue', value: '$4,250', icon: DollarSign, color: 'purple', change: '+23%' },
    { label: 'Completion Rate', value: '78%', icon: TrendingUp, color: 'orange', change: '+5%' },
  ];

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [45000, 52000, 48000, 61000, 72000, 84250],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const enrollmentData = {
    labels: ['Students', 'Instructors', 'Admins'],
    datasets: [
      {
        data: [11200, 145, 12],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
        borderWidth: 0,
      },
    ],
  };

  const courseData = {
    labels: ['Technology', 'Business', 'Design', 'Marketing', 'Science'],
    datasets: [
      {
        label: 'Courses',
        data: [45, 32, 28, 24, 27],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  };

  const recentActivity = [
    { type: 'user', message: 'New instructor "Pranati" registered', time: '2 hours ago' },
    { type: 'course', message: 'Course "Advanced React" was published', time: '4 hours ago' },
    { type: 'alert', message: 'Server maintenance scheduled', time: '6 hours ago' },
    { type: 'user', message: '50+ new student registrations today', time: '8 hours ago' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <UserPlus className="h-4 w-4 text-blue-600" />;
      case 'course': return <BookOpen className="h-4 w-4 text-green-600" />;
      case 'alert': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <TrendingUp className="h-4 w-4 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Platform overview and analytics</p>
        </div>
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <Line data={revenueData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Categories</h3>
          <Bar data={courseData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={enrollmentData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 p-2 rounded-lg bg-gray-100">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            'Manage Users',
            'Review Courses',
            'System Settings',
            'Generate Reports',
            'Send Announcements',
          ].map((action) => (
            <button
              key={action}
              className="p-4 text-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <p className="text-sm font-medium text-gray-900">{action}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}