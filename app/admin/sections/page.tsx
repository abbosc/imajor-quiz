'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';

interface Section {
  id: string;
  title: string;
  order_index: number;
}

export default function SectionsPage() {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [formData, setFormData] = useState({ title: '', order_index: 1 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSections();
  }, []);

  const getAuthToken = () => {
    return localStorage.getItem('admin_token') || '';
  };

  const loadSections = async () => {
    try {
      const response = await fetch('/api/admin/sections', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (!response.ok) throw new Error('Failed to load sections');

      const result = await response.json();
      setSections(result.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading sections:', error);
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingSection(null);
    setFormData({ title: '', order_index: sections.length + 1 });
    setShowModal(true);
  };

  const handleEdit = (section: Section) => {
    setEditingSection(section);
    setFormData({ title: section.title, order_index: section.order_index });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section? All questions in this section will also be deleted.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/sections?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete section');

      loadSections();
    } catch (error) {
      console.error('Error deleting section:', error);
      alert('Failed to delete section');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingSection) {
        // Update
        const response = await fetch('/api/admin/sections', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify({
            id: editingSection.id,
            title: formData.title,
            order_index: formData.order_index
          })
        });

        if (!response.ok) throw new Error('Failed to update section');
      } else {
        // Insert
        const response = await fetch('/api/admin/sections', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify({
            title: formData.title,
            order_index: formData.order_index
          })
        });

        if (!response.ok) throw new Error('Failed to create section');
      }

      setShowModal(false);
      loadSections();
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Failed to save section');
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
        <h2 className="text-3xl font-bold text-[#0F172A]">Sections</h2>
        <button
          onClick={handleAdd}
          className="gradient-accent text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
        >
          Add Section
        </button>
      </div>

      {sections.length > 0 ? (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F8FAFC]">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#64748B]">Order</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#64748B]">Title</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-[#64748B]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <tr key={section.id} className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC]">
                  <td className="py-4 px-6 text-[#0F172A] font-medium">{section.order_index}</td>
                  <td className="py-4 px-6 text-[#0F172A]">{section.title}</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleEdit(section)}
                      className="text-[#FF6B4A] hover:text-[#E85537] font-medium mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(section.id)}
                      className="text-red-500 hover:text-red-600 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-[#64748B] mb-4">No sections yet</p>
          <button
            onClick={handleAdd}
            className="gradient-accent text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Add Your First Section
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-[#0F172A] mb-6">
              {editingSection ? 'Edit Section' : 'Add New Section'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] focus:border-transparent text-[#0F172A]"
                  placeholder="e.g., SECTION 1: BREADTH OF EXPLORATION"
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
                  {saving ? 'Saving...' : editingSection ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
