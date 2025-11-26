import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

function verifyAdmin(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return false;
  }
  return true;
}

interface ValidatedQuestion {
  question_text: string;
  explanation: string | null;
  order_index: number;
  is_active: boolean;
  answer_choices: Array<{
    choice_text: string;
    points: number;
    order_index: number;
  }>;
  originalIndex: number;
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { questions } = await request.json();

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: 'Questions must be a non-empty array' },
        { status: 400 }
      );
    }

    const validatedQuestions: ValidatedQuestion[] = [];
    const errors: string[] = [];

    // Phase 1: Validate all questions first (no DB calls)
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      try {
        if (!q.question_text) {
          throw new Error('Missing question_text');
        }

        if (!q.answer_choices || !Array.isArray(q.answer_choices) || q.answer_choices.length < 2) {
          throw new Error('Must have at least 2 answer choices');
        }

        for (let j = 0; j < q.answer_choices.length; j++) {
          if (!q.answer_choices[j].choice_text) {
            throw new Error(`Answer choice ${j + 1} missing choice_text`);
          }
        }

        // Question passed validation
        validatedQuestions.push({
          question_text: q.question_text,
          explanation: q.explanation || null,
          order_index: q.order_index || i + 1,
          is_active: q.is_active !== undefined ? q.is_active : true,
          answer_choices: q.answer_choices.map((choice: any, idx: number) => ({
            choice_text: choice.choice_text,
            points: choice.points !== undefined ? choice.points : 0,
            order_index: choice.order_index || idx + 1
          })),
          originalIndex: i
        });
      } catch (err: any) {
        errors.push(`Question ${i + 1} ("${q.question_text?.substring(0, 50)}..."): ${err.message}`);
      }
    }

    if (validatedQuestions.length === 0) {
      return NextResponse.json(
        { error: 'No valid questions to import', details: errors },
        { status: 400 }
      );
    }

    // Phase 2: Batch insert all validated questions (1 DB call instead of N)
    const questionsToInsert = validatedQuestions.map(q => ({
      question_text: q.question_text,
      explanation: q.explanation,
      order_index: q.order_index,
      is_active: q.is_active
    }));

    const { data: insertedQuestions, error: questionsError } = await (supabaseAdmin
      .from('questions') as any)
      .insert(questionsToInsert)
      .select('id');

    if (questionsError) {
      return NextResponse.json(
        { error: `Failed to insert questions: ${questionsError.message}`, details: errors },
        { status: 500 }
      );
    }

    // Phase 3: Batch insert all answer choices (1 DB call instead of N)
    const allChoices: Array<{
      question_id: string;
      choice_text: string;
      points: number;
      order_index: number;
    }> = [];

    for (let i = 0; i < validatedQuestions.length; i++) {
      const questionId = insertedQuestions[i].id;
      const vq = validatedQuestions[i];

      for (const choice of vq.answer_choices) {
        allChoices.push({
          question_id: questionId,
          choice_text: choice.choice_text,
          points: choice.points,
          order_index: choice.order_index
        });
      }
    }

    const { error: choicesError } = await (supabaseAdmin
      .from('answer_choices') as any)
      .insert(allChoices);

    if (choicesError) {
      // Rollback: delete the questions we just inserted
      const insertedIds = insertedQuestions.map((q: any) => q.id);
      await (supabaseAdmin.from('questions') as any).delete().in('id', insertedIds);

      return NextResponse.json(
        { error: `Failed to insert answer choices: ${choicesError.message}`, details: errors },
        { status: 500 }
      );
    }

    return NextResponse.json({
      imported: validatedQuestions.length,
      total: questions.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
