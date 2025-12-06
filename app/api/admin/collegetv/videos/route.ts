import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { verifyAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

// Extract YouTube ID from various URL formats
function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/, // Direct ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Generate thumbnail URL from YouTube ID
function getThumbnailUrl(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
}

// GET - Fetch all videos
export async function GET() {
  const { isAdmin } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('college_tv_videos')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// POST - Create new video
export async function POST(request: NextRequest) {
  const { isAdmin } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, youtube_url, tags } = body;

  if (!title || !youtube_url) {
    return NextResponse.json({ error: 'Title and YouTube URL are required' }, { status: 400 });
  }

  const youtube_id = extractYoutubeId(youtube_url);
  if (!youtube_id) {
    return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
  }

  const thumbnail_url = getThumbnailUrl(youtube_id);

  // Get max order_index
  const { data: maxOrder } = await supabaseAdmin
    .from('college_tv_videos')
    .select('order_index')
    .order('order_index', { ascending: false })
    .limit(1)
    .single();

  const order_index = (maxOrder?.order_index || 0) + 1;

  const { data, error } = await supabaseAdmin
    .from('college_tv_videos')
    .insert({
      title,
      description: description || null,
      youtube_url,
      youtube_id,
      thumbnail_url,
      tags: tags || [],
      order_index,
      is_published: true,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// PUT - Update video
export async function PUT(request: NextRequest) {
  const { isAdmin } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, title, description, youtube_url, tags, is_published, order_index } = body;

  if (!id) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (tags !== undefined) updateData.tags = tags;
  if (is_published !== undefined) updateData.is_published = is_published;
  if (order_index !== undefined) updateData.order_index = order_index;

  // If YouTube URL changed, re-extract ID and thumbnail
  if (youtube_url) {
    const youtube_id = extractYoutubeId(youtube_url);
    if (!youtube_id) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }
    updateData.youtube_url = youtube_url;
    updateData.youtube_id = youtube_id;
    updateData.thumbnail_url = getThumbnailUrl(youtube_id);
  }

  const { data, error } = await supabaseAdmin
    .from('college_tv_videos')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// DELETE - Delete video
export async function DELETE(request: NextRequest) {
  const { isAdmin } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('college_tv_videos')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
