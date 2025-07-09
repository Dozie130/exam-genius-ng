import React, { useState } from 'react';
import { User, Mail, Calendar, Crown, Trophy, Target, Clock, Edit2 } from 'lucide-react';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import PremiumUpgradeButton from '@/components/PremiumUpgradeButton';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const { profile, examAttempts, attemptsLoading } = useSupabaseData();
  const [isEditing, setIsEditing] = useState(false);

  if (loading || attemptsLoading) {
    return (
      <Layout title="My Profile">
        <LoadingSpinner message="Loading your profile..." />
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout title="My Profile">
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Please sign in to view your profile</p>
        </div>
      </Layout>
    );
  }

  // Calculate statistics
  const totalAttempts = examAttempts.length;
  const averageScore = totalAttempts > 0 
    ? Math.round(examAttempts.reduce((sum, attempt) => sum + attempt.score_percent, 0) / totalAttempts)
    : 0;
  const bestScore = totalAttempts > 0 
    ? Math.max(...examAttempts.map(attempt => attempt.score_percent))
    : 0;
  const totalTimeSpent = examAttempts.reduce((sum, attempt) => sum + attempt.time_taken_minutes, 0);

  // Get recent attempts
  const recentAttempts = examAttempts.slice(0, 5);

  return (
    <Layout title="My Profile">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    {profile?.full_name || user.email}
                    {profile?.is_paid && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-base">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Member Since</div>
                <div className="font-semibold">
                  {format(new Date(user.created_at), 'MMM yyyy')}
                </div>
              </div>
              
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <Trophy className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Total Exams</div>
                <div className="font-semibold text-lg">{totalAttempts}</div>
              </div>
              
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Best Score</div>
                <div className="font-semibold text-lg">{bestScore}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Status */}
        {!profile?.is_paid && (
          <Card className="shadow-lg border-0 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Crown className="w-6 h-6 text-yellow-600" />
                Free Account
              </CardTitle>
              <CardDescription>
                Upgrade to Premium for unlimited access to all features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Limited to 5 questions per exam • Basic features only
                  </p>
                  <PremiumUpgradeButton />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Performance Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Average Score</span>
                  <span className="font-semibold">{averageScore}%</span>
                </div>
                <Progress value={averageScore} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{totalAttempts}</div>
                  <div className="text-xs text-gray-600">Total Attempts</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{Math.round(totalTimeSpent / 60)}h</div>
                  <div className="text-xs text-gray-600">Study Time</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentAttempts.length > 0 ? (
                <div className="space-y-3">
                  {recentAttempts.map((attempt, index) => (
                    <div key={attempt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{attempt.exam_type} - {attempt.subject}</div>
                        <div className="text-xs text-gray-600">
                          {format(new Date(attempt.completed_at), 'MMM dd, yyyy')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold text-sm ${
                          attempt.score_percent >= 70 ? 'text-green-600' : 
                          attempt.score_percent >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {attempt.score_percent}%
                        </div>
                        <div className="text-xs text-gray-600">
                          {attempt.correct_answers}/{attempt.questions_answered}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Trophy className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No exams taken yet</p>
                  <p className="text-sm">Start practicing to see your progress!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;