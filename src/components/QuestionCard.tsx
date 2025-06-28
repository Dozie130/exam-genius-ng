
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

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
  timeRemaining?: number;
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
  timeRemaining
}: QuestionCardProps) => {
  const options = ['A', 'B', 'C', 'D'];
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestion} of {totalQuestions}
          </span>
          {timeRemaining && (
            <span className="text-sm font-medium text-blue-600">
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </span>
          )}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed text-gray-800">
            {question.question}
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
                disabled={showAnswer}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  isCorrect
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : isWrong
                    ? 'border-red-500 bg-red-50 text-red-800'
                    : isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-800'
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
                  <span className="flex-1">{option}</span>
                </div>
              </button>
            );
          })}
          
          {showAnswer && question.explanation && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Explanation:</h4>
              <p className="text-blue-800 text-sm leading-relaxed">{question.explanation}</p>
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
          {!showAnswer && selectedAnswer && (
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
