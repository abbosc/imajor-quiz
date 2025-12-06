'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

interface ResourceMajor {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  order_index: number;
  is_active: boolean;
  resource_count: number;
}

export default function TenResourcesAdminPage() {
  const [majors, setMajors] = useState<ResourceMajor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMajor, setEditingMajor] = useState<ResourceMajor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    order_index: 0,
    is_active: true
  });

  useEffect(() => {
    loadMajors();
  }, []);

  const loadMajors = async () => {
    try {
      const res = await fetch('/api/admin/10resources/majors');
      const { data } = await res.json();
      setMajors(data || []);
    } catch (error) {
      console.error('Failed to load majors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editingMajor ? 'PUT' : 'POST';
    const body = editingMajor
      ? { id: editingMajor.id, ...formData }
      : formData;

    try {
      const res = await fetch('/api/admin/10resources/majors', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        loadMajors();
        closeModal();
      }
    } catch (error) {
      console.error('Failed to save major:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this major and all its resources?')) return;

    try {
      const res = await fetch(`/api/admin/10resources/majors?id=${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        loadMajors();
      }
    } catch (error) {
      console.error('Failed to delete major:', error);
    }
  };

  const openEditModal = (major: ResourceMajor) => {
    setEditingMajor(major);
    setFormData({
      name: major.name,
      description: major.description || '',
      icon: major.icon || '',
      order_index: major.order_index,
      is_active: major.is_active
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMajor(null);
    setFormData({
      name: '',
      description: '',
      icon: '',
      order_index: 0,
      is_active: true
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">10 Resources</h1>
            <p className="text-[#64748B] mt-1">
              Manage majors and their curated resources across 13 categories
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#FF6B4A] text-white rounded-lg hover:bg-[#E85537] transition-colors"
          >
            Add Major
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-[#E2E8F0]">
            <p className="text-sm text-[#64748B]">Total Majors</p>
            <p className="text-2xl font-bold text-[#0F172A]">{majors.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#E2E8F0]">
            <p className="text-sm text-[#64748B]">Active Majors</p>
            <p className="text-2xl font-bold text-[#0F172A]">
              {majors.filter(m => m.is_active).length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#E2E8F0]">
            <p className="text-sm text-[#64748B]">Total Resources</p>
            <p className="text-2xl font-bold text-[#0F172A]">
              {majors.reduce((acc, m) => acc + m.resource_count, 0)}
            </p>
          </div>
        </div>

        {/* Majors List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B4A]"></div>
          </div>
        ) : majors.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-[#E2E8F0] text-center">
            <p className="text-[#64748B]">No majors yet. Add your first major to get started.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#64748B]">Order</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#64748B]">Major</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#64748B]">Resources</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#64748B]">Progress</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-[#64748B]">Status</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold text-[#64748B]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {majors.map((major) => (
                  <tr key={major.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-4 py-3 text-sm text-[#64748B]">{major.order_index}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-[#0F172A]">{major.name}</p>
                        {major.description && (
                          <p className="text-sm text-[#64748B] line-clamp-1">{major.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-[#0F172A]">
                        {major.resource_count} / 130
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-24 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#FF6B4A] rounded-full transition-all"
                          style={{ width: `${Math.min((major.resource_count / 130) * 100, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          major.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {major.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/10resources/${major.slug}`}
                          className="px-3 py-1 text-sm text-[#FF6B4A] hover:bg-[#FF6B4A]/10 rounded-lg transition-colors"
                        >
                          Edit Resources
                        </Link>
                        <button
                          onClick={() => openEditModal(major)}
                          className="px-3 py-1 text-sm text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(major.id)}
                          className="px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
              <h2 className="text-xl font-bold text-[#0F172A] mb-4">
                {editingMajor ? 'Edit Major' : 'Add Major'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1">
                    Major Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] outline-none"
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] outline-none resize-none"
                    placeholder="Brief description of the major"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-1">
                      Icon (emoji)
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] outline-none"
                      placeholder="e.g., 💻"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-1">
                      Order Index
                    </label>
                    <input
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-[#FF6B4A] border-[#E2E8F0] rounded focus:ring-[#FF6B4A]"
                  />
                  <label htmlFor="is_active" className="text-sm text-[#64748B]">
                    Active (visible to users)
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#FF6B4A] text-white rounded-lg hover:bg-[#E85537] transition-colors"
                  >
                    {editingMajor ? 'Save Changes' : 'Add Major'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
