
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import QuestionCard from '@/components/QuestionCard';
import ResultsCard from '@/components/ResultsCard';
import { useExamData, Question } from '@/hooks/useExamData';
import { toast } from 'sonner';

const ExamPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getExamById } = useExamData();
  
  const examType = searchParams.get('type') as 'WAEC' | 'JAMB' | 'NECO';
  const subject = searchParams.get('subject') || '';
  const year = parseInt(searchParams.get('year') || '2023');
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [examStartTime] = useState(Date.now());
  const [questionStartTimes, setQuestionStartTimes] = useState<Record<number, number>>({});

  const examData = getExamById(examType, subject, year);

  useEffect(() => {
    if (!examData) {
      toast.error('Exam not found');
      navigate('/');
      return;
    }

    // Record start time for first question
    setQuestionStartTimes({ 0: Date.now() });
  }, [examData, navigate]);

  // Record start time when question changes
  useEffect(() => {
    setQuestionStartTimes(prev => ({
      ...prev,
      [currentQuestionIndex]: Date.now()
    }));
  }, [currentQuestionIndex]);

  if (!examData) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Exam not found</p>
        </div>
      </Layout>
    );
  }

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [examData.questions[currentQuestionIndex].id]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < examData.questions.length - 1) {
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
    // Auto-advance to next question when time is up
    toast.info('Time up for this question!');
    setTimeout(() => {
      handleNext();
    }, 2000);
  };

  const calculateResults = () => {
    const correctAnswers = examData.questions.filter(
      question => answers[question.id] === question.correctOption
    ).length;
    
    const timeTaken = Math.floor((Date.now() - examStartTime) / 1000);
    
    return {
      correctAnswers,
      timeTaken,
      score: Math.round((correctAnswers / examData.questions.length) * 100)
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
    return (
      <Layout title="Exam Results">
        <ResultsCard
          score={results.score}
          totalQuestions={examData.questions.length}
          correctAnswers={results.correctAnswers}
          timeTaken={results.timeTaken}
          examType={examType}
          subject={subject}
          onRetake={handleRetake}
          onHome={handleHome}
        />
      </Layout>
    );
  }

  return (
    <Layout title={`${examType} ${subject} ${year}`}>
      <QuestionCard
        question={examData.questions[currentQuestionIndex]}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={examData.questions.length}
        selectedAnswer={answers[examData.questions[currentQuestionIndex].id] || null}
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
