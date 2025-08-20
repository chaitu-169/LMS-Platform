import { useState, useEffect } from 'react';
import { Assessment, AssessmentResult } from '../types';
import { assessmentsAPI } from '../lib/api';

export function useAssessments(courseId?: string) {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssessments = async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      const data = await assessmentsAPI.getByCourse(courseId);
      setAssessments(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    try {
      const data = await assessmentsAPI.getStudentResults();
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAssessments();
    fetchResults();
  }, [courseId]);

  const createAssessment = async (assessmentData: Omit<Assessment, 'id' | 'created_at'>) => {
    try {
      const newAssessment = await assessmentsAPI.create(assessmentData);
      setAssessments(prev => [...prev, newAssessment]);
      return newAssessment;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateAssessment = async (id: string, assessmentData: Partial<Assessment>) => {
    try {
      const updatedAssessment = await assessmentsAPI.update(id, assessmentData);
      setAssessments(prev => prev.map(assessment => 
        assessment.id === id ? updatedAssessment : assessment
      ));
      return updatedAssessment;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteAssessment = async (id: string) => {
    try {
      await assessmentsAPI.delete(id);
      setAssessments(prev => prev.filter(assessment => assessment.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const submitAssessment = async (assessmentId: string, answers: Record<string, any>) => {
    try {
      const result = await assessmentsAPI.submit(assessmentId, answers);
      setResults(prev => [...prev, result]);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    assessments,
    results,
    loading,
    error,
    fetchAssessments,
    createAssessment,
    updateAssessment,
    deleteAssessment,
    submitAssessment,
  };
}