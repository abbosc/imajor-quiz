import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// GET user's saved careers
export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get saved careers with full career details
    const { data: savedCareers, error } = await supabaseAdmin
      .from('user_saved_careers')
      .select(`
        id,
        created_at,
        career:careers(
          id,
          name,
          slug,
          brief_description,
          salary_average,
          growth_outlook,
          major:career_majors(
            id,
            name,
            slug,
            category:career_categories(id, name, slug, icon, color)
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data: savedCareers || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, data: [] }, { status: 500 });
  }
}
