'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';

interface Section {
  id: string;
  title: string;
}

interface AnswerChoice {
  choice_text: string;
  points: number;
  order_index: number;
}

export default function NewQuestionPage() {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [formData, setFormData] = useState({
    section_id: '',
    question_text: '',
    order_index: 1,
    is_active: true
  });
  const [answerChoices, setAnswerChoices] = useState<AnswerChoice[]>([
    { choice_text: '', points: 0, order_index: 1 }
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const { data, error } = await supabase
        .from('sections')
        .select('id, title')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSections(data || []);
      if (data && data.length > 0) {
        setFormData(prev => ({ ...prev, section_id: data[0].id }));
      }
    } catch (error) {
      console.error('Error loading sections:', error);
    }
  };

  const addAnswerChoice = () => {
    setAnswerChoices([
      ...answerChoices,
      { choice_text: '', points: 0, order_index: answerChoices.length + 1 }
    ]);
  };

  const removeAnswerChoice = (index: number) => {
    const updated = answerChoices.filter((_, i) => i !== index);
    setAnswerChoices(updated.map((choice, i) => ({ ...choice, order_index: i + 1 })));
  };

  const updateAnswerChoice = (index: number, field: keyof AnswerChoice, value: string | number) => {
    const updated = [...answerChoices];
    updated[index] = { ...updated[index], [field]: value };
    setAnswerChoices(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (answerChoices.length < 2) {
      alert('Please add at least 2 answer choices');
      return;
    }

    if (answerChoices.some(c => !c.choice_text.trim())) {
      alert('Please fill in all answer choice texts');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('admin_token') || '';

      const response = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          section_id: formData.section_id,
          question_text: formData.question_text,
          order_index: formData.order_index,
          is_active: formData.is_active,
          answer_choices: answerChoices
        })
      });

      if (!response.ok) throw new Error('Failed to save question');

      router.push('/admin/questions');
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Failed to save question');
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-2">Add New Question</h2>
          <p className="text-[#64748B]">Create a new quiz question with answer choices</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          {/* Section */}
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">
              Section
            </label>
            <select
              value={formData.section_id}
              onChange={(e) => setFormData({ ...formData, section_id: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent text-[#0F172A]"
            >
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.title}
                </option>
              ))}
            </select>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">
              Question Text
            </label>
            <textarea
              value={formData.question_text}
              onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent text-[#0F172A]"
              placeholder="Enter your question here..."
            />
          </div>

          {/* Order Index */}
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-2">
              Order Index
            </label>
            <input
              type="number"
              value={formData.order_index}
              onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
              required
              min="1"
              className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent text-[#0F172A]"
            />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 text-[#FF6B4A] border-[#E2E8F0] rounded focus:ring-[#FF6B4A]"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-[#0F172A]">
              Active (visible in quiz)
            </label>
          </div>

          {/* Answer Choices */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-[#0F172A]">
                Answer Choices
              </label>
              <button
                type="button"
                onClick={addAnswerChoice}
                className="text-[#FF6B4A] hover:text-[#E85537] font-medium text-sm"
              >
                + Add Choice
              </button>
            </div>

            <div className="space-y-3">
              {answerChoices.map((choice, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={choice.choice_text}
                      onChange={(e) => updateAnswerChoice(index, 'choice_text', e.target.value)}
                      placeholder="Answer choice text"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent text-[#0F172A]"
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      value={choice.points}
                      onChange={(e) => updateAnswerChoice(index, 'points', parseInt(e.target.value))}
                      placeholder="Points"
                      required
                      min="0"
                      className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent text-[#0F172A]"
                    />
                  </div>
                  {answerChoices.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAnswerChoice(index)}
                      className="px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.push('/admin/questions')}
              className="flex-1 px-6 py-3 rounded-lg border-2 border-[#E2E8F0] text-[#0F172A] font-semibold hover:border-[#FF6B4A] transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 gradient-accent text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Create Question'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
