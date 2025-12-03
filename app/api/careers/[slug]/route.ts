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

    // Get the career with its major and category
    const { data: career, error: careerError } = await supabaseAdmin
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
      .eq('is_active', true)
      .single();

    if (careerError || !career) {
      return NextResponse.json({ error: 'Career not found' }, { status: 404 });
    }

    return NextResponse.json({ data: career });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
