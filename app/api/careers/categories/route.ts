import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET all active career categories
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('career_categories')
      .select(`
        id,
        name,
        slug,
        description,
        icon,
        color,
        order_index
      `)
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) throw error;

    // Get major counts for each category
    const categoriesWithCounts = await Promise.all(
      (data || []).map(async (category) => {
        const { count } = await supabaseAdmin
          .from('career_majors')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id)
          .eq('is_active', true);

        return {
          ...category,
          majors_count: count || 0
        };
      })
    );

    return NextResponse.json({ data: categoriesWithCounts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, data: [] }, { status: 500 });
  }
}
