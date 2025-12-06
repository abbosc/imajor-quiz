import useSWR from 'swr';

// Generic fetcher for API routes
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  const json = await res.json();
  return json.data;
};

// SWR config for dashboard data - cache for 30 seconds, revalidate in background
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 5000, // Dedupe requests within 5 seconds
};

// Activities
export function useActivities() {
  const { data, error, isLoading, mutate } = useSWR('/api/user/activities', fetcher, swrConfig);
  return {
    activities: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// Tasks with progress
export function useTasks() {
  const { data, error, isLoading, mutate } = useSWR('/api/user/task-progress', fetcher, swrConfig);
  return {
    tasks: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// Universities
export function useUniversities() {
  const { data, error, isLoading, mutate } = useSWR('/api/user/universities', fetcher, swrConfig);
  return {
    universities: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// Tests
export function useTests() {
  const { data, error, isLoading, mutate } = useSWR('/api/user/tests', fetcher, swrConfig);
  return {
    tests: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// Essays
export function useEssays() {
  const { data, error, isLoading, mutate } = useSWR('/api/user/essays', fetcher, swrConfig);
  return {
    essays: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// Honors
export function useHonors() {
  const { data, error, isLoading, mutate } = useSWR('/api/user/honors', fetcher, swrConfig);
  return {
    honors: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// Recommendations
export function useRecommendations() {
  const { data, error, isLoading, mutate } = useSWR('/api/user/recommendations', fetcher, swrConfig);
  return {
    recommendations: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// Quiz Results
export function useQuizResults() {
  const { data, error, isLoading, mutate } = useSWR('/api/user/quiz-results', fetcher, swrConfig);
  return {
    results: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// Majors (for settings)
export function useMajors() {
  const { data, error, isLoading } = useSWR('/api/majors', fetcher, swrConfig);
  return {
    majors: data || [],
    isLoading,
    isError: error,
  };
}

// User's selected majors
export function useUserMajors() {
  const { data, error, isLoading, mutate } = useSWR('/api/user/majors', fetcher, swrConfig);
  return {
    userMajors: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// CollegeTV Videos (with optional tag filter)
export function useCollegeTVVideos(tagFilter?: string | null) {
  const url = tagFilter
    ? `/api/collegetv/videos?tag=${encodeURIComponent(tagFilter)}`
    : '/api/collegetv/videos';
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, swrConfig);
  return {
    videos: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// CollegeTV Tags
export function useCollegeTVTags() {
  const { data, error, isLoading } = useSWR('/api/collegetv/tags', fetcher, swrConfig);
  return {
    tags: data || [],
    isLoading,
    isError: error,
  };
}

// Career Categories
export function useCareerCategories() {
  const { data, error, isLoading } = useSWR('/api/careers/categories', fetcher, swrConfig);
  return {
    categories: data || [],
    isLoading,
    isError: error,
  };
}

// 10Resources Majors
export function useTenResourcesMajors() {
  const { data, error, isLoading } = useSWR('/api/10resources/majors', fetcher, swrConfig);
  return {
    majors: data || [],
    isLoading,
    isError: error,
  };
}
