import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyAdmin } from '@/lib/admin-auth';

interface ResourceInput {
  name: string;
  description?: string;
  url?: string;
  order_index?: number;
  category_slug?: string; // For specifying category by slug
}

export async function POST(request: NextRequest) {
  const { isAdmin } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { major_id, category_id, resources } = body;

    if (!major_id) {
      return NextResponse.json({ error: 'major_id is required' }, { status: 400 });
    }

    if (!resources || !Array.isArray(resources) || resources.length === 0) {
      return NextResponse.json({ error: 'resources array is required' }, { status: 400 });
    }

    // If category_id is provided, all resources go to that category
    // Otherwise, each resource should have a category_slug

    let categoryMap: Record<string, string> = {};

    if (!category_id) {
      // Fetch all categories to map slugs to IDs
      const { data: categories } = await supabaseAdmin
        .from('resource_categories')
        .select('id, slug');

      if (categories) {
        categoryMap = categories.reduce((acc, cat) => {
          acc[cat.slug] = cat.id;
          return acc;
        }, {} as Record<string, string>);
      }
    }

    const results = {
      imported: 0,
      errors: [] as string[],
      total: resources.length
    };

    for (let i = 0; i < resources.length; i++) {
      const resource = resources[i] as ResourceInput;

      if (!resource.name) {
        results.errors.push(`Row ${i + 1}: name is required`);
        continue;
      }

      // Determine category ID
      let targetCategoryId = category_id;

      if (!targetCategoryId && resource.category_slug) {
        targetCategoryId = categoryMap[resource.category_slug];
        if (!targetCategoryId) {
          results.errors.push(`Row ${i + 1}: invalid category_slug "${resource.category_slug}"`);
          continue;
        }
      }

      if (!targetCategoryId) {
        results.errors.push(`Row ${i + 1}: category_id or category_slug is required`);
        continue;
      }

      try {
        const { error } = await (supabaseAdmin
          .from('resources') as any)
          .insert({
            major_id,
            category_id: targetCategoryId,
            name: resource.name,
            description: resource.description || null,
            url: resource.url || null,
            order_index: resource.order_index || (i + 1)
          });

        if (error) {
          results.errors.push(`Row ${i + 1}: ${error.message}`);
        } else {
          results.imported++;
        }
      } catch (err: any) {
        results.errors.push(`Row ${i + 1}: ${err.message}`);
      }
    }

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
