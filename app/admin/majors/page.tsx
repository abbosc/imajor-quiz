'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

interface Major {
  id: string;
  name: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token');
  }
  return null;
}

export default function AdminMajorsPage() {
  const router = useRouter();
  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMajor, setEditingMajor] = useState<Major | null>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    order_index: 0,
    is_active: true
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
      return;
    }
    loadMajors();
  }, []);

  const loadMajors = async () => {
    try {
      const response = await fetch('/api/admin/majors', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      const result = await response.json();
      if (result.data) {
        setMajors(result.data);
      }
    } catch (error) {
      console.error('Error loading majors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = '/api/admin/majors';
      const method = editingMajor ? 'PUT' : 'POST';
      const body = editingMajor
        ? { ...formData, id: editingMajor.id }
        : { ...formData, order_index: majors.length + 1 };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        loadMajors();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving major:', error);
    }
  };

  const handleEdit = (major: Major) => {
    setEditingMajor(major);
    setFormData({
      name: major.name,
      order_index: major.order_index,
      is_active: major.is_active
    });
    setShowForm(true);
  };

  const handleBulkImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);
      const text = await file.text();
      const jsonMajors = JSON.parse(text);

      if (!Array.isArray(jsonMajors)) {
        alert('JSON must be an array of majors');
        return;
      }

      let successCount = 0;
      const startIndex = majors.length;

      for (let i = 0; i < jsonMajors.length; i++) {
        const major = jsonMajors[i];
        const name = typeof major === 'string' ? major : major.name;
        if (!name) continue;

        const response = await fetch('/api/admin/majors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify({
            name,
            order_index: startIndex + i + 1,
            is_active: major.is_active !== false
          })
        });

        if (response.ok) successCount++;
      }

      alert(`Imported ${successCount} of ${jsonMajors.length} majors`);
      loadMajors();
    } catch (error) {
      console.error('Error importing majors:', error);
      alert('Failed to import majors. Make sure the file is valid JSON.');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this major?')) return;

    try {
      const response = await fetch(`/api/admin/majors?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (response.ok) {
        loadMajors();
      }
    } catch (error) {
      console.error('Error deleting major:', error);
    }
  };

  const toggleActive = async (major: Major) => {
    try {
      await fetch('/api/admin/majors', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          id: major.id,
          name: major.name,
          order_index: major.order_index,
          is_active: !major.is_active
        })
      });
      loadMajors();
    } catch (error) {
      console.error('Error toggling major:', error);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingMajor(null);
    setFormData({
      name: '',
      order_index: 0,
      is_active: true
    });
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">Majors</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleBulkImport}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="px-4 py-2 rounded-xl font-medium border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-all disabled:opacity-50 text-sm sm:text-base"
          >
            {importing ? 'Importing...' : 'Import JSON'}
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-xl font-medium text-white gradient-accent hover:shadow-lg transition-all text-sm sm:text-base"
          >
            + Add Major
          </button>
        </div>
      </div>

      {/* Import Format Hint */}
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
        <p className="text-xs sm:text-sm text-[#64748B]">
          <strong>JSON Format:</strong> Array of strings or objects. Examples: <code className="bg-white px-1 py-0.5 rounded text-xs">[&quot;Computer Science&quot;, &quot;Engineering&quot;]</code> or <code className="bg-white px-1 py-0.5 rounded text-xs">[{`{"name": "Computer Science", "is_active": true}`}]</code>
        </p>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-bold text-[#0F172A] mb-4">
              {editingMajor ? 'Edit Major' : 'Add New Major'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                  Major Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                  placeholder="e.g., Computer Science"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-[#E2E8F0] text-[#FF6B4A] focus:ring-[#FF6B4A]"
                />
                <label htmlFor="is_active" className="text-sm text-[#64748B]">
                  Active (visible to users)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 rounded-xl font-medium border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl font-medium text-white gradient-accent hover:shadow-lg transition-all"
                >
                  {editingMajor ? 'Save Changes' : 'Add Major'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Majors List */}
      {majors.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-[#E2E8F0] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">No majors yet</h3>
          <p className="text-[#64748B] mb-4">Add majors for users to select their interests.</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 rounded-xl font-medium text-white gradient-accent hover:shadow-lg transition-all"
          >
            Add First Major
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {majors.map((major, index) => (
            <div
              key={major.id}
              className={`card p-4 ${!major.is_active ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FF6B4A]/10 text-[#FF6B4A] font-medium text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0F172A]">{major.name}</h3>
                    {!major.is_active && (
                      <span className="text-xs text-amber-600">Inactive</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleActive(major)}
                    className={`p-2 rounded-lg transition-colors ${
                      major.is_active
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-[#64748B] hover:bg-[#F8FAFC]'
                    }`}
                    title={major.is_active ? 'Deactivate' : 'Activate'}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleEdit(major)}
                    className="p-2 rounded-lg text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(major.id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
