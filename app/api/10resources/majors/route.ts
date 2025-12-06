import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Disable Next.js route caching to ensure fresh data
export const dynamic = 'force-dynamic';

// GET all active resource majors with resource counts
export async function GET() {
  try {
    // Single query with relation to get majors and their resources
    const { data: majors, error } = await supabaseAdmin
      .from('resource_majors')
      .select(`
        *,
        resources!left(id)
      `)
      .order('order_index', { ascending: true });

    if (error) throw error;

    // Map to add resource_count from relation length
    const majorsWithCounts = (majors || []).map((major: any) => {
      const { resources, ...rest } = major;
      return {
        ...rest,
        resource_count: (resources || []).length
      };
    });

    return NextResponse.json({ data: majorsWithCounts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
