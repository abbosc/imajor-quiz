'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Test {
  id: string;
  test_name: string;
  status: 'planned' | 'preparing' | 'scheduled' | 'completed';
  test_date: string | null;
  target_score: string | null;
  result_score: string | null;
  certificate_url: string | null;
  notes: string | null;
}

const statusColors: Record<string, string> = {
  planned: 'bg-gray-100 text-gray-700',
  preparing: 'bg-blue-100 text-blue-700',
  scheduled: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
};

const commonTests = ['SAT', 'ACT', 'TOEFL', 'IELTS', 'AP Exam', 'SAT Subject Test', 'GRE', 'GMAT'];

export default function TestsPage() {
  const { user } = useAuth();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [formData, setFormData] = useState({
    test_name: '',
    status: 'planned' as Test['status'],
    test_date: '',
    target_score: '',
    result_score: '',
    notes: '',
  });

  useEffect(() => {
    if (user) loadTests();
  }, [user]);

  const loadTests = async () => {
    try {
      const response = await fetch('/api/user/tests');
      const result = await response.json();
      if (result.data) setTests(result.data);
    } catch (error) {
      console.error('Error loading tests:', error);
      toast.error('Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = {
        ...formData,
        test_date: formData.test_date || null,
        target_score: formData.target_score || null,
        result_score: formData.result_score || null,
        notes: formData.notes || null,
        ...(editingTest && { id: editingTest.id }),
      };

      const response = await fetch('/api/user/tests', {
        method: editingTest ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        loadTests();
        resetForm();
        toast.success(editingTest ? 'Test updated' : 'Test added');
      } else {
        const result = await response.json();
        toast.error(result.error || 'Failed to save test');
      }
    } catch (error) {
      console.error('Error saving test:', error);
      toast.error('Failed to save test');
    }
  };

  const handleEdit = (test: Test) => {
    setEditingTest(test);
    setFormData({
      test_name: test.test_name,
      status: test.status,
      test_date: test.test_date || '',
      target_score: test.target_score || '',
      result_score: test.result_score || '',
      notes: test.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this test?')) return;
    try {
      const response = await fetch(`/api/user/tests?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        loadTests();
        toast.success('Test deleted');
      }
    } catch (error) {
      console.error('Error deleting test:', error);
      toast.error('Failed to delete test');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingTest(null);
    setFormData({
      test_name: '',
      status: 'planned',
      test_date: '',
      target_score: '',
      result_score: '',
      notes: '',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B4A]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Tests</h1>
          <p className="text-[#64748B]">Track your standardized tests and scores.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-xl font-medium text-white gradient-accent hover:shadow-lg transition-all"
        >
          + Add Test
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-[#0F172A] mb-4">
              {editingTest ? 'Edit Test' : 'Add Test'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Test Name *</label>
                <input
                  type="text"
                  value={formData.test_name}
                  onChange={(e) => setFormData({ ...formData, test_name: e.target.value })}
                  required
                  list="test-names"
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                  placeholder="e.g., SAT"
                />
                <datalist id="test-names">
                  {commonTests.map((test) => (
                    <option key={test} value={test} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Test['status'] })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                  >
                    <option value="planned">Planned</option>
                    <option value="preparing">Preparing</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Test Date</label>
                  <input
                    type="date"
                    value={formData.test_date}
                    onChange={(e) => setFormData({ ...formData, test_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Target Score</label>
                  <input
                    type="text"
                    value={formData.target_score}
                    onChange={(e) => setFormData({ ...formData, target_score: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                    placeholder="e.g., 1500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Result Score</label>
                  <input
                    type="text"
                    value={formData.result_score}
                    onChange={(e) => setFormData({ ...formData, result_score: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none"
                    placeholder="e.g., 1520"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none resize-none"
                  placeholder="Study plan, resources, etc."
                />
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
                  {editingTest ? 'Save Changes' : 'Add Test'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tests List */}
      {tests.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-[#E2E8F0] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">No tests yet</h3>
          <p className="text-[#64748B] mb-4">Track your standardized test scores here.</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 rounded-xl font-medium text-white gradient-accent hover:shadow-lg transition-all"
          >
            Add Your First Test
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tests.map((test) => (
            <div key={test.id} className="card p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-[#0F172A]">{test.test_name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${statusColors[test.status]}`}>
                      {test.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-[#64748B]">
                    {test.test_date && <span>Date: {new Date(test.test_date).toLocaleDateString()}</span>}
                    {test.target_score && <span>Target: {test.target_score}</span>}
                    {test.result_score && <span className="font-medium text-green-600">Score: {test.result_score}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(test)} className="p-2 rounded-lg text-[#64748B] hover:bg-[#F8FAFC] transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(test.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
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
    </div>
  );
}
