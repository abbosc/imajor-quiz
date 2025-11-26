export default function TasksLoading() {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="h-8 animate-shimmer rounded-lg w-40 mb-2" />
          <div className="h-4 animate-shimmer rounded w-72" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-9 animate-shimmer rounded-lg w-24 flex-shrink-0" />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="card p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 animate-shimmer rounded w-32" />
          <div className="h-4 animate-shimmer rounded w-16" />
        </div>
        <div className="h-2 animate-shimmer rounded-full" />
      </div>

      {/* Task Items */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 animate-shimmer rounded-lg" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-5 animate-shimmer rounded w-48" />
                  <div className="h-5 animate-shimmer rounded-full w-20" />
                </div>
                <div className="h-4 animate-shimmer rounded w-full" />
              </div>
              <div className="w-9 h-9 animate-shimmer rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
