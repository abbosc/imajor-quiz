import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyAdmin } from '@/lib/admin-auth';

// GET resources - optionally filtered by major_id and/or category_id
export async function GET(request: NextRequest) {
  const { isAdmin } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const majorId = searchParams.get('major_id');
    const categoryId = searchParams.get('category_id');

    let query = supabaseAdmin
      .from('resources')
      .select(`
        *,
        category:resource_categories(id, name, slug, icon, order_index)
      `)
      .order('order_index', { ascending: true });

    if (majorId) {
      query = query.eq('major_id', majorId);
    }
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new resource
export async function POST(request: NextRequest) {
  const { isAdmin } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { major_id, category_id, name, description, url, order_index } = body;

    if (!major_id || !category_id || !name) {
      return NextResponse.json(
        { error: 'major_id, category_id, and name are required' },
        { status: 400 }
      );
    }

    const { data, error } = await (supabaseAdmin
      .from('resources') as any)
      .insert({
        major_id,
        category_id,
        name,
        description: description || null,
        url: url || null,
        order_index: order_index || 0
      })
      .select(`
        *,
        category:resource_categories(id, name, slug, icon)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update resource
export async function PUT(request: NextRequest) {
  const { isAdmin } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, description, url, order_index } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (url !== undefined) updateData.url = url;
    if (order_index !== undefined) updateData.order_index = order_index;

    const { data, error } = await (supabaseAdmin
      .from('resources') as any)
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        category:resource_categories(id, name, slug, icon)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE resource
export async function DELETE(request: NextRequest) {
  const { isAdmin } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('resources')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
