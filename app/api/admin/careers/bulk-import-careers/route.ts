import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyAdmin } from '@/lib/admin-auth';

interface CareerImport {
  major_slug: string;
  name: string;
  slug: string;
  brief_description?: string;
  responsibilities?: string[];
  hard_skills?: string[];
  soft_skills?: string[];
  education_required?: string;
  certifications?: string[];
  salary_entry?: number;
  salary_average?: number;
  salary_high?: number;
  salary_growth?: string;
  high_paying_regions?: string[];
  high_paying_industries?: string[];
  growth_outlook?: string;
  advancement_paths?: string[];
  typical_day?: string;
  real_tasks?: string[];
}

export async function POST(request: NextRequest) {
  const { isAdmin } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { careers } = await request.json();

    if (!Array.isArray(careers) || careers.length === 0) {
      return NextResponse.json(
        { error: 'Careers must be a non-empty array' },
        { status: 400 }
      );
    }

    // Get all majors for slug lookup
    const { data: majors, error: majorError } = await supabaseAdmin
      .from('career_majors')
      .select('id, slug');

    if (majorError) throw majorError;

    const majorMap = new Map(majors?.map(m => [m.slug, m.id]) || []);

    const validatedCareers: Array<{
      major_id: string;
      name: string;
      slug: string;
      brief_description: string | null;
      responsibilities: string[] | null;
      hard_skills: string[] | null;
      soft_skills: string[] | null;
      education_required: string | null;
      certifications: string[] | null;
      salary_entry: number | null;
      salary_average: number | null;
      salary_high: number | null;
      salary_growth: string | null;
      high_paying_regions: string[] | null;
      high_paying_industries: string[] | null;
      growth_outlook: string | null;
      advancement_paths: string[] | null;
      typical_day: string | null;
      real_tasks: string[] | null;
    }> = [];
    const errors: string[] = [];

    // Validate all careers
    for (let i = 0; i < careers.length; i++) {
      const c: CareerImport = careers[i];

      try {
        if (!c.name) {
          throw new Error('Missing name');
        }
        if (!c.slug) {
          throw new Error('Missing slug');
        }
        if (!c.major_slug) {
          throw new Error('Missing major_slug');
        }

        const majorId = majorMap.get(c.major_slug);
        if (!majorId) {
          throw new Error(`Major "${c.major_slug}" not found`);
        }

        validatedCareers.push({
          major_id: majorId,
          name: c.name,
          slug: c.slug,
          brief_description: c.brief_description || null,
          responsibilities: c.responsibilities || null,
          hard_skills: c.hard_skills || null,
          soft_skills: c.soft_skills || null,
          education_required: c.education_required || null,
          certifications: c.certifications || null,
          salary_entry: c.salary_entry || null,
          salary_average: c.salary_average || null,
          salary_high: c.salary_high || null,
          salary_growth: c.salary_growth || null,
          high_paying_regions: c.high_paying_regions || null,
          high_paying_industries: c.high_paying_industries || null,
          growth_outlook: c.growth_outlook || null,
          advancement_paths: c.advancement_paths || null,
          typical_day: c.typical_day || null,
          real_tasks: c.real_tasks || null
        });
      } catch (err: any) {
        errors.push(`Career ${i + 1} ("${c.name || 'unnamed'}"): ${err.message}`);
      }
    }

    if (validatedCareers.length === 0) {
      return NextResponse.json(
        { error: 'No valid careers to import', details: errors },
        { status: 400 }
      );
    }

    // Insert all validated careers
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('careers')
      .insert(validatedCareers)
      .select();

    if (insertError) {
      return NextResponse.json(
        { error: `Failed to insert careers: ${insertError.message}`, details: errors },
        { status: 500 }
      );
    }

    return NextResponse.json({
      imported: inserted?.length || 0,
      total: careers.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
