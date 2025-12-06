'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCollegeTVVideos, useCollegeTVTags } from '@/hooks/useDashboardData';

interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export default function CollegeTVPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { videos, isLoading: videosLoading } = useCollegeTVVideos(selectedTag);
  const { tags, isLoading: tagsLoading } = useCollegeTVTags();

  const loading = videosLoading || tagsLoading;

  if (loading && videos.length === 0) {
    return (
      <div className="min-h-[80vh]">
        <div className="space-y-4 sm:space-y-6">
          <div className="h-20 sm:h-24 rounded-2xl animate-shimmer" />
          <div className="h-10 w-full rounded-lg animate-shimmer" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-video rounded-xl animate-shimmer" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] overflow-x-hidden max-w-full">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-[#FF6B4A]/5 to-[#FF8F6B]/5 rounded-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#FF6B4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0F172A]">CollegeTV</h1>
            <p className="text-xs sm:text-sm md:text-base text-[#64748B] truncate sm:whitespace-normal">Videos to help you navigate college admissions</p>
          </div>
        </div>
      </motion.div>

      {/* Tag Filter Bar */}
      {tags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-4 sm:mb-6 overflow-x-auto pb-2 scrollbar-hide"
        >
          <div className="flex gap-2 w-max">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                selectedTag === null
                  ? 'bg-[#FF6B4A] text-white'
                  : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
              }`}
            >
              All
            </button>
            {tags.map((tag: Tag) => (
              <button
                key={tag.id}
                onClick={() => setSelectedTag(tag.name)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  selectedTag === tag.name
                    ? 'text-white'
                    : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                }`}
                style={selectedTag === tag.name ? { backgroundColor: tag.color } : {}}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Videos Grid */}
      {videos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl border border-dashed border-[#E2E8F0] p-8 sm:p-12 text-center"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-[#F8FAFC] flex items-center justify-center">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-[#0F172A] mb-2">No videos available</h3>
          <p className="text-sm sm:text-base text-[#64748B]">
            {selectedTag
              ? `No videos found with tag "${selectedTag}"`
              : 'Check back soon for college admissions videos!'}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full"
        >
          {videos.map((video: any, index: number) => (
            <motion.a
              key={video.id}
              href={video.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group bg-white rounded-xl border border-[#E2E8F0] overflow-hidden hover:shadow-lg hover:border-[#FF6B4A]/30 transition-all duration-300 min-w-0 w-full max-w-full"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-[#F8FAFC] overflow-hidden w-full">
                {video.thumbnail_url && (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 max-w-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`;
                    }}
                  />
                )}
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FF6B4A] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-0.5 sm:ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-4 overflow-hidden">
                <h3 className="font-semibold text-sm sm:text-base text-[#0F172A] line-clamp-2 group-hover:text-[#FF6B4A] transition-colors break-words">
                  {video.title}
                </h3>

                {/* Tags */}
                {video.tags && video.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2 sm:mt-3">
                    {video.tags.map((tagName: string) => {
                      const tag = tags.find((t: Tag) => t.name === tagName);
                      return (
                        <span
                          key={tagName}
                          className="px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium text-white"
                          style={{ backgroundColor: tag?.color || '#94A3B8' }}
                        >
                          {tagName}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.a>
          ))}
        </motion.div>
      )}
    </div>
  );
}
