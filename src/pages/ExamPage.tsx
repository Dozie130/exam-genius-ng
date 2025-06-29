
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import QuestionCard from '@/components/QuestionCard';
import ResultsCard from '@/components/ResultsCard';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [examStartTime] = useState(Date.now());
  const [questionStartTimes, setQuestionStartTimes] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!examType || !subject) {
        toast.error('Invalid exam parameters');
        navigate('/');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('exam_type', examType)
          .eq('subject', subject)
          .eq('year', year)
          .limit(40);

        if (error) throw error;

        if (!data || data.length === 0) {
          toast.error('No questions found for this exam');
          navigate('/');
          return;
        }

        setQuestions(data);
        setQuestionStartTimes({ 0: Date.now() });
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast.error('Failed to load exam questions');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [examType, subject, year, navigate]);

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
          timeTaken={results.timeTakenMinutes * 60} // Convert back to seconds for display
          examType={examType}
          subject={subject}
          onRetake={handleRetake}
          onHome={handleHome}
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
