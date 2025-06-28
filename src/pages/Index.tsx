
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ExamCard from '@/components/ExamCard';
import { useExamData } from '@/hooks/useExamData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Trophy, TrendingUp, Filter } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();
  const { availableExams } = useExamData();
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const handleStartExam = (examType: string, subject: string, year: number) => {
    toast.success(`Starting ${examType} ${subject} exam...`);
    navigate(`/exam?type=${examType}&subject=${subject}&year=${year}`);
  };

  const filteredExams = selectedFilter === 'ALL' 
    ? availableExams 
    : availableExams.filter(exam => exam.examType === selectedFilter);

  const stats = [
    { icon: BookOpen, label: 'Available Exams', value: availableExams.length, color: 'bg-blue-500' },
    { icon: Users, label: 'Students Practicing', value: '12.5K+', color: 'bg-green-500' },
    { icon: Trophy, label: 'Success Rate', value: '89%', color: 'bg-yellow-500' },
    { icon: TrendingUp, label: 'Average Score', value: '78%', color: 'bg-purple-500' }
  ];

  const examTypes = ['ALL', 'WAEC', 'JAMB', 'NECO'];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="text-center mb-8 py-8 px-4 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl text-white shadow-xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Master Your Nigerian Exams
        </h1>
        <p className="text-lg md:text-xl mb-6 opacity-90">
          Practice with authentic past questions from WAEC, JAMB, and NECO
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            10,000+ Questions
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            Instant Feedback
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            Offline Support
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center shadow-md border-0">
            <CardContent className="pt-6">
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Section */}
      <Card className="mb-6 shadow-md border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Available Practice Exams</span>
              </CardTitle>
              <CardDescription>
                Choose from our collection of past questions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {examTypes.map(type => (
              <Button
                key={type}
                variant={selectedFilter === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(type)}
                className={selectedFilter === type ? "bg-gradient-to-r from-blue-600 to-green-600 text-white" : ""}
              >
                {type}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exam Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredExams.map((exam, index) => (
          <ExamCard
            key={index}
            examType={exam.examType}
            subject={exam.subject}
            year={exam.year}
            questions={exam.questions.length}
            duration={exam.duration}
            onStart={() => handleStartExam(exam.examType, exam.subject, exam.year)}
          />
        ))}
      </div>

      {filteredExams.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No exams found</h3>
          <p className="text-gray-500">Try selecting a different filter</p>
        </div>
      )}

      {/* Features Section */}
      <Card className="mt-8 shadow-lg border-0 bg-gradient-to-br from-gray-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Why Choose SmartExam NG?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Authentic Questions</h3>
              <p className="text-sm text-gray-600">Practice with real past questions from official exam bodies</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Instant Results</h3>
              <p className="text-sm text-gray-600">Get immediate feedback with detailed explanations</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Track Progress</h3>
              <p className="text-sm text-gray-600">Monitor your improvement over time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Index;
