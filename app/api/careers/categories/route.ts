import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET all active career categories
export async function GET() {
  try {
    // Single query with relation to get categories and their majors
    const { data, error } = await supabaseAdmin
      .from('career_categories')
      .select(`
        id,
        name,
        slug,
        description,
        icon,
        color,
        order_index,
        career_majors!left(id, is_active)
      `)
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) throw error;

    // Map to add majors_count from relation (filtering active majors)
    const categoriesWithCounts = (data || []).map((category: any) => {
      const activeMajors = (category.career_majors || []).filter((m: any) => m.is_active);
      const { career_majors, ...rest } = category;
      return {
        ...rest,
        majors_count: activeMajors.length
      };
    });

    return NextResponse.json({ data: categoriesWithCounts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, data: [] }, { status: 500 });
  }
}
