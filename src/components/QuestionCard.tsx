
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import ClickableText from './ClickableText';
import { Timer } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctOption: string;
  explanation: string;
}

interface QuestionCardProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  showAnswer: boolean;
  onTimeUp?: () => void;
}

const QuestionCard = ({
  question,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious,
  showAnswer,
  onTimeUp
}: QuestionCardProps) => {
  const [timeRemaining, setTimeRemaining] = useState(60); // 60 seconds per question
  const options = ['A', 'B', 'C', 'D'];
  const progress = (currentQuestion / totalQuestions) * 100;

  // Reset timer when question changes
  useEffect(() => {
    setTimeRemaining(60);
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
    if (timeRemaining > 40) return 'text-green-600';
    if (timeRemaining > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTimerProgress = () => {
    return (timeRemaining / 60) * 100;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestion} of {totalQuestions}
          </span>
          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4 text-gray-600" />
            <span className={`text-sm font-medium ${getTimerColor()}`}>
              {timeRemaining}s
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <Progress 
            value={getTimerProgress()} 
            className={`h-1 ${timeRemaining <= 20 ? 'bg-red-100' : 'bg-gray-100'}`}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed text-gray-800">
            <ClickableText 
              text={question.question}
              className="leading-relaxed"
            />
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
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
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  isCorrect
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : isWrong
                    ? 'border-red-500 bg-red-50 text-red-800'
                    : isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                    : timeRemaining === 0
                    ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
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
                    className="flex-1"
                  />
                </div>
              </button>
            );
          })}
          
          {showAnswer && question.explanation && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Explanation:</h4>
              <ClickableText 
                text={question.explanation}
                className="text-blue-800 text-sm leading-relaxed"
              />
            </div>
          )}

          {timeRemaining === 0 && !showAnswer && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-red-800 text-sm font-medium">Time's up! Please move to the next question.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentQuestion === 1}
          className="px-6 py-2"
        >
          Previous
        </Button>
        
        <div className="flex space-x-3">
          {!showAnswer && (selectedAnswer || timeRemaining === 0) && (
            <Button
              onClick={onNext}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6 py-2"
            >
              {currentQuestion === totalQuestions ? 'Finish' : 'Next'}
            </Button>
          )}
          
          {showAnswer && (
            <Button
              onClick={onNext}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6 py-2"
            >
              {currentQuestion === totalQuestions ? 'View Results' : 'Continue'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
