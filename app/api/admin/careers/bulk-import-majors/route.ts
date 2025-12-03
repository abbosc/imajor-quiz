import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyAdmin } from '@/lib/admin-auth';

interface MajorImport {
  category_slug: string;
  name: string;
  slug: string;
  description?: string;
}

export async function POST(request: NextRequest) {
  const { isAdmin } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { majors } = await request.json();

    if (!Array.isArray(majors) || majors.length === 0) {
      return NextResponse.json(
        { error: 'Majors must be a non-empty array' },
        { status: 400 }
      );
    }

    // Get all categories for slug lookup
    const { data: categories, error: catError } = await supabaseAdmin
      .from('career_categories')
      .select('id, slug');

    if (catError) throw catError;

    const categoryMap = new Map(categories?.map(c => [c.slug, c.id]) || []);

    const validatedMajors: Array<{
      category_id: string;
      name: string;
      slug: string;
      description: string | null;
    }> = [];
    const errors: string[] = [];

    // Validate all majors
    for (let i = 0; i < majors.length; i++) {
      const m: MajorImport = majors[i];

      try {
        if (!m.name) {
          throw new Error('Missing name');
        }
        if (!m.slug) {
          throw new Error('Missing slug');
        }
        if (!m.category_slug) {
          throw new Error('Missing category_slug');
        }

        const categoryId = categoryMap.get(m.category_slug);
        if (!categoryId) {
          throw new Error(`Category "${m.category_slug}" not found`);
        }

        validatedMajors.push({
          category_id: categoryId,
          name: m.name,
          slug: m.slug,
          description: m.description || null
        });
      } catch (err: any) {
        errors.push(`Major ${i + 1} ("${m.name || 'unnamed'}"): ${err.message}`);
      }
    }

    if (validatedMajors.length === 0) {
      return NextResponse.json(
        { error: 'No valid majors to import', details: errors },
        { status: 400 }
      );
    }

    // Insert all validated majors
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('career_majors')
      .insert(validatedMajors)
      .select();

    if (insertError) {
      return NextResponse.json(
        { error: `Failed to insert majors: ${insertError.message}`, details: errors },
        { status: 500 }
      );
    }

    return NextResponse.json({
      imported: inserted?.length || 0,
      total: majors.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
