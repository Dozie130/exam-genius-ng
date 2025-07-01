
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import ClickableText from './ClickableText';

interface QuestionReview {
  questionNumber: number;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  options: Record<string, string>;
  isCorrect: boolean;
}

interface ResultsReviewProps {
  reviews: QuestionReview[];
  totalQuestions: number;
  correctAnswers: number;
}

const ResultsReview = ({ reviews, totalQuestions, correctAnswers }: ResultsReviewProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  
  const wrongAnswers = reviews.filter(review => !review.isCorrect);
  
  const toggleQuestion = (questionNumber: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionNumber)) {
      newExpanded.delete(questionNumber);
    } else {
      newExpanded.add(questionNumber);
    }
    setExpandedQuestions(newExpanded);
  };

  const getOptionLabel = (key: string) => {
    return key.toUpperCase();
  };

  if (wrongAnswers.length === 0) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-lg flex items-center text-green-600">
            <CheckCircle className="w-5 h-5 mr-2" />
            Perfect Score!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Congratulations! You answered all questions correctly.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-lg">Review Incorrect Answers</CardTitle>
        <p className="text-sm text-gray-600">
          Review the {wrongAnswers.length} question{wrongAnswers.length !== 1 ? 's' : ''} you got wrong to improve your understanding.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="w-full flex items-center justify-between"
        >
          <span>
            {isOpen ? 'Hide' : 'Show'} Detailed Review ({wrongAnswers.length} questions)
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>

        {isOpen && (
          <div className="space-y-3">
            {wrongAnswers.map((review) => (
              <div key={review.questionNumber} className="border rounded-lg overflow-hidden">
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <button
                      onClick={() => toggleQuestion(review.questionNumber)}
                      className="w-full p-4 text-left bg-red-50 hover:bg-red-100 border-b flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {review.questionNumber}
                        </div>
                        <div className="flex-1">
                          <ClickableText 
                            text={review.questionText.substring(0, 80) + (review.questionText.length > 80 ? '...' : '')}
                            className="font-medium text-gray-900"
                          />
                        </div>
                      </div>
                      {expandedQuestions.has(review.questionNumber) ? 
                        <ChevronUp className="w-5 h-5 text-gray-500" /> : 
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      }
                    </button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="p-4 space-y-4">
                      {/* Full Question */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">
                          <ClickableText text={review.questionText} />
                        </h4>
                      </div>

                      {/* Options */}
                      <div className="space-y-2">
                        {Object.entries(review.options).map(([key, value]) => {
                          const isUserAnswer = key === review.userAnswer;
                          const isCorrectAnswer = key === review.correctAnswer;
                          
                          return (
                            <div
                              key={key}
                              className={`p-3 rounded-lg border-2 ${
                                isCorrectAnswer
                                  ? 'border-green-500 bg-green-50'
                                  : isUserAnswer
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200 bg-gray-50'
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                                  isCorrectAnswer
                                    ? 'bg-green-500 text-white'
                                    : isUserAnswer
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-300 text-gray-700'
                                }`}>
                                  {getOptionLabel(key)}
                                </span>
                                <div className="flex-1">
                                  <ClickableText text={value} />
                                  {isUserAnswer && !isCorrectAnswer && (
                                    <span className="ml-2 text-red-600 text-sm font-medium">
                                      (Your answer)
                                    </span>
                                  )}
                                  {isCorrectAnswer && (
                                    <span className="ml-2 text-green-600 text-sm font-medium">
                                      (Correct answer)
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {review.explanation && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h5 className="font-medium text-blue-900 mb-2">Explanation:</h5>
                          <ClickableText 
                            text={review.explanation}
                            className="text-blue-800 text-sm leading-relaxed"
                          />
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsReview;
