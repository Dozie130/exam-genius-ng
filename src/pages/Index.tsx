
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ExamCard from '@/components/ExamCard';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Trophy, TrendingUp, Filter, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subjects, subjectsLoading, profile, examAttempts } = useSupabaseData();
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const handleStartExam = (examType: string, subject: string, year: number) => {
    const selectedSubject = subjects.find(s => 
      s.subject_name === subject && s.exam_type === examType
    );

    if (!user) {
      toast.error('Please sign in to take exams');
      navigate('/auth');
      return;
    }

    if (selectedSubject && !selectedSubject.is_free && !profile?.is_premium) {
      toast.error('This subject requires a premium subscription');
      return;
    }

    toast.success(`Starting ${examType} ${subject} exam...`);
    navigate(`/exam?type=${examType}&subject=${subject}&year=${year}`);
  };

  const filteredSubjects = selectedFilter === 'ALL' 
    ? subjects 
    : subjects.filter(subject => subject.exam_type === selectedFilter);

  // Calculate stats
  const totalAttempts = examAttempts.length;
  const averageScore = totalAttempts > 0 
    ? Math.round(examAttempts.reduce((sum, attempt) => sum + attempt.score_percent, 0) / totalAttempts)
    : 0;
  const bestScore = totalAttempts > 0 
    ? Math.max(...examAttempts.map(attempt => attempt.score_percent))
    : 0;

  const stats = [
    { icon: BookOpen, label: 'Available Subjects', value: subjects.length, color: 'bg-blue-500' },
    { icon: Trophy, label: 'Exams Taken', value: totalAttempts, color: 'bg-green-500' },
    { icon: TrendingUp, label: 'Average Score', value: `${averageScore}%`, color: 'bg-yellow-500' },
    { icon: Users, label: 'Best Score', value: `${bestScore}%`, color: 'bg-purple-500' }
  ];

  const examTypes = ['ALL', 'WAEC', 'JAMB', 'NECO'];

  if (subjectsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

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
            Real Past Questions
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            AI-Powered Help
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            Progress Tracking
          </Badge>
          {profile?.is_premium && (
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-100 border-yellow-300/30">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
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
        {filteredSubjects.map((subject, index) => (
          <div key={`${subject.id}-${index}`} className="relative">
            <ExamCard
              examType={subject.exam_type}
              subject={subject.subject_name}
              year={2023}
              questions={subject.total_questions}
              duration={subject.time_limit_minutes}
              onStart={() => handleStartExam(subject.exam_type, subject.subject_name, 2023)}
            />
            {!subject.is_free && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-yellow-500 text-yellow-900">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No subjects found</h3>
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
              <h3 className="font-semibold mb-2">Track Progress</h3>
              <p className="text-sm text-gray-600">Monitor your improvement with detailed analytics</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
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
