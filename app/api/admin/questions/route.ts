import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

function verifyAdmin(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return false;
  }
  return true;
}

// GET all questions
export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('questions')
      .select(`
        *,
        answer_choices (*)
      `)
      .order('order_index', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST new question with answer choices
export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { question_text, explanation, order_index, is_active, answer_choices } = body;

    // Insert question
    const { data: questionData, error: questionError } = await supabaseAdmin
      .from('questions')
      .insert({
        question_text,
        explanation: explanation || null,
        order_index,
        is_active
      })
      .select()
      .single();

    if (questionError) throw questionError;

    // Insert answer choices
    if (answer_choices && answer_choices.length > 0) {
      const choicesData = answer_choices.map((choice: any) => ({
        question_id: questionData.id,
        choice_text: choice.choice_text,
        points: choice.points,
        order_index: choice.order_index
      }));

      const { error: choicesError } = await supabaseAdmin
        .from('answer_choices')
        .insert(choicesData);

      if (choicesError) throw choicesError;
    }

    return NextResponse.json({ data: questionData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update question
export async function PUT(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, is_active } = body;

    const { data, error } = await supabaseAdmin
      .from('questions')
      .update({ is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE question
export async function DELETE(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('questions')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
