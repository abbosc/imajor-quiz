import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Single query with OR condition - fetches by user_id OR user_email in one request
    const orConditions = [`user_id.eq.${user.id}`];
    if (user.email) {
      orConditions.push(`user_email.eq.${user.email}`);
    }

    const { data, error } = await supabase
      .from('quiz_submissions')
      .select('id, unique_id, total_score, max_score, created_at')
      .or(orConditions.join(','))
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Quiz results query error:', error);
      return NextResponse.json({ data: [] });
    }

    // Transform data to include percentage
    const transformedData = (data || []).map((submission) => ({
      id: submission.id,
      unique_id: submission.unique_id,
      score: submission.total_score,
      max_score: submission.max_score,
      percentage: submission.max_score
        ? Math.round((submission.total_score / submission.max_score) * 100)
        : null,
      created_at: submission.created_at
    }));

    return NextResponse.json({ data: transformedData });
  } catch (error: any) {
    console.error('Quiz results API error:', error);
    return NextResponse.json({ data: [] });
  }
}
