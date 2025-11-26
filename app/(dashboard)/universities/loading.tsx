export default function UniversitiesLoading() {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="h-8 animate-shimmer rounded-lg w-36 mb-2" />
          <div className="h-4 animate-shimmer rounded w-56" />
        </div>
        <div className="h-10 animate-shimmer rounded-xl w-36" />
      </div>

      {/* University Cards */}
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <div className="h-5 animate-shimmer rounded w-44" />
                  <div className="h-5 animate-shimmer rounded-full w-20" />
                  <div className="h-5 animate-shimmer rounded-full w-28" />
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="h-4 animate-shimmer rounded w-36" />
                  <div className="h-4 animate-shimmer rounded w-28" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-9 h-9 animate-shimmer rounded-lg" />
                <div className="w-9 h-9 animate-shimmer rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
