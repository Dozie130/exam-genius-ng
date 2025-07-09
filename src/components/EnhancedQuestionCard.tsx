import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import ClickableText from './ClickableText';
import { Timer, ArrowLeft, ArrowRight, Crown } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import PremiumUpgradeButton from './PremiumUpgradeButton';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctOption: string;
  explanation: string;
}

interface EnhancedQuestionCardProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  showAnswer: boolean;
  onTimeUp?: () => void;
  isLastFreeQuestion?: boolean;
}

const EnhancedQuestionCard = ({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious,
  showAnswer,
  onTimeUp,
  isLastFreeQuestion = false
}: EnhancedQuestionCardProps) => {
  const [timeRemaining, setTimeRemaining] = useState(90); // 90 seconds per question
  const { profile } = useSupabaseData();
  const options = ['A', 'B', 'C', 'D'];
  const progress = (currentQuestion / totalQuestions) * 100;

  // Reset timer when question changes
  useEffect(() => {
    setTimeRemaining(90);
  }, [question.id]);

  // Timer countdown
  useEffect(() => {
    if (showAnswer || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, showAnswer, onTimeUp]);

  const getTimerColor = () => {
    if (timeRemaining > 60) return 'text-green-600';
    if (timeRemaining > 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTimerProgress = () => {
    return (timeRemaining / 90) * 100;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Show premium upgrade for free users at last question
  if (isLastFreeQuestion && !profile?.is_paid) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="shadow-xl border-0 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Upgrade to Premium
            </CardTitle>
            <p className="text-lg text-gray-600">
              You've completed your free questions! Upgrade to access unlimited practice questions.
            </p>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Premium Features:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Unlimited practice questions
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  All subjects and exam types
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Detailed explanations
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Progress tracking
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">₦2,500</div>
                <div className="text-sm text-gray-600">One-time payment • Lifetime access</div>
              </div>
              
              <PremiumUpgradeButton />
              
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Enhanced Progress Header */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">
                Question {currentQuestion} of {totalQuestions}
              </span>
              {!profile?.is_paid && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  Free: {5 - currentQuestion + 1} left
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <Timer className="w-4 h-4 text-gray-600" />
              <span className={`text-sm font-medium ${getTimerColor()}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress value={progress} className="h-3" />
            <Progress 
              value={getTimerProgress()} 
              className={`h-2 ${timeRemaining <= 30 ? 'bg-red-100' : 'bg-gray-100'}`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Question Card */}
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl leading-relaxed text-gray-800">
            <ClickableText 
              text={question.question}
              className="leading-relaxed"
            />
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {question.options.map((option, index) => {
              const optionLetter = options[index];
              const isSelected = selectedAnswer === optionLetter;
              const isCorrect = showAnswer && optionLetter === question.correctOption;
              const isWrong = showAnswer && isSelected && optionLetter !== question.correctOption;
              
              return (
                <button
                  key={optionLetter}
                  onClick={() => onAnswerSelect(optionLetter)}
                  disabled={showAnswer || timeRemaining === 0}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                    isCorrect
                      ? 'border-green-500 bg-green-50 text-green-800 shadow-lg scale-105'
                      : isWrong
                      ? 'border-red-500 bg-red-50 text-red-800 shadow-lg'
                      : isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-md scale-105'
                      : timeRemaining === 0
                      ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md hover:scale-105'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isCorrect
                        ? 'bg-green-500 text-white'
                        : isWrong
                        ? 'bg-red-500 text-white'
                        : isSelected
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {optionLetter}
                    </span>
                    <ClickableText 
                      text={option}
                      className="flex-1 text-base"
                    />
                  </div>
                </button>
              );
            })}
          </div>
          
          {showAnswer && question.explanation && (
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
              <h4 className="font-semibold text-blue-900 mb-3 text-lg">Explanation:</h4>
              <ClickableText 
                text={question.explanation}
                className="text-blue-800 leading-relaxed"
              />
            </div>
          )}

          {timeRemaining === 0 && !showAnswer && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
              <p className="text-red-800 font-medium">⏰ Time's up! Moving to the next question...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentQuestion === 1}
          className="px-6 py-3 rounded-xl font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex space-x-3">
          {!showAnswer && (selectedAnswer || timeRemaining === 0) && (
            <Button
              onClick={onNext}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {currentQuestion === totalQuestions ? 'Finish Exam' : 'Next Question'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          
          {showAnswer && (
            <Button
              onClick={onNext}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {currentQuestion === totalQuestions ? 'View Results' : 'Continue'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedQuestionCard;