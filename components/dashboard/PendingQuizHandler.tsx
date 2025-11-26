'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface PendingQuizHandlerProps {
  userId: string;
  userEmail: string;
  userName: string;
}

export function PendingQuizHandler({ userId, userEmail, userName }: PendingQuizHandlerProps) {
  const router = useRouter();

  useEffect(() => {
    const submitPendingQuiz = async () => {
      const pendingQuizData = localStorage.getItem('pendingQuiz');
      if (!pendingQuizData) return;

      try {
        const quizData = JSON.parse(pendingQuizData);
        const answers = new Map(quizData.answers);
        const sessionToken = quizData.sessionToken;

        const totalScore = Array.from(answers.values()).reduce((sum: number, answer: any) => sum + answer.points, 0);
        const uniqueId = `IMJ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Calculate max_score from current active questions
        const { data: questions } = await supabase
          .from('questions')
          .select('id, answer_choices(points)')
          .eq('is_active', true);

        const maxScore = questions?.reduce((sum: number, q: any) => {
          const points = q.answer_choices?.map((c: any) => c.points) || [0];
          return sum + Math.max(...points);
        }, 0) || 0;

        const { data: submissionData, error: submissionError } = await supabase
          .from('quiz_submissions')
          .insert({
            unique_id: uniqueId,
            user_name: userName,
            user_email: userEmail,
            total_score: totalScore,
            max_score: maxScore,
            user_id: userId,
            session_token: sessionToken
          })
          .select()
          .single();

        // Handle duplicate submission (unique constraint violation)
        if (submissionError?.code === '23505') {
          // Fetch existing submission with this session token
          const { data: existing } = await supabase
            .from('quiz_submissions')
            .select('unique_id')
            .eq('session_token', sessionToken)
            .single();

          localStorage.removeItem('pendingQuiz');
          localStorage.removeItem('quizSessionToken');

          if (existing) {
            router.push(`/results/${existing.unique_id}`);
            return;
          }
          return;
        }

        if (submissionError) throw submissionError;

        const answersArray = Array.from(answers.values()).map((answer: any) => ({
          submission_id: submissionData.id,
          question_id: answer.question_id,
          answer_choice_id: answer.answer_choice_id,
          points_earned: answer.points
        }));

        await supabase.from('submission_answers').insert(answersArray);

        localStorage.removeItem('pendingQuiz');
        localStorage.removeItem('quizSessionToken');
        router.push(`/results/${uniqueId}`);
      } catch (error) {
        console.error('Error submitting pending quiz:', error);
        localStorage.removeItem('pendingQuiz');
        localStorage.removeItem('quizSessionToken');
      }
    };

    submitPendingQuiz();
  }, [userId, userEmail, userName, router]);

  // This component doesn't render anything visible
  return null;
}
