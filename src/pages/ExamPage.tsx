import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import QuestionCard from '@/components/QuestionCard';
import ResultsCard from '@/components/ResultsCard';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

interface Question {
  id: string;
  subject: string;
  exam_type: 'WAEC' | 'JAMB' | 'NECO';
  year: number;
  question_text: string;
  options: Record<string, string>;
  correct_option: string;
  explanation: string;
}

const ExamPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, saveExamAttempt } = useSupabaseData();
  
  const examType = searchParams.get('type') as 'WAEC' | 'JAMB' | 'NECO';
  const subject = searchParams.get('subject') || '';
  const year = parseInt(searchParams.get('year') || '2023');
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [examStartTime] = useState(Date.now());
  const [questionStartTimes, setQuestionStartTimes] = useState<Record<number, number>>({});

  // Use React Query for caching and faster loading
  const { data: questions = [], isLoading: loading, error } = useQuery({
    queryKey: ['exam-questions', examType, subject, year],
    queryFn: async () => {
      if (!examType || !subject) {
        throw new Error('Invalid exam parameters');
      }

      const { data, error } = await supabase
        .from('questions')
        .select('id, subject, exam_type, year, question_text, options, correct_option, explanation')
        .eq('exam_type', examType)
        .eq('subject', subject)
        .eq('year', year)
        .limit(40)
        .order('created_at');

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error('No questions found for this exam');
      }

      // Transform the data to ensure options is properly typed
      return data.map(q => ({
        id: q.id,
        subject: q.subject,
        exam_type: q.exam_type,
        year: q.year,
        question_text: q.question_text,
        options: q.options as Record<string, string>,
        correct_option: q.correct_option,
        explanation: q.explanation || ''
      })) as Question[];
    },
    enabled: !!(examType && subject),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 1
  });

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error('Error fetching questions:', error);
      toast.error(error.message || 'Failed to load exam questions');
      navigate('/');
    }
  }, [error, navigate]);

  // Record start time when question changes
  useEffect(() => {
    if (questions.length > 0) {
      setQuestionStartTimes(prev => ({
        ...prev,
        [currentQuestionIndex]: Date.now()
      }));
    }
  }, [currentQuestionIndex, questions.length]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg text-gray-600">Loading exam questions...</span>
        </div>
      </Layout>
    );
  }

  if (questions.length === 0) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No questions available for this exam</p>
        </div>
      </Layout>
    );
  }

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleTimeUp = () => {
    toast.info('Time up for this question!');
    setTimeout(() => {
      handleNext();
    }, 2000);
  };

  const calculateResults = () => {
    const correctAnswers = questions.filter(
      question => answers[question.id] === question.correct_option
    ).length;
    
    const timeTakenMinutes = Math.floor((Date.now() - examStartTime) / (1000 * 60));
    const scorePercent = Math.round((correctAnswers / questions.length) * 100);
    
    return {
      correctAnswers,
      timeTakenMinutes,
      scorePercent
    };
  };

  const generateQuestionReviews = () => {
    return questions.map((question, index) => {
      const userAnswer = answers[question.id] || '';
      const isCorrect = userAnswer === question.correct_option;
      
      return {
        questionNumber: index + 1,
        questionText: question.question_text,
        userAnswer,
        correctAnswer: question.correct_option,
        explanation: question.explanation || 'No explanation available.',
        options: question.options,
        isCorrect
      };
    });
  };

  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setQuestionStartTimes({ 0: Date.now() });
    toast.success('Exam restarted!');
  };

  const handleHome = () => {
    navigate('/');
  };

  if (showResults) {
    const results = calculateResults();
    const questionReviews = generateQuestionReviews();
    
    // Save exam attempt to database
    if (user) {
      saveExamAttempt.mutate({
        subject,
        exam_type: examType,
        questions_answered: questions.length,
        correct_answers: results.correctAnswers,
        score_percent: results.scorePercent,
        time_taken_minutes: results.timeTakenMinutes
      });
    }

    return (
      <Layout title="Exam Results">
        <ResultsCard
          score={results.scorePercent}
          totalQuestions={questions.length}
          correctAnswers={results.correctAnswers}
          timeTaken={results.timeTakenMinutes * 60}
          examType={examType}
          subject={subject}
          onRetake={handleRetake}
          onHome={handleHome}
          questionReviews={questionReviews}
        />
      </Layout>
    );
  }

  // Convert question format for QuestionCard
  const currentQuestion = questions[currentQuestionIndex];
  const formattedQuestion = {
    id: currentQuestion.id,
    question: currentQuestion.question_text,
    options: Object.values(currentQuestion.options),
    correctOption: currentQuestion.correct_option,
    explanation: currentQuestion.explanation
  };

  return (
    <Layout title={`${examType} ${subject} ${year}`}>
      <QuestionCard
        question={formattedQuestion}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        selectedAnswer={answers[currentQuestion.id] || null}
        onAnswerSelect={handleAnswerSelect}
        onNext={handleNext}
        onPrevious={handlePrevious}
        showAnswer={false}
        onTimeUp={handleTimeUp}
      />
    </Layout>
  );
};

export default ExamPage;
