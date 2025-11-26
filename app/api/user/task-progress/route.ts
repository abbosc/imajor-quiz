import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// GET user's task progress - Single query with relation instead of N+1
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Single query: Get tasks with user's progress via relation
    // The filter on user_task_progress.user_id filters the nested array, not the parent rows
    const { data: tasks, error } = await supabase
      .from('exploration_tasks')
      .select(`
        id, title, description, category, order_index,
        user_task_progress(id, status, notes)
      `)
      .eq('is_active', true)
      .eq('user_task_progress.user_id', user.id)
      .order('order_index', { ascending: true });

    if (error) throw error;

    // Transform: user_task_progress is array (empty or single item)
    const tasksWithProgress = tasks?.map(task => {
      const progress = (task.user_task_progress as any[])?.[0];
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        category: task.category,
        order_index: task.order_index,
        status: progress?.status || 'not_started',
        notes: progress?.notes || null,
        progress_id: progress?.id || null
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
