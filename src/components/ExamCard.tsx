
import React from 'react';
import { Clock, Users, BookOpen, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ExamCardProps {
  examType: 'WAEC' | 'JAMB' | 'NECO';
  subject: string;
  year: number;
  questions: number;
  duration: number;
  onStart: () => void;
}

const ExamCard = ({ examType, subject, year, questions, duration, onStart }: ExamCardProps) => {
  const getExamColor = (type: string) => {
    switch (type) {
      case 'WAEC':
        return 'from-blue-500 to-blue-600';
      case 'JAMB':
        return 'from-green-500 to-green-600';
      case 'NECO':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className={`px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${getExamColor(examType)}`}>
            {examType}
          </div>
          <span className="text-sm text-gray-500">{year}</span>
        </div>
        <CardTitle className="text-lg font-bold text-gray-900">{subject}</CardTitle>
        <CardDescription className="text-gray-600">
          Practice with past questions and improve your performance
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <BookOpen className="w-4 h-4" />
            <span>{questions} questions</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{duration} mins</span>
          </div>
        </div>
        
        <Button 
          onClick={onStart}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <span>Start Exam</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExamCard;
