import { useState, useEffect } from 'react';
import { Course } from '../types';
import { coursesAPI } from '../lib/api';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await coursesAPI.getAll();
      setCourses(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const createCourse = async (courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newCourse = await coursesAPI.create(courseData);
      setCourses(prev => [...prev, newCourse]);
      return newCourse;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateCourse = async (id: string, courseData: Partial<Course>) => {
    try {
      const updatedCourse = await coursesAPI.update(id, courseData);
      setCourses(prev => prev.map(course => 
        course.id === id ? updatedCourse : course
      ));
      return updatedCourse;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      await coursesAPI.delete(id);
      setCourses(prev => prev.filter(course => course.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const enrollInCourse = async (courseId: string) => {
    try {
      await coursesAPI.enroll(courseId);
      // Refresh courses to update enrollment status
      await fetchCourses();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    courses,
    loading,
    error,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollInCourse,
  };
}