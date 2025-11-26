export default function DashboardLoading() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="h-8 animate-shimmer rounded-lg w-48 mb-2" />
        <div className="h-4 animate-shimmer rounded w-64" />
      </div>

      {/* Stats Grid - 4 cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 animate-shimmer rounded-xl" />
              <div className="h-4 animate-shimmer rounded w-20" />
            </div>
            <div className="h-8 animate-shimmer rounded w-16 mb-1" />
            <div className="h-3 animate-shimmer rounded w-24" />
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quiz Results Card */}
        <div className="card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 animate-shimmer rounded w-32" />
            <div className="h-8 animate-shimmer rounded w-24" />
          </div>
          <div className="space-y-3">
            <div className="h-4 animate-shimmer rounded w-full" />
            <div className="h-4 animate-shimmer rounded w-3/4" />
            <div className="h-10 animate-shimmer rounded w-full mt-4" />
          </div>
        </div>

        {/* Progress Card */}
        <div className="card p-4 sm:p-6">
          <div className="h-6 animate-shimmer rounded w-40 mb-4" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <div className="h-4 animate-shimmer rounded w-24" />
                  <div className="h-4 animate-shimmer rounded w-12" />
                </div>
                <div className="h-2 animate-shimmer rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
