import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET category details with its majors
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get the category
    const { data: category, error: categoryError } = await supabaseAdmin
      .from('career_categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (categoryError || !category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Get majors in this category with career counts via relation
    const { data: majors, error: majorsError } = await supabaseAdmin
      .from('career_majors')
      .select(`
        id, name, slug, description,
        careers!left(id, is_active)
      `)
      .eq('category_id', category.id)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (majorsError) throw majorsError;

    // Map to add careers_count from relation (filtering active careers)
    const majorsWithCounts = (majors || []).map((major: any) => {
      const activeCareers = (major.careers || []).filter((c: any) => c.is_active);
      const { careers, ...rest } = major;
      return {
        ...rest,
        careers_count: activeCareers.length
      };
    });

    return NextResponse.json({
      data: {
        ...category,
        majors: majorsWithCounts
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
