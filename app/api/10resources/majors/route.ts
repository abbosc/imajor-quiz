import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Disable Next.js route caching to ensure fresh data
export const dynamic = 'force-dynamic';

// GET all active resource majors with resource counts
export async function GET() {
  try {
    const { data: majors, error } = await supabaseAdmin
      .from('resource_majors')
      .select('*')
      // .eq('is_active', true) // Temporarily disabled for debugging
      .order('order_index', { ascending: true });

    if (error) throw error;

    // Get resource counts for each major
    const majorsWithCounts = await Promise.all(
      (majors || []).map(async (major) => {
        const { count } = await supabaseAdmin
          .from('resources')
          .select('*', { count: 'exact', head: true })
          .eq('major_id', major.id);

        return { ...major, resource_count: count || 0 };
      })
    );

    return NextResponse.json({ data: majorsWithCounts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
