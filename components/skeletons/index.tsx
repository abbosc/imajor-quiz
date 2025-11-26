// Reusable skeleton components for Suspense fallbacks

// Stat card skeleton (used on dashboard)
export function StatCardSkeleton() {
  return (
    <div className="card p-3 sm:p-4">
      <div className="h-3 animate-shimmer rounded w-16 mb-2" />
      <div className="h-7 animate-shimmer rounded w-12 mb-1" />
      <div className="h-3 animate-shimmer rounded w-20" />
    </div>
  );
}

// Multiple stat cards skeleton
export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
  );
}

// Major tags skeleton
export function MajorTagsSkeleton() {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      <div className="h-7 animate-shimmer rounded-full w-24" />
      <div className="h-7 animate-shimmer rounded-full w-32" />
      <div className="h-7 animate-shimmer rounded-full w-20" />
    </div>
  );
}

// List item skeleton (for tests, activities, etc.)
export function ListItemSkeleton() {
  return (
    <div className="card p-4">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-5 animate-shimmer rounded w-24" />
            <div className="h-5 animate-shimmer rounded-full w-16" />
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="h-4 animate-shimmer rounded w-20" />
            <div className="h-4 animate-shimmer rounded w-16" />
            <div className="h-4 animate-shimmer rounded w-24" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-9 h-9 animate-shimmer rounded-lg" />
          <div className="w-9 h-9 animate-shimmer rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Multiple list items skeleton
export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <ListItemSkeleton key={i} />
      ))}
    </div>
  );
}

// Progress bar skeleton
export function ProgressSkeleton() {
  return (
    <div className="card p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="h-4 animate-shimmer rounded w-24" />
        <div className="h-4 animate-shimmer rounded w-12" />
      </div>
      <div className="h-2 animate-shimmer rounded-full" />
    </div>
  );
}

// Table row skeleton (for settings, etc.)
export function TableRowSkeleton() {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#E2E8F0]">
      <div className="h-5 animate-shimmer rounded w-32" />
      <div className="h-5 animate-shimmer rounded w-20" />
    </div>
  );
}

// Card with content skeleton
export function ContentCardSkeleton() {
  return (
    <div className="card p-4 sm:p-6">
      <div className="h-6 animate-shimmer rounded w-1/3 mb-4" />
      <div className="space-y-3">
        <div className="h-4 animate-shimmer rounded w-full" />
        <div className="h-4 animate-shimmer rounded w-5/6" />
        <div className="h-4 animate-shimmer rounded w-4/6" />
      </div>
    </div>
  );
}
