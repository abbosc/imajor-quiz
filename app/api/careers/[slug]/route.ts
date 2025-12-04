import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET full career details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const url = new URL(request.url);
    const majorSlug = url.searchParams.get('major');

    // Build the query
    let query = supabaseAdmin
      .from('careers')
      .select(`
        *,
        major:career_majors(
          id,
          name,
          slug,
          category:career_categories(id, name, slug, icon, color)
        )
      `)
      .eq('slug', slug)
      .eq('is_active', true);

    // If major slug provided, filter by it to handle duplicate career slugs
    if (majorSlug) {
      // First get the major id
      const { data: major } = await supabaseAdmin
        .from('career_majors')
        .select('id')
        .eq('slug', majorSlug)
        .single();

      if (major) {
        query = query.eq('major_id', major.id);
      }
    }

    const { data: career, error: careerError } = await query.single();

    if (careerError || !career) {
      return NextResponse.json({ error: 'Career not found' }, { status: 404 });
    }

    return NextResponse.json({ data: career });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
