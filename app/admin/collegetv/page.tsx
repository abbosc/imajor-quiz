'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { motion, AnimatePresence } from 'framer-motion';

interface Video {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string;
  youtube_id: string;
  thumbnail_url: string | null;
  tags: string[];
  order_index: number;
  is_published: boolean;
  created_at: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
}

const TAG_COLORS = [
  '#FF6B4A', '#8B5CF6', '#EC4899', '#EF4444', '#F97316',
  '#14B8A6', '#3B82F6', '#6366F1', '#10B981', '#F59E0B',
];

export default function CollegeTVAdminPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);

  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    youtube_url: '',
    tags: [] as string[],
  });

  const [bulkForm, setBulkForm] = useState({
    urls: '',
    tags: [] as string[],
  });

  const [tagForm, setTagForm] = useState({
    name: '',
    color: '#FF6B4A',
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [videosRes, tagsRes] = await Promise.all([
        fetch('/api/admin/collegetv/videos'),
        fetch('/api/admin/collegetv/tags'),
      ]);
      const videosData = await videosRes.json();
      const tagsData = await tagsRes.json();
      setVideos(videosData.data || []);
      setTags(tagsData.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

  function openVideoModal(video?: Video) {
    if (video) {
      setEditingVideo(video);
      setVideoForm({
        title: video.title,
        description: video.description || '',
        youtube_url: video.youtube_url,
        tags: video.tags || [],
      });
    } else {
      setEditingVideo(null);
      setVideoForm({ title: '', description: '', youtube_url: '', tags: [] });
    }
    setShowVideoModal(true);
  }

  function openTagModal(tag?: Tag) {
    if (tag) {
      setEditingTag(tag);
      setTagForm({ name: tag.name, color: tag.color });
    } else {
      setEditingTag(null);
      setTagForm({ name: '', color: '#FF6B4A' });
    }
    setShowTagModal(true);
  }

  async function handleVideoSubmit(e: React.FormEvent) {
    e.preventDefault();

    const method = editingVideo ? 'PUT' : 'POST';
    const body = editingVideo
      ? { id: editingVideo.id, ...videoForm }
      : videoForm;

    try {
      const res = await fetch('/api/admin/collegetv/videos', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setShowVideoModal(false);
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save video');
      }
    } catch (error) {
      console.error('Failed to save video:', error);
    }
  }

  async function handleTagSubmit(e: React.FormEvent) {
    e.preventDefault();

    const method = editingTag ? 'PUT' : 'POST';
    const body = editingTag
      ? { id: editingTag.id, ...tagForm }
      : tagForm;

    try {
      const res = await fetch('/api/admin/collegetv/tags', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setShowTagModal(false);
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save tag');
      }
    } catch (error) {
      console.error('Failed to save tag:', error);
    }
  }

  async function deleteVideo(id: string) {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      await fetch(`/api/admin/collegetv/videos?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error('Failed to delete video:', error);
    }
  }

  async function deleteTag(id: string) {
    if (!confirm('Are you sure you want to delete this tag?')) return;

    try {
      await fetch(`/api/admin/collegetv/tags?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error('Failed to delete tag:', error);
    }
  }

  async function togglePublished(video: Video) {
    try {
      await fetch('/api/admin/collegetv/videos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: video.id, is_published: !video.is_published }),
      });
      fetchData();
    } catch (error) {
      console.error('Failed to toggle published:', error);
    }
  }

  function toggleVideoTag(tagName: string) {
    setVideoForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tagName)
        ? prev.tags.filter(t => t !== tagName)
        : [...prev.tags, tagName],
    }));
  }

  function toggleBulkTag(tagName: string) {
    setBulkForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tagName)
        ? prev.tags.filter(t => t !== tagName)
        : [...prev.tags, tagName],
    }));
  }

  function openBulkModal() {
    setBulkForm({ urls: '', tags: [] });
    setShowBulkModal(true);
  }

  async function handleBulkSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBulkLoading(true);

    try {
      const res = await fetch('/api/admin/collegetv/videos/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urls: bulkForm.urls,
          tags: bulkForm.tags,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setShowBulkModal(false);
        fetchData();
        if (result.results) {
          const successful = result.results.filter((r: { success: boolean }) => r.success).length;
          const failed = result.results.filter((r: { success: boolean }) => !r.success).length;
          alert(`Added ${successful} videos successfully${failed > 0 ? `, ${failed} failed` : ''}`);
        }
      } else {
        alert(result.error || 'Failed to add videos');
      }
    } catch (error) {
      console.error('Failed to bulk add videos:', error);
      alert('Failed to add videos');
    } finally {
      setBulkLoading(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-48 bg-[#F1F5F9] rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-[#F1F5F9] rounded-xl" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]">CollegeTV</h1>
            <p className="text-[#64748B] mt-1">
              Manage college admissions videos and tags
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => openTagModal()}
              className="px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1E293B] transition-colors"
            >
              Manage Tags
            </button>
            <button
              onClick={openBulkModal}
              className="px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
            >
              Bulk Add
            </button>
            <button
              onClick={() => openVideoModal()}
              className="px-4 py-2 bg-[#FF6B4A] text-white rounded-lg hover:bg-[#E85537] transition-colors"
            >
              Add Video
            </button>
          </div>
        </div>

        {/* Tags Section */}
        {tags.length > 0 && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-4">
            <h3 className="text-sm font-medium text-[#64748B] mb-3">Available Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => openTagModal(tag)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-white hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Videos Grid */}
        {videos.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-[#E2E8F0] p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F8FAFC] flex items-center justify-center">
              <svg className="w-8 h-8 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#0F172A] mb-2">No videos yet</h3>
            <p className="text-[#64748B] mb-4">Add your first college admissions video</p>
            <button
              onClick={() => openVideoModal()}
              className="px-4 py-2 bg-[#FF6B4A] text-white rounded-lg hover:bg-[#E85537] transition-colors"
            >
              Add Video
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`bg-white rounded-xl border border-[#E2E8F0] overflow-hidden ${
                  !video.is_published ? 'opacity-60' : ''
                }`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-[#F8FAFC]">
                  {video.thumbnail_url && (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`;
                      }}
                    />
                  )}
                  {!video.is_published && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-[#0F172A]/80 text-white text-xs rounded">
                      Draft
                    </div>
                  )}
                  <a
                    href={video.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#FF6B4A] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </a>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-[#0F172A] line-clamp-2 mb-2">
                    {video.title}
                  </h3>

                  {/* Tags */}
                  {video.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {video.tags.map(tagName => {
                        const tag = tags.find(t => t.name === tagName);
                        return (
                          <span
                            key={tagName}
                            className="px-2 py-0.5 rounded text-xs font-medium text-white"
                            style={{ backgroundColor: tag?.color || '#94A3B8' }}
                          >
                            {tagName}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-[#E2E8F0]">
                    <button
                      onClick={() => togglePublished(video)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        video.is_published
                          ? 'bg-[#ECFDF5] text-[#059669] hover:bg-[#D1FAE5]'
                          : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                      }`}
                    >
                      {video.is_published ? 'Published' : 'Draft'}
                    </button>
                    <button
                      onClick={() => openVideoModal(video)}
                      className="p-1.5 text-[#64748B] hover:text-[#FF6B4A] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteVideo(video.id)}
                      className="p-1.5 text-[#64748B] hover:text-[#EF4444] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowVideoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-[#0F172A] mb-6">
                  {editingVideo ? 'Edit Video' : 'Add Video'}
                </h2>

                <form onSubmit={handleVideoSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-1">
                      YouTube URL *
                    </label>
                    <input
                      type="url"
                      value={videoForm.youtube_url}
                      onChange={e => setVideoForm(prev => ({ ...prev, youtube_url: e.target.value }))}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={videoForm.title}
                      onChange={e => setVideoForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Video title"
                      className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-1">
                      Description
                    </label>
                    <textarea
                      value={videoForm.description}
                      onChange={e => setVideoForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Optional description"
                      rows={3}
                      className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/50 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-2">
                      Tags
                    </label>
                    {tags.length === 0 ? (
                      <p className="text-sm text-[#64748B]">No tags available. Create tags first.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggleVideoTag(tag.name)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                              videoForm.tags.includes(tag.name)
                                ? 'text-white'
                                : 'bg-[#F1F5F9] text-[#64748B]'
                            }`}
                            style={videoForm.tags.includes(tag.name) ? { backgroundColor: tag.color } : {}}
                          >
                            {tag.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowVideoModal(false)}
                      className="flex-1 px-4 py-2 border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-[#FF6B4A] text-white rounded-lg hover:bg-[#E85537] transition-colors"
                    >
                      {editingVideo ? 'Save Changes' : 'Add Video'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tag Modal */}
      <AnimatePresence>
        {showTagModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowTagModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-[#0F172A] mb-6">
                  {editingTag ? 'Edit Tag' : 'Add Tag'}
                </h2>

                <form onSubmit={handleTagSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-1">
                      Tag Name *
                    </label>
                    <input
                      type="text"
                      value={tagForm.name}
                      onChange={e => setTagForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Essays, Interviews"
                      className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-2">
                      Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TAG_COLORS.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setTagForm(prev => ({ ...prev, color }))}
                          className={`w-8 h-8 rounded-full transition-transform ${
                            tagForm.color === color ? 'ring-2 ring-offset-2 ring-[#0F172A] scale-110' : ''
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    {editingTag && (
                      <button
                        type="button"
                        onClick={() => {
                          deleteTag(editingTag.id);
                          setShowTagModal(false);
                        }}
                        className="px-4 py-2 text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    )}
                    <div className="flex-1" />
                    <button
                      type="button"
                      onClick={() => setShowTagModal(false)}
                      className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#FF6B4A] text-white rounded-lg hover:bg-[#E85537] transition-colors"
                    >
                      {editingTag ? 'Save' : 'Add Tag'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Add Modal */}
      <AnimatePresence>
        {showBulkModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => !bulkLoading && setShowBulkModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-[#0F172A] mb-2">
                  Bulk Add Videos
                </h2>
                <p className="text-sm text-[#64748B] mb-6">
                  Paste multiple YouTube URLs, one per line. Titles will be fetched automatically.
                </p>

                <form onSubmit={handleBulkSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-1">
                      YouTube URLs *
                    </label>
                    <textarea
                      value={bulkForm.urls}
                      onChange={e => setBulkForm(prev => ({ ...prev, urls: e.target.value }))}
                      placeholder="https://www.youtube.com/watch?v=...&#10;https://youtu.be/...&#10;https://www.youtube.com/watch?v=..."
                      rows={8}
                      className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 resize-none font-mono text-sm"
                      required
                      disabled={bulkLoading}
                    />
                    <p className="text-xs text-[#94A3B8] mt-1">
                      Supports youtube.com/watch, youtu.be, and embed URLs
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-2">
                      Apply Tags to All
                    </label>
                    {tags.length === 0 ? (
                      <p className="text-sm text-[#64748B]">No tags available.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggleBulkTag(tag.name)}
                            disabled={bulkLoading}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                              bulkForm.tags.includes(tag.name)
                                ? 'text-white'
                                : 'bg-[#F1F5F9] text-[#64748B]'
                            } ${bulkLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            style={bulkForm.tags.includes(tag.name) ? { backgroundColor: tag.color } : {}}
                          >
                            {tag.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowBulkModal(false)}
                      disabled={bulkLoading}
                      className="flex-1 px-4 py-2 border border-[#E2E8F0] text-[#64748B] rounded-lg hover:bg-[#F8FAFC] transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={bulkLoading}
                      className="flex-1 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {bulkLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Adding...
                        </>
                      ) : (
                        'Add All Videos'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
