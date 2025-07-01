
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Subject {
  id: string;
  subject_name: string;
  exam_type: 'WAEC' | 'JAMB' | 'NECO';
  time_limit_minutes: number;
  is_free: boolean;
  total_questions: number;
  icon: string;
}

export interface Question {
  id: string;
  subject: string;
  exam_type: 'WAEC' | 'JAMB' | 'NECO';
  year: number;
  question_text: string;
  options: Record<string, string>;
  correct_option: string;
  explanation: string;
}

export interface ExamAttempt {
  id: string;
  subject: string;
  exam_type: 'WAEC' | 'JAMB' | 'NECO';
  questions_answered: number;
  correct_answers: number;
  score_percent: number;
  time_taken_minutes: number;
  completed_at: string;
}

export const useSupabaseData = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch subjects with optimized caching
  const { data: subjects = [], isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('id, subject_name, exam_type, time_limit_minutes, is_free, total_questions, icon')
        .order('subject_name');
      
      if (error) throw error;
      return data as Subject[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - subjects don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Fetch user profile with optimized caching
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch exam attempts with optimized caching
  const { data: examAttempts = [], isLoading: attemptsLoading } = useQuery({
    queryKey: ['exam-attempts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('exam_attempts')
        .select('id, subject, exam_type, questions_answered, correct_answers, score_percent, time_taken_minutes, completed_at')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(50); // Limit to recent attempts for better performance
      
      if (error) throw error;
      return data as ExamAttempt[];
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Fetch bookmarked questions with optimized caching
  const { data: bookmarkedQuestions = [] } = useQuery({
    queryKey: ['bookmarked-questions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('bookmarked_questions')
        .select(`
          question_id,
          questions (
            id,
            subject,
            exam_type,
            year,
            question_text,
            options,
            correct_option,
            explanation
          )
        `)
        .eq('user_id', user.id)
        .limit(100); // Limit for performance
      
      if (error) throw error;
      return data.map(item => item.questions).filter(Boolean) as Question[];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Save exam attempt with optimistic updates
  const saveExamAttempt = useMutation({
    mutationFn: async (attempt: Omit<ExamAttempt, 'id' | 'completed_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('exam_attempts')
        .insert({
          user_id: user.id,
          subject: attempt.subject,
          exam_type: attempt.exam_type,
          questions_answered: attempt.questions_answered,
          correct_answers: attempt.correct_answers,
          score_percent: attempt.score_percent,
          time_taken_minutes: attempt.time_taken_minutes
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newAttempt) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['exam-attempts', user?.id] });
      
      const previousAttempts = queryClient.getQueryData(['exam-attempts', user?.id]);
      
      queryClient.setQueryData(['exam-attempts', user?.id], (old: ExamAttempt[] = []) => [
        {
          ...newAttempt,
          id: 'temp-' + Date.now(),
          completed_at: new Date().toISOString()
        } as ExamAttempt,
        ...old
      ]);
      
      return { previousAttempts };
    },
    onError: (err, newAttempt, context) => {
      queryClient.setQueryData(['exam-attempts', user?.id], context?.previousAttempts);
      toast.error('Failed to save exam results');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-attempts'] });
      toast.success('Exam results saved!');
    }
  });

  // Toggle bookmark with optimistic updates
  const toggleBookmark = useMutation({
    mutationFn: async (questionId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { data: existing } = await supabase
        .from('bookmarked_questions')
        .select('id')
        .eq('user_id', user.id)
        .eq('question_id', questionId)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('bookmarked_questions')
          .delete()
          .eq('id', existing.id);
        
        if (error) throw error;
        return { action: 'removed' };
      } else {
        const { error } = await supabase
          .from('bookmarked_questions')
          .insert({
            user_id: user.id,
            question_id: questionId
          });
        
        if (error) throw error;
        return { action: 'added' };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarked-questions'] });
      toast.success(
        result.action === 'added' 
          ? 'Question bookmarked!' 
          : 'Bookmark removed!'
      );
    }
  });

  return {
    subjects,
    subjectsLoading,
    profile,
    examAttempts,
    attemptsLoading,
    bookmarkedQuestions,
    saveExamAttempt,
    toggleBookmark,
    user
  };
};
