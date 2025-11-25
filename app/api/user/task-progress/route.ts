import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// GET user's task progress
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all active tasks with user's progress
    const { data: tasks, error: tasksError } = await supabase
      .from('exploration_tasks')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (tasksError) throw tasksError;

    // Get user's progress for these tasks
    const { data: progress, error: progressError } = await supabase
      .from('user_task_progress')
      .select('*')
      .eq('user_id', user.id);

    if (progressError) throw progressError;

    // Combine tasks with progress
    const tasksWithProgress = tasks?.map(task => {
      const userProgress = progress?.find(p => p.task_id === task.id);
      return {
        ...task,
        status: userProgress?.status || 'not_started',
        notes: userProgress?.notes || null,
        progress_id: userProgress?.id || null
      };
    });

    return NextResponse.json({ data: tasksWithProgress });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST/PUT update task progress
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { task_id, status, notes } = body;

    if (!task_id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    // Check if progress already exists
    const { data: existing } = await supabase
      .from('user_task_progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('task_id', task_id)
      .single();

    let result;

    if (existing) {
      // Update existing progress
      const updateData: any = { status };
      if (notes !== undefined) updateData.notes = notes;
      if (status === 'completed') updateData.completed_at = new Date().toISOString();

      result = await supabase
        .from('user_task_progress')
        .update(updateData)
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      // Create new progress
      result = await supabase
        .from('user_task_progress')
        .insert({
          user_id: user.id,
          task_id,
          status: status || 'not_started',
          notes: notes || null,
          completed_at: status === 'completed' ? new Date().toISOString() : null
        })
        .select()
        .single();
    }

    if (result.error) throw result.error;

    return NextResponse.json({ data: result.data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
