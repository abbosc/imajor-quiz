'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';

interface InterpretationLevel {
  id: string;
  min_score: number;
  max_score: number;
  level_label: string;
  description: string | null;
  order_index: number;
}

export default function InterpretationsPage() {
  const [levels, setLevels] = useState<InterpretationLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLevel, setEditingLevel] = useState<InterpretationLevel | null>(null);
  const [formData, setFormData] = useState({
    min_score: 0,
    max_score: 50,
    level_label: '',
    description: '',
    order_index: 1
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadLevels();
  }, []);

  const getAuthToken = () => {
    return localStorage.getItem('admin_token') || '';
  };

  const loadLevels = async () => {
    try {
      const response = await fetch('/api/admin/interpretations', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (!response.ok) throw new Error('Failed to load interpretation levels');

      const result = await response.json();
      setLevels(result.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading interpretation levels:', error);
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingLevel(null);
    const lastLevel = levels[levels.length - 1];
    setFormData({
      min_score: lastLevel ? lastLevel.max_score + 1 : 0,
      max_score: lastLevel ? lastLevel.max_score + 50 : 50,
      level_label: '',
      description: '',
      order_index: levels.length + 1
    });
    setShowModal(true);
  };

  const handleEdit = (level: InterpretationLevel) => {
    setEditingLevel(level);
    setFormData({
      min_score: level.min_score,
      max_score: level.max_score,
      level_label: level.level_label,
      description: level.description || '',
      order_index: level.order_index
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this interpretation level?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/interpretations?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete interpretation level');

      loadLevels();
    } catch (error) {
      console.error('Error deleting interpretation level:', error);
      alert('Failed to delete interpretation level');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.min_score >= formData.max_score) {
      alert('Min score must be less than max score');
      return;
    }

    setSaving(true);

    try {
      if (editingLevel) {
        // Update
        const response = await fetch('/api/admin/interpretations', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify({
            id: editingLevel.id,
            min_score: formData.min_score,
            max_score: formData.max_score,
            level_label: formData.level_label,
            description: formData.description,
            order_index: formData.order_index
          })
        });

        if (!response.ok) throw new Error('Failed to update interpretation level');
      } else {
        // Insert
        const response = await fetch('/api/admin/interpretations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify({
            min_score: formData.min_score,
            max_score: formData.max_score,
            level_label: formData.level_label,
            description: formData.description,
            order_index: formData.order_index
          })
        });

        if (!response.ok) throw new Error('Failed to create interpretation level');
      }

      setShowModal(false);
      loadLevels();
    } catch (error) {
      console.error('Error saving interpretation level:', error);
      alert('Failed to save interpretation level');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B4A]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#0F172A]">Interpretation Levels</h2>
          <p className="text-[#64748B] mt-2">Define score ranges and their interpretations</p>
        </div>
        <button
          onClick={handleAdd}
          className="gradient-accent text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
        >
          Add Level
        </button>
      </div>

      {levels.length > 0 ? (
        <div className="space-y-4">
          {levels.map((level) => (
            <div key={level.id} className="card p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-block px-3 py-1 bg-[#FF6B4A]/10 text-[#FF6B4A] rounded-full text-sm font-semibold">
                      {level.min_score} - {level.max_score} points
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                    {level.level_label}
                  </h3>
                  {level.description && (
                    <p className="text-[#64748B]">{level.description}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(level)}
                    className="px-4 py-2 rounded-lg bg-[#FF6B4A] text-white font-medium hover:bg-[#E85537] transition-all duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(level.id)}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-[#64748B] mb-4">No interpretation levels yet</p>
          <button
            onClick={handleAdd}
            className="gradient-accent text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Add Your First Level
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-lg w-full p-6">
            <h3 className="text-2xl font-bold text-[#0F172A] mb-6">
              {editingLevel ? 'Edit Interpretation Level' : 'Add New Interpretation Level'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">
                    Min Score
                  </label>
                  <input
                    type="number"
                    value={formData.min_score}
                    onChange={(e) => setFormData({ ...formData, min_score: parseInt(e.target.value) })}
                    required
                    min="0"
                    className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">
                    Max Score
                  </label>
                  <input
                    type="number"
                    value={formData.max_score}
                    onChange={(e) => setFormData({ ...formData, max_score: parseInt(e.target.value) })}
                    required
                    min="0"
                    className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent text-[#0F172A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Level Label
                </label>
                <input
                  type="text"
                  value={formData.level_label}
                  onChange={(e) => setFormData({ ...formData, level_label: e.target.value })}
                  required
                  placeholder="e.g., Expert Navigator"
                  className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent text-[#0F172A]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="e.g., Exceptional exploration depth!"
                  className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent text-[#0F172A]"
                />
              </div>

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

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 rounded-lg border-2 border-[#E2E8F0] text-[#0F172A] font-semibold hover:border-[#FF6B4A] transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 gradient-accent text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingLevel ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
