import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Disable Next.js route caching to ensure fresh data
export const dynamic = 'force-dynamic';

// GET all resources for a major, grouped by category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ major: string }> }
) {
  try {
    const { major: majorSlug } = await params;

    // Get the major
    const { data: major, error: majorError } = await supabaseAdmin
      .from('resource_majors')
      .select('*')
      .eq('slug', majorSlug)
      .eq('is_active', true)
      .single();

    if (majorError || !major) {
      return NextResponse.json({ error: 'Major not found' }, { status: 404 });
    }

    // Get all categories
    const { data: categories, error: categoriesError } = await supabaseAdmin
      .from('resource_categories')
      .select('*')
      .order('order_index', { ascending: true });

    if (categoriesError) throw categoriesError;

    // Get all resources for this major
    const { data: resources, error: resourcesError } = await supabaseAdmin
      .from('resources')
      .select('*')
      .eq('major_id', major.id)
      .order('order_index', { ascending: true });

    if (resourcesError) throw resourcesError;

    // Group resources by category
    const categoriesWithResources = (categories || []).map(category => ({
      ...category,
      resources: (resources || []).filter(r => r.category_id === category.id)
    }));

    return NextResponse.json({
      data: {
        major,
        categories: categoriesWithResources
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
