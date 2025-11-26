import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET user's selected majors
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('user_majors')
      .select(`
        id,
        major_id,
        created_at,
        majors (
          id,
          name,
          is_active
        )
      `)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST add major to user's selections
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { major_id } = body;

    if (!major_id) {
      return NextResponse.json({ error: 'major_id is required' }, { status: 400 });
    }

    const { data, error } = await (supabaseAdmin
      .from('user_majors') as any)
      .insert({
        user_id: user.id,
        major_id
      })
      .select(`
        id,
        major_id,
        created_at,
        majors (
          id,
          name,
          is_active
        )
      `)
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Major already selected' }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE remove major from user's selections
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const majorId = searchParams.get('majorId');

    if (!majorId) {
      return NextResponse.json({ error: 'majorId is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('user_majors')
      .delete()
      .eq('user_id', user.id)
      .eq('major_id', majorId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
