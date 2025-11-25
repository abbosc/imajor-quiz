import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to dashboard with flag to check for pending quiz
      return NextResponse.redirect(`${origin}/dashboard?checkPendingQuiz=true`);
    }
  }

  // Return to home on error
  return NextResponse.redirect(`${origin}/`);
}
