'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  order_index: number;
}

interface Resource {
  id: string;
  major_id: string;
  category_id: string;
  name: string;
  description: string | null;
  url: string | null;
  order_index: number;
  category?: Category;
}

interface Major {
  id: string;
  name: string;
  slug: string;
}

export default function MajorResourcesPage() {
  const params = useParams();
  const majorSlug = params.major as string;

  const [major, setMajor] = useState<Major | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    order_index: 0
  });

  // Bulk add modal state
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [bulkImporting, setBulkImporting] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkAllCategories, setBulkAllCategories] = useState(false);

  useEffect(() => {
    loadData();
  }, [majorSlug]);

  const loadData = async () => {
    try {
      // Load majors to find current major
      const majorsRes = await fetch('/api/admin/10resources/majors');
      const { data: majors } = await majorsRes.json();
      const currentMajor = majors?.find((m: Major) => m.slug === majorSlug);

      if (!currentMajor) {
        setLoading(false);
        return;
      }

      setMajor(currentMajor);

      // Load categories
      const categoriesRes = await fetch('/api/admin/10resources/categories');
      const { data: cats } = await categoriesRes.json();
      setCategories(cats || []);

      if (cats?.length > 0) {
        setActiveCategory(cats[0].id);
      }

      // Load resources for this major
      const resourcesRes = await fetch(`/api/admin/10resources/resources?major_id=${currentMajor.id}`);
      const { data: res } = await resourcesRes.json();
      setResources(res || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResourcesForCategory = (categoryId: string) => {
    return resources
      .filter(r => r.category_id === categoryId)
      .sort((a, b) => a.order_index - b.order_index);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!major || !activeCategory) return;

    const method = editingResource ? 'PUT' : 'POST';
    const body = editingResource
      ? { id: editingResource.id, ...formData }
      : { major_id: major.id, category_id: activeCategory, ...formData };

    try {
      const res = await fetch('/api/admin/10resources/resources', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        loadData();
        closeModal();
      }
    } catch (error) {
      console.error('Failed to save resource:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this resource?')) return;

    try {
      const res = await fetch(`/api/admin/10resources/resources?id=${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setResources(resources.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete resource:', error);
    }
  };

  const openAddModal = () => {
    const categoryResources = getResourcesForCategory(activeCategory!);
    setEditingResource(null);
    setFormData({
      name: '',
      description: '',
      url: '',
      order_index: categoryResources.length + 1
    });
    setShowModal(true);
  };

  const openEditModal = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      name: resource.name,
      description: resource.description || '',
      url: resource.url || '',
      order_index: resource.order_index
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingResource(null);
    setFormData({ name: '', description: '', url: '', order_index: 0 });
  };

  // Bulk add handlers
  const openBulkModal = (allCategories: boolean = false) => {
    setBulkText('');
    setBulkError(null);
    setBulkAllCategories(allCategories);
    setShowBulkModal(true);
  };

  const closeBulkModal = () => {
    setShowBulkModal(false);
    setBulkText('');
    setBulkError(null);
    setBulkAllCategories(false);
  };

  const handleBulkImport = async () => {
    if (!major || !bulkText.trim()) return;
    if (!bulkAllCategories && !activeCategory) return;

    setBulkImporting(true);
    setBulkError(null);

    try {
      // Parse the text - support both JSON and simple line format
      let resources: any[] = [];

      const trimmed = bulkText.trim();
      if (trimmed.startsWith('[')) {
        // JSON format
        resources = JSON.parse(trimmed);
      } else if (bulkAllCategories) {
        // All categories format: "category_slug | Name | Description | URL"
        const lines = trimmed.split('\n').filter(line => line.trim());
        const categoryOrder: Record<string, number> = {};

        resources = lines.map((line) => {
          const parts = line.split('|').map(p => p.trim());
          const categorySlug = parts[0] || '';

          // Track order per category
          if (!categoryOrder[categorySlug]) categoryOrder[categorySlug] = 0;
          categoryOrder[categorySlug]++;

          return {
            category_slug: categorySlug,
            name: parts[1] || '',
            description: parts[2] || '',
            url: parts[3] || '',
            order_index: categoryOrder[categorySlug]
          };
        });
      } else {
        // Single category format: "Name | Description | URL"
        const lines = trimmed.split('\n').filter(line => line.trim());
        resources = lines.map((line, index) => {
          const parts = line.split('|').map(p => p.trim());
          return {
            name: parts[0] || '',
            description: parts[1] || '',
            url: parts[2] || '',
            order_index: index + 1
          };
        });
      }

      const res = await fetch('/api/admin/10resources/bulk-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          major_id: major.id,
          category_id: bulkAllCategories ? null : activeCategory,
          resources
        })
      });

      const result = await res.json();

      if (result.errors && result.errors.length > 0) {
        setBulkError(`Imported ${result.imported} of ${result.total}. Errors:\n${result.errors.join('\n')}`);
      } else {
        closeBulkModal();
      }

      loadData();
    } catch (err: any) {
      setBulkError(`Parse error: ${err.message}`);
    } finally {
      setBulkImporting(false);
    }
  };

  const getCategoryIcon = (slug: string, className: string = "w-5 h-5") => {
    const icons: Record<string, React.ReactNode> = {
      books: (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
      ),
      figures: (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
      ),
      youtube: (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
        </svg>
      ),
      blogs: (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
        </svg>
      ),
      podcasts: (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
        </svg>
      ),
      websites: (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      ),
      universities: (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
        </svg>
      ),
      skills: (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
        </svg>
      ),
      concepts: (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
      ),
      companies: (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
      ),
      mistakes: (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      ),
      trends: (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
        </svg>
      ),
      questions: (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
        </svg>
      )
    };
    return icons[slug] || (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
      </svg>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B4A]"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!major) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-[#64748B]">Major not found</p>
          <Link href="/admin/10resources" className="text-[#FF6B4A] hover:underline mt-2 inline-block">
            Back to Majors
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const activeCtg = categories.find(c => c.id === activeCategory);
  const categoryResources = activeCategory ? getResourcesForCategory(activeCategory) : [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-[#64748B] mb-1">
              <Link href="/admin/10resources" className="hover:text-[#FF6B4A]">
                10resources
              </Link>
              <span>/</span>
              <span>{major.name}</span>
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A]">{major.name} Resources</h1>
            <p className="text-[#64748B] mt-1">
              {resources.length} / 130 resources added
            </p>
          </div>
          <button
            onClick={() => openBulkModal(true)}
            className="px-4 py-2 bg-[#0F172A] text-white text-sm rounded-lg hover:bg-[#1E293B] transition-colors"
          >
            Bulk Add All Categories
          </button>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#0F172A]">Overall Progress</span>
            <span className="text-sm text-[#64748B]">{Math.round((resources.length / 130) * 100)}%</span>
          </div>
          <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF6B4A] rounded-full transition-all"
              style={{ width: `${Math.min((resources.length / 130) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
              <div className="p-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <h3 className="font-semibold text-[#0F172A] text-sm">Categories</h3>
              </div>
              <div className="divide-y divide-[#E2E8F0]">
                {categories.map((category) => {
                  const count = getResourcesForCategory(category.id).length;
                  const isComplete = count >= 10;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full px-3 py-2.5 text-left flex items-center justify-between hover:bg-[#F8FAFC] transition-colors ${
                        activeCategory === category.id ? 'bg-[#FF6B4A]/10 border-l-2 border-[#FF6B4A]' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={activeCategory === category.id ? 'text-[#FF6B4A]' : 'text-[#64748B]'}>
                          {getCategoryIcon(category.slug, "w-4 h-4")}
                        </span>
                        <span className={`text-sm ${activeCategory === category.id ? 'text-[#FF6B4A] font-medium' : 'text-[#0F172A]'}`}>
                          {category.name.replace('Ten ', '')}
                        </span>
                      </div>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        isComplete ? 'bg-green-100 text-green-700' : 'bg-[#F8FAFC] text-[#64748B]'
                      }`}>
                        {count}/10
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Resources List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-[#E2E8F0]">
              <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[#FF6B4A]">
                    {getCategoryIcon(activeCtg?.slug || '', "w-5 h-5")}
                  </span>
                  <h3 className="font-semibold text-[#0F172A]">
                    {activeCtg?.name}
                  </h3>
                  <p className="text-sm text-[#64748B]">
                    {categoryResources.length} / 10 resources
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openBulkModal(false)}
                    className="px-4 py-2 border border-[#FF6B4A] text-[#FF6B4A] text-sm rounded-lg hover:bg-[#FF6B4A]/10 transition-colors"
                  >
                    Bulk Add
                  </button>
                  {categoryResources.length < 10 && (
                    <button
                      onClick={openAddModal}
                      className="px-4 py-2 bg-[#FF6B4A] text-white text-sm rounded-lg hover:bg-[#E85537] transition-colors"
                    >
                      Add Resource
                    </button>
                  )}
                </div>
              </div>

              {categoryResources.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-[#64748B]">No resources added yet</p>
                  <button
                    onClick={openAddModal}
                    className="mt-3 text-[#FF6B4A] hover:underline text-sm"
                  >
                    Add the first resource
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[#E2E8F0]">
                  {categoryResources.map((resource, index) => (
                    <div key={resource.id} className="p-4 hover:bg-[#F8FAFC] transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-[#64748B] font-mono">{index + 1}.</span>
                            <h4 className="font-medium text-[#0F172A]">{resource.name}</h4>
                          </div>
                          {resource.description && (
                            <p className="text-sm text-[#64748B] mt-1 line-clamp-2 ml-6">
                              {resource.description}
                            </p>
                          )}
                          {resource.url && (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-[#FF6B4A] hover:underline mt-1 inline-block ml-6"
                            >
                              {new URL(resource.url).hostname}
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(resource)}
                            className="p-1.5 text-[#64748B] hover:text-[#FF6B4A] hover:bg-[#FF6B4A]/10 rounded transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(resource.id)}
                            className="p-1.5 text-[#64748B] hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-lg p-6">
              <h2 className="text-xl font-bold text-[#0F172A] mb-4">
                {editingResource ? 'Edit Resource' : 'Add Resource'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] outline-none"
                    placeholder="e.g., Clean Code by Robert C. Martin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] outline-none resize-none"
                    placeholder="Brief description of this resource and why it's valuable"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1">
                    URL (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] outline-none"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                    min="1"
                    max="10"
                    className="w-24 px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] outline-none"
                  />
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
                    {editingResource ? 'Save Changes' : 'Add Resource'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bulk Add Modal */}
        {showBulkModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-[#0F172A] mb-2">
                {bulkAllCategories ? 'Bulk Add All Categories' : 'Bulk Add Resources'}
              </h2>
              <p className="text-sm text-[#64748B] mb-4">
                {bulkAllCategories
                  ? 'Add resources to all 13 categories at once'
                  : `Add multiple resources to "${activeCtg?.name}" at once`
                }
              </p>

              <div className="space-y-4">
                {/* Format instructions */}
                <div className="bg-[#F8FAFC] rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-[#0F172A] mb-2">Supported Formats</h3>
                  <div className="text-xs text-[#64748B] space-y-3">
                    {bulkAllCategories ? (
                      <>
                        <div>
                          <p className="font-medium text-[#0F172A] mb-1">Simple format (category_slug | name | description | url):</p>
                          <pre className="bg-white p-2 rounded text-[11px] overflow-x-auto whitespace-pre-wrap">
{`books | Clean Code | A handbook of agile software craftsmanship | https://amazon.com/clean-code
books | The Pragmatic Programmer | Tips for better coding
figures | Alan Turing | Father of computer science
youtube | Fireship | Quick tech tutorials | https://youtube.com/@fireship
skills | Problem Solving | Critical thinking and debugging`}
                          </pre>
                        </div>
                        <div>
                          <p className="font-medium text-[#0F172A] mb-1">Category slugs:</p>
                          <pre className="bg-white p-2 rounded text-[11px] overflow-x-auto">
{`books, figures, youtube, blogs, podcasts, websites, universities, skills, concepts, companies, mistakes, trends, questions`}
                          </pre>
                        </div>
                        <div>
                          <p className="font-medium text-[#0F172A] mb-1">JSON format:</p>
                          <pre className="bg-white p-2 rounded text-[11px] overflow-x-auto">
{`[
  {"category_slug": "books", "name": "Clean Code", "description": "...", "url": "..."},
  {"category_slug": "figures", "name": "Alan Turing", "description": "..."}
]`}
                          </pre>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="font-medium text-[#0F172A] mb-1">Simple format (one per line):</p>
                          <pre className="bg-white p-2 rounded text-[11px] overflow-x-auto">
{`Clean Code | A handbook of agile software craftsmanship | https://amazon.com/clean-code
The Pragmatic Programmer | Tips for better coding
Design Patterns`}
                          </pre>
                        </div>
                        <div>
                          <p className="font-medium text-[#0F172A] mb-1">JSON format:</p>
                          <pre className="bg-white p-2 rounded text-[11px] overflow-x-auto">
{`[
  {"name": "Clean Code", "description": "A handbook...", "url": "https://..."},
  {"name": "The Pragmatic Programmer", "description": "Tips..."}
]`}
                          </pre>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Text input */}
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1">
                    Paste resources here
                  </label>
                  <textarea
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    rows={12}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#FF6B4A]/20 focus:border-[#FF6B4A] outline-none resize-none font-mono text-sm"
                    placeholder={bulkAllCategories
                      ? "category_slug | Name | Description | URL (one resource per line)"
                      : "Name | Description | URL (one resource per line)"
                    }
                  />
                </div>

                {/* Error display */}
                {bulkError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600 whitespace-pre-wrap">{bulkError}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeBulkModal}
                    disabled={bulkImporting}
                    className="px-4 py-2 text-[#64748B] hover:bg-[#F8FAFC] rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkImport}
                    disabled={!bulkText.trim() || bulkImporting}
                    className="px-4 py-2 bg-[#FF6B4A] text-white rounded-lg hover:bg-[#E85537] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bulkImporting ? 'Importing...' : 'Import Resources'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
