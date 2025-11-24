import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

function verifyAdmin(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return false;
  }
  return true;
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

    let importedCount = 0;
    const errors: string[] = [];

    // Process each question
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      try {
        // Validate required fields
        if (!q.question_text) {
          throw new Error('Missing question_text');
        }

        if (!q.answer_choices || !Array.isArray(q.answer_choices) || q.answer_choices.length < 2) {
          throw new Error('Must have at least 2 answer choices');
        }

        // Validate answer choices have required fields
        for (let j = 0; j < q.answer_choices.length; j++) {
          if (!q.answer_choices[j].choice_text) {
            throw new Error(`Answer choice ${j + 1} missing choice_text`);
          }
        }

        // Insert question
        const { data: questionData, error: questionError } = await supabaseAdmin
          .from('questions')
          .insert({
            question_text: q.question_text,
            explanation: q.explanation || null,
            order_index: q.order_index || i + 1,
            is_active: q.is_active !== undefined ? q.is_active : true
          })
          .select()
          .single();

        if (questionError) throw new Error(`DB Error inserting question: ${questionError.message} (code: ${questionError.code}, details: ${questionError.details})`);

        // Insert answer choices
        const choicesData = q.answer_choices.map((choice: any, idx: number) => ({
          question_id: questionData.id,
          choice_text: choice.choice_text,
          points: choice.points !== undefined ? choice.points : 0,
          order_index: choice.order_index || idx + 1
        }));

        const { error: choicesError } = await supabaseAdmin
          .from('answer_choices')
          .insert(choicesData);

        if (choicesError) throw new Error(`DB Error inserting choices: ${choicesError.message}`);

        importedCount++;
      } catch (err: any) {
        console.error(`Error importing question ${i + 1}:`, err);
        errors.push(`Question ${i + 1} ("${q.question_text?.substring(0, 50)}..."): ${err.message}`);
      }
    }

    if (errors.length > 0 && importedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to import any questions', details: errors },
        { status: 500 }
      );
    }

    return NextResponse.json({
      imported: importedCount,
      total: questions.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
