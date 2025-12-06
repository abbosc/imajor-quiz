import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET - Fetch published videos with optional tag filter
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');

  let query = supabaseAdmin
    .from('college_tv_videos')
    .select('*')
    .eq('is_published', true)
    .order('order_index', { ascending: true });

  // Filter by tag if provided
  if (tag) {
    query = query.contains('tags', [tag]);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
