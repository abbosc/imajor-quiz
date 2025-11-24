'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import jsPDF from 'jspdf';
import { supabase } from '@/lib/supabase';

interface ZeroPointQuestion {
  section: string;
  question: string;
}

export default function ResultsPage() {
  const params = useParams();
  const uniqueId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [score, setScore] = useState(0);
  const [interpretation, setInterpretation] = useState('');
  const [interpretationDescription, setInterpretationDescription] = useState('');
  const [zeroPointQuestions, setZeroPointQuestions] = useState<ZeroPointQuestion[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadResults();
  }, [uniqueId]);

  const loadResults = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch submission data
      const { data: submission, error: submissionError } = await supabase
        .from('quiz_submissions')
        .select('*')
        .eq('unique_id', uniqueId)
        .single();

      if (submissionError) {
        if (submissionError.code === 'PGRST116') {
          setError('Results not found. Please check your unique ID.');
        } else {
          throw submissionError;
        }
        setLoading(false);
        return;
      }

      if (!submission) {
        setError('Results not found. Please check your unique ID.');
        setLoading(false);
        return;
      }

      setName(submission.user_name);
      setEmail(submission.user_email);
      setScore(submission.total_score);

      // Fetch interpretation level
      const { data: interpretationLevels, error: interpretationError } = await supabase
        .from('interpretation_levels')
        .select('*')
        .lte('min_score', submission.total_score)
        .gte('max_score', submission.total_score)
        .order('order_index', { ascending: true })
        .limit(1)
        .single();

      if (!interpretationError && interpretationLevels) {
        setInterpretation(interpretationLevels.level_label);
        setInterpretationDescription(interpretationLevels.description || '');
      } else {
        // Fallback interpretation if none found in database
        if (submission.total_score >= 0 && submission.total_score < 50) {
          setInterpretation('Just Getting Started');
          setInterpretationDescription('There\'s plenty of room to explore!');
        } else if (submission.total_score >= 50 && submission.total_score < 100) {
          setInterpretation('Early Explorer');
          setInterpretationDescription('You\'re beginning your exploration journey!');
        } else if (submission.total_score >= 100 && submission.total_score < 150) {
          setInterpretation('Active Researcher');
          setInterpretationDescription('Great progress on your exploration journey!');
        } else if (submission.total_score >= 150 && submission.total_score < 200) {
          setInterpretation('Well-Informed Explorer');
          setInterpretationDescription('You\'ve done significant exploration!');
        } else {
          setInterpretation('Expert Navigator');
          setInterpretationDescription('Exceptional exploration depth!');
        }
      }

      // Fetch zero-point questions (questions where user scored 0)
      const { data: submissionAnswers, error: answersError } = await supabase
        .from('submission_answers')
        .select(`
          points_earned,
          questions (
            question_text,
            sections (
              title
            )
          )
        `)
        .eq('submission_id', submission.id)
        .eq('points_earned', 0);

      if (!answersError && submissionAnswers) {
        const zeroPoints: ZeroPointQuestion[] = submissionAnswers.map((answer: any) => ({
          section: answer.questions.sections.title,
          question: answer.questions.question_text
        }));
        setZeroPointQuestions(zeroPoints);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading results:', error);
      setError('Failed to load results. Please try again or contact support.');
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(255, 107, 74);
    doc.text('iMajor - Your Exploration To-Do List', 20, 20);

    // Subheader
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated for: ${name}`, 20, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 37);

    // Divider
    doc.setDrawColor(255, 107, 74);
    doc.setLineWidth(0.5);
    doc.line(20, 42, 190, 42);

    // Introduction
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    if (zeroPointQuestions.length > 0) {
      doc.text('Areas to explore to deepen your major exploration:', 20, 52);

      // Questions
      let yPosition = 65;
      zeroPointQuestions.forEach((item, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(10);
        doc.setTextColor(255, 107, 74);
        doc.text(item.section, 20, yPosition);

        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        const lines = doc.splitTextToSize(`${index + 1}. ${item.question}`, 170);
        doc.text(lines, 25, yPosition + 7);

        yPosition += 15 + (lines.length - 1) * 5;
      });
    } else {
      doc.text('Congratulations! You scored points on all questions.', 20, 52);
      doc.text('Keep up the great exploration work!', 20, 62);
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text('iMajor - Major Exploration Platform', 105, 285, { align: 'center' });
    }

    doc.save(`imajor-todo-${uniqueId}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B4A]"></div>
          <p className="mt-4 text-[#64748B]">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="card max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Error Loading Results</h2>
          <p className="text-[#64748B] mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block gradient-accent text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const maxScore = 285; // This should be calculated based on all possible points
  const percentage = Math.round((score / maxScore) * 100);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <nav className="bg-white border-b border-[#E2E8F0]">
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="text-2xl font-bold gradient-text">
            iMajor
          </Link>
        </div>
      </nav>

      {/* Results */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Congratulations Card */}
          <div className="card p-8 md:p-12 mb-8 text-center">
            <div className="inline-block px-4 py-2 bg-[#FF6B4A]/10 text-[#FF6B4A] rounded-full text-sm font-semibold mb-4">
              Quiz Completed
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
              Congratulations, {name}!
            </h1>

            <p className="text-xl text-[#64748B] mb-8">
              You've completed the Major Exploration Depth Assessment
            </p>

            {/* Score Display */}
            <div className="inline-flex items-center justify-center w-48 h-48 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#E85537] mb-6">
              <div className="w-44 h-44 rounded-full bg-white flex flex-col items-center justify-center">
                <div className="text-5xl font-bold gradient-text">{score}</div>
                <div className="text-sm text-[#64748B] mt-1">points</div>
              </div>
            </div>

            {/* Interpretation */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#0F172A] mb-2">
                {interpretation}
              </h2>
              <p className="text-[#64748B]">
                {interpretationDescription || `You scored ${percentage}% on your exploration journey!`}
              </p>
            </div>

            {/* Unique ID */}
            <div className="bg-[#F8FAFC] rounded-lg p-6 mb-6">
              <p className="text-sm text-[#64748B] mb-2">Your Unique Results ID</p>
              <div className="flex items-center justify-center gap-3">
                <code className="text-lg font-mono font-bold text-[#FF6B4A]">
                  {uniqueId}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#0F172A] hover:border-[#FF6B4A] transition-all duration-200"
                >
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
              <p className="text-xs text-[#64748B] mt-2">
                Save this ID to access your results anytime
              </p>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Download To-Do List */}
            <div className="card p-6">
              <div className="w-12 h-12 gradient-accent rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                Download Your To-Do List
              </h3>
              <p className="text-[#64748B] mb-4">
                Get a PDF with personalized action items based on areas you haven't explored yet
              </p>
              <button
                onClick={downloadPDF}
                className="w-full gradient-accent text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Download PDF
              </button>
            </div>

            {/* Join Telegram */}
            <div className="card p-6">
              <div className="w-12 h-12 gradient-accent rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                Join Our Community
              </h3>
              <p className="text-[#64748B] mb-4">
                Connect with other students, get expert advice, and stay updated on major exploration resources
              </p>
              <a
                href="https://t.me/your_channel"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white border-2 border-[#E2E8F0] text-[#0F172A] px-6 py-3 rounded-lg font-semibold hover:border-[#FF6B4A] text-center transition-all duration-300"
              >
                Join Telegram
              </a>
            </div>
          </div>

          {/* Next Steps */}
          {zeroPointQuestions.length > 0 && (
            <div className="card p-8">
              <h3 className="text-2xl font-bold text-[#0F172A] mb-4">
                Your Next Steps
              </h3>
              <p className="text-[#64748B] mb-6">
                Based on your responses, here are areas you should explore:
              </p>
              <div className="space-y-4">
                {zeroPointQuestions.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF6B4A]/10 flex items-center justify-center">
                      <span className="text-[#FF6B4A] font-semibold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm text-[#FF6B4A] font-semibold">{item.section}</p>
                      <p className="text-[#0F172A]">{item.question}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-block text-[#64748B] hover:text-[#FF6B4A] transition-colors duration-200"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
