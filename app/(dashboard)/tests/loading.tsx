export default function TestsLoading() {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="h-8 animate-shimmer rounded-lg w-24 mb-2" />
          <div className="h-4 animate-shimmer rounded w-56" />
        </div>
        <div className="h-10 animate-shimmer rounded-xl w-28" />
      </div>

      {/* Progress Card */}
      <div className="card p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 animate-shimmer rounded w-24" />
          <div className="h-4 animate-shimmer rounded w-12" />
        </div>
        <div className="h-2 animate-shimmer rounded-full" />
      </div>

      {/* Test Cards */}
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-5 animate-shimmer rounded w-24" />
                  <div className="h-5 animate-shimmer rounded-full w-16" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                  {[...Array(4)].map((_, j) => (
                    <div key={j}>
                      <div className="h-3 animate-shimmer rounded w-16 mb-1" />
                      <div className="h-5 animate-shimmer rounded w-12" />
                    </div>
                  ))}
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
