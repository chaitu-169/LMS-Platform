import { useState, useEffect } from 'react';
import { analyticsAPI } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

interface DashboardStats {
  totalUsers?: number;
  totalCourses?: number;
  totalEnrollments?: number;
  revenue?: number;
  completionRate?: number;
  recentActivity?: any[];
  chartData?: any;
}

export function useAnalytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      let data;
      
      switch (user?.role) {
        case 'admin':
          data = await analyticsAPI.getAdminStats();
          break;
        case 'instructor':
          data = await analyticsAPI.getInstructorStats();
          break;
        default:
          data = await analyticsAPI.getUserStats();
      }
      
      setStats(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const getCourseStats = async (courseId: string) => {
    try {
      return await analyticsAPI.getCourseStats(courseId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    stats,
    loading,
    error,
    fetchStats,
    getCourseStats,
  };
}