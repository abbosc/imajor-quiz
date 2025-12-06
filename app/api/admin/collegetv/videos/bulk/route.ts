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
    const match = url.trim().match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Generate thumbnail URL from YouTube ID
function getThumbnailUrl(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
}

// Fetch video title from YouTube oEmbed API
async function fetchYoutubeTitle(youtubeUrl: string): Promise<string | null> {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(youtubeUrl)}&format=json`;
    const res = await fetch(oembedUrl, {
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(5000)
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.title || null;
  } catch {
    return null;
  }
}

interface BulkResult {
  url: string;
  success: boolean;
  title?: string;
  error?: string;
}

// POST - Bulk create videos from multiple URLs
export async function POST(request: NextRequest) {
  const { isAdmin } = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { urls, tags } = body;

  if (!urls || typeof urls !== 'string') {
    return NextResponse.json({ error: 'URLs are required' }, { status: 400 });
  }

  // Parse URLs (one per line)
  const urlList = urls
    .split('\n')
    .map((u: string) => u.trim())
    .filter((u: string) => u.length > 0);

  if (urlList.length === 0) {
    return NextResponse.json({ error: 'No valid URLs provided' }, { status: 400 });
  }

  // Get current max order_index
  const { data: maxOrder } = await supabaseAdmin
    .from('college_tv_videos')
    .select('order_index')
    .order('order_index', { ascending: false })
    .limit(1)
    .single();

  let currentOrderIndex = (maxOrder?.order_index || 0) + 1;

  const results: BulkResult[] = [];

  // Process each URL
  for (const url of urlList) {
    const youtubeId = extractYoutubeId(url);

    if (!youtubeId) {
      results.push({
        url,
        success: false,
        error: 'Invalid YouTube URL',
      });
      continue;
    }

    // Construct proper YouTube URL for oEmbed
    const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeId}`;

    // Fetch title from YouTube
    const title = await fetchYoutubeTitle(youtubeUrl) || `Video ${youtubeId}`;
    const thumbnailUrl = getThumbnailUrl(youtubeId);

    // Insert into database
    const { error } = await supabaseAdmin
      .from('college_tv_videos')
      .insert({
        title,
        description: null,
        youtube_url: youtubeUrl,
        youtube_id: youtubeId,
        thumbnail_url: thumbnailUrl,
        tags: tags || [],
        order_index: currentOrderIndex,
        is_published: true,
      });

    if (error) {
      results.push({
        url,
        success: false,
        error: error.message,
      });
    } else {
      results.push({
        url,
        success: true,
        title,
      });
      currentOrderIndex++;
    }
  }

  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  return NextResponse.json({
    message: `Added ${successCount} videos${failCount > 0 ? `, ${failCount} failed` : ''}`,
    results,
  });
}
