import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch interpretation levels for score mapping
    const { data: interpretationLevels } = await supabase
      .from('interpretation_levels')
      .select('*')
      .order('min_score', { ascending: true });

    // Try to fetch by user_id first (new submissions), then by email (old submissions)
    let data = null;
    let error = null;

    // First try user_id
    const result1 = await supabase
      .from('quiz_submissions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (result1.error) {
      // user_id column might not exist yet, try user_email
      if (user.email) {
        const result2 = await supabase
          .from('quiz_submissions')
          .select('*')
          .eq('user_email', user.email)
          .order('created_at', { ascending: false });

        data = result2.data;
        error = result2.error;
      }
    } else {
      data = result1.data || [];

      // Also fetch by email for older submissions if we have an email
      if (user.email) {
        const result2 = await supabase
          .from('quiz_submissions')
          .select('*')
          .eq('user_email', user.email)
          .is('user_id', null)
          .order('created_at', { ascending: false });

        if (result2.data) {
          // Merge and deduplicate
          const existing = new Set(data.map((d: any) => d.id));
          for (const item of result2.data) {
            if (!existing.has(item.id)) {
              data.push(item);
            }
          }
        }
      }
    }

    if (error) {
      console.error('Quiz results query error:', error);
      return NextResponse.json({ data: [] });
    }

    // Sort by created_at descending
    data?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Transform data to include percentage and interpretation
    const transformedData = (data || []).map((submission: any) => {
      // Calculate percentage from stored max_score
      const percentage = submission.max_score
        ? Math.round((submission.total_score / submission.max_score) * 100)
        : null;

      // Find matching interpretation level based on total_score
      const interpretation = interpretationLevels?.find(
        (level: any) => submission.total_score >= level.min_score && submission.total_score <= level.max_score
      );

      return {
        id: submission.id,
        unique_id: submission.unique_id,
        score: submission.total_score,
        max_score: submission.max_score,
        percentage,
        interpretation: interpretation ? {
          level_label: interpretation.level_label,
          description: interpretation.description
        } : null,
        created_at: submission.created_at
      };
    });

    return NextResponse.json({ data: transformedData });
  } catch (error: any) {
    console.error('Quiz results API error:', error);
    return NextResponse.json({ data: [] });
  }
}
