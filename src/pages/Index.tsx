
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ExamCard from '@/components/ExamCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Trophy, TrendingUp, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subjects, subjectsLoading, examAttempts } = useSupabaseData();
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const handleStartExam = (examType: string, subject: string, year: number) => {
    if (!user) {
      toast.error('Please sign in to take exams');
      navigate('/auth');
      return;
    }

    toast.success(`Starting ${examType} ${subject} exam...`);
    navigate(`/exam?type=${examType}&subject=${subject}&year=${year}`);
  };

  // Memoize filtered subjects for better performance
  const filteredSubjects = useMemo(() => {
    return selectedFilter === 'ALL' 
      ? subjects 
      : subjects.filter(subject => subject.exam_type === selectedFilter);
  }, [subjects, selectedFilter]);

  // Memoize stats calculation
  const stats = useMemo(() => {
    const totalAttempts = examAttempts.length;
    const averageScore = totalAttempts > 0 
      ? Math.round(examAttempts.reduce((sum, attempt) => sum + attempt.score_percent, 0) / totalAttempts)
      : 0;
    const bestScore = totalAttempts > 0 
      ? Math.max(...examAttempts.map(attempt => attempt.score_percent))
      : 0;

    return [
      { icon: BookOpen, label: 'Available Subjects', value: subjects.length, color: 'bg-blue-500' },
      { icon: Trophy, label: 'Exams Taken', value: totalAttempts, color: 'bg-green-500' },
      { icon: TrendingUp, label: 'Average Score', value: `${averageScore}%`, color: 'bg-yellow-500' },
      { icon: Users, label: 'Best Score', value: `${bestScore}%`, color: 'bg-purple-500' }
    ];
  }, [subjects.length, examAttempts]);

  const examTypes = ['ALL', 'WAEC', 'JAMB', 'NECO'];

  if (subjectsLoading) {
    return (
      <Layout>
        <LoadingSpinner message="Loading subjects..." />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section - Mobile Optimized */}
      <div className="text-center mb-6 sm:mb-8 py-6 sm:py-8 px-3 sm:px-4 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl sm:rounded-2xl text-white shadow-xl animate-fade-in">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
          Master Your Nigerian Exams
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 opacity-90 max-w-2xl mx-auto">
          Practice with authentic past questions from WAEC, JAMB, and NECO
        </p>
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 max-w-lg mx-auto">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors text-xs sm:text-sm">
            Real Past Questions
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors text-xs sm:text-sm">
            AI-Powered Help
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors text-xs sm:text-sm">
            Progress Tracking
          </Badge>
          <Badge variant="secondary" className="bg-green-500/20 text-green-100 border-green-300/30 hover:bg-green-500/30 transition-colors text-xs sm:text-sm font-semibold">
            All Free
          </Badge>
        </div>
      </div>

      {/* Stats Cards - Mobile Optimized */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center shadow-md border-0 hover:shadow-lg transition-all duration-200 animate-fade-in hover:scale-105" style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6 px-2 sm:px-6">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md`}>
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-600 leading-tight">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Section - Mobile Optimized */}
      <Card className="mb-6 shadow-md border-0 animate-fade-in">
        <CardHeader className="pb-4 sm:pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>Available Practice Exams</span>
              </CardTitle>
              <CardDescription className="text-sm">
                Choose from our collection of past questions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {examTypes.map(type => (
              <Button
                key={type}
                variant={selectedFilter === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(type)}
                className={`transition-all duration-200 touch-manipulation h-8 sm:h-9 px-3 sm:px-4 text-sm ${
                  selectedFilter === type 
                    ? "bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md scale-105" 
                    : "hover:shadow-md hover:scale-105"
                }`}
              >
                {type}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exam Cards - Mobile Optimized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {filteredSubjects.map((subject, index) => (
          <div key={`${subject.id}-${index}`} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
            <ExamCard
              examType={subject.exam_type}
              subject={subject.subject_name}
              year={2023}
              questions={subject.total_questions}
              duration={subject.time_limit_minutes}
              onStart={() => handleStartExam(subject.exam_type, subject.subject_name, 2023)}
            />
          </div>
        ))}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No subjects found</h3>
          <p className="text-gray-500">Try selecting a different filter</p>
        </div>
      )}

      {/* Features Section */}
      <Card className="mt-8 shadow-lg border-0 bg-gradient-to-br from-gray-50 to-blue-50 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Why Choose SmartExam NG?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center hover:transform hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Authentic Questions</h3>
              <p className="text-sm text-gray-600">Practice with real past questions from official exam bodies</p>
            </div>
            <div className="text-center hover:transform hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Track Progress</h3>
              <p className="text-sm text-gray-600">Monitor your improvement with detailed analytics</p>
            </div>
            <div className="text-center hover:transform hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">AI-Powered Help</h3>
              <p className="text-sm text-gray-600">Get instant explanations with our AI word helper</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Index;
