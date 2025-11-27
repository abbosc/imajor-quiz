import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function verifyAdmin(): Promise<{ isAdmin: boolean; userId: string | null }> {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient(cookieStore);

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { isAdmin: false, userId: null };
    }

    // Check if user is admin in profiles table
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return { isAdmin: false, userId: user.id };
    }

    return { isAdmin: profile.is_admin === true, userId: user.id };
  } catch (error) {
    console.error('Admin verification error:', error);
    return { isAdmin: false, userId: null };
  }
}
