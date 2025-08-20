import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Assessment, Question } from '../../types';

interface QuizComponentProps {
  assessment: Assessment;
  onSubmit: (answers: Record<string, any>) => void;
}

export function QuizComponent({ assessment, onSubmit }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState(assessment.time_limit_minutes ? assessment.time_limit_minutes * 60 : null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (timeLeft === null) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit(answers);
  };

  const currentQ = assessment.questions[currentQuestion];
  const isAnswered = answers[currentQ.id] !== undefined;
  const totalAnswered = Object.keys(answers).length;

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Submitted!</h2>
        <p className="text-gray-600">Your responses have been recorded. Results will be available shortly.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{assessment.title}</h1>
          {timeLeft !== null && (
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              timeLeft < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <Clock className="h-5 w-5" />
              <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {assessment.questions.length}
          </div>
          <div className="text-sm text-gray-600">
            {totalAnswered}/{assessment.questions.length} answered
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / assessment.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="mb-6">
          <div className="flex items-start space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-sm font-medium text-blue-600">{currentQuestion + 1}</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{currentQ.question}</h2>
          </div>
          <div className="text-sm text-gray-500 mb-4">{currentQ.points} points</div>
        </div>

        <div className="space-y-3">
          {currentQ.type === 'multiple_choice' && currentQ.options && (
            currentQ.options.map((option, index) => (
              <label
                key={index}
                className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="radio"
                  name={`question-${currentQ.id}`}
                  value={index}
                  checked={answers[currentQ.id] === index}
                  onChange={(e) => handleAnswerChange(currentQ.id, parseInt(e.target.value))}
                  className="mr-3 text-blue-600"
                />
                <span className="text-gray-900">{option}</span>
              </label>
            ))
          )}

          {currentQ.type === 'true_false' && (
            ['True', 'False'].map((option, index) => (
              <label
                key={option}
                className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="radio"
                  name={`question-${currentQ.id}`}
                  value={index === 0}
                  checked={answers[currentQ.id] === (index === 0)}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value === 'true')}
                  className="mr-3 text-blue-600"
                />
                <span className="text-gray-900">{option}</span>
              </label>
            ))
          )}

          {currentQ.type === 'essay' && (
            <textarea
              value={answers[currentQ.id] || ''}
              onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-32"
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-4">
          {assessment.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                index === currentQuestion
                  ? 'bg-blue-600 text-white'
                  : answers[assessment.questions[index].id] !== undefined
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestion === assessment.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Submit Quiz</span>
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(prev => Math.min(assessment.questions.length - 1, prev + 1))}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Progress Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Progress: {totalAnswered} of {assessment.questions.length} questions answered
          </span>
          {totalAnswered < assessment.questions.length && (
            <div className="flex items-center space-x-1 text-orange-600">
              <AlertCircle className="h-4 w-4" />
              <span>Please answer all questions before submitting</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}