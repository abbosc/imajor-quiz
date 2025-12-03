import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// POST - Save a career
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { career_id } = await request.json();

    if (!career_id) {
      return NextResponse.json({ error: 'career_id is required' }, { status: 400 });
    }

    // Verify career exists
    const { data: career } = await supabaseAdmin
      .from('careers')
      .select('id')
      .eq('id', career_id)
      .eq('is_active', true)
      .single();

    if (!career) {
      return NextResponse.json({ error: 'Career not found' }, { status: 404 });
    }

    // Save the career
    const { data, error } = await supabaseAdmin
      .from('user_saved_careers')
      .insert({
        user_id: user.id,
        career_id: career_id
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Career already saved' }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({ data, message: 'Career saved successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Remove a saved career
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { career_id } = await request.json();

    if (!career_id) {
      return NextResponse.json({ error: 'career_id is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('user_saved_careers')
      .delete()
      .eq('user_id', user.id)
      .eq('career_id', career_id);

    if (error) throw error;

    return NextResponse.json({ message: 'Career removed from saved' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
