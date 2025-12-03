import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET major details with its careers
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get the major with its category
    const { data: major, error: majorError } = await supabaseAdmin
      .from('career_majors')
      .select(`
        *,
        category:career_categories(id, name, slug, icon, color)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (majorError || !major) {
      return NextResponse.json({ error: 'Major not found' }, { status: 404 });
    }

    // Get careers for this major
    const { data: careers, error: careersError } = await supabaseAdmin
      .from('careers')
      .select(`
        id,
        name,
        slug,
        brief_description,
        salary_entry,
        salary_average,
        salary_high,
        growth_outlook
      `)
      .eq('major_id', major.id)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (careersError) throw careersError;

    return NextResponse.json({
      data: {
        ...major,
        careers: careers || []
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
