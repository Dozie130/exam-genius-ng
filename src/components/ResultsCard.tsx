
import React from 'react';
import { Trophy, Target, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ResultsCardProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  examType: string;
  subject: string;
  onRetake: () => void;
  onHome: () => void;
}

const ResultsCard = ({
  score,
  totalQuestions,
  correctAnswers,
  timeTaken,
  examType,
  subject,
  onRetake,
  onHome
}: ResultsCardProps) => {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const grade = percentage >= 80 ? 'Excellent' : percentage >= 70 ? 'Very Good' : percentage >= 60 ? 'Good' : percentage >= 50 ? 'Fair' : 'Needs Improvement';
  
  const getGradeColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Main Result Card */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Exam Completed!
          </CardTitle>
          <CardDescription className="text-lg">
            {examType} - {subject}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {percentage}%
            </div>
            <div className={`text-lg font-medium ${getGradeColor()}`}>
              {grade}
            </div>
            <Progress value={percentage} className="mt-4 h-3" />
          </div>
          
          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-700">Correct</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {correctAnswers}/{totalQuestions}
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-700">Time</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.floor(timeTaken / 60)}m {timeTaken % 60}s
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={onRetake}
              variant="outline"
              className="flex-1 py-3 border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Retake Exam
            </Button>
            <Button
              onClick={onHome}
              className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-3"
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Performance Tips */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-lg">Performance Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          {percentage >= 80 ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">🎉 Excellent work! You're well-prepared for your exam. Keep practicing to maintain this level.</p>
            </div>
          ) : (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">💡 Focus on reviewing the topics you missed. Consider retaking this exam to improve your score.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsCard;
