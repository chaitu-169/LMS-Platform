import React from 'react';
import { Clock, Users, Star, Play, DollarSign } from 'lucide-react';
import { Course } from '../../types';

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
  showEnrollButton?: boolean;
}

export function CourseCard({ course, onEnroll, showEnrollButton = true }: CourseCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <div className="relative">
        <img
          src={course.image_url || 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400'}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            course.level === 'beginner' ? 'bg-green-100 text-green-800' :
            course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {course.level}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {course.description}
          </p>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{course.duration_hours}h</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>156 students</span>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-yellow-500" />
            <span>4.8</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="text-xl font-bold text-gray-900">
              {course.price === 0 ? 'Free' : `$${course.price}`}
            </span>
          </div>

          {showEnrollButton && (
            <button
              onClick={() => {
               if (onEnroll) {

                alert("Already Enrolled :)");
              }
              }}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Play className="h-4 w-4" />
              <span>Enroll</span>
             </button>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-blue-600">
                {course.instructor?.name?.charAt(0) || 'I'}
              </span>
            </div>
            <span className="text-sm text-gray-600">
              {course.instructor?.name || 'Instructor'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}