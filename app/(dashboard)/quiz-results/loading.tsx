export default function QuizResultsLoading() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="h-8 animate-shimmer rounded-lg w-36 mb-2" />
        <div className="h-4 animate-shimmer rounded w-64" />
      </div>

      {/* Results Summary Card */}
      <div className="card p-4 sm:p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 animate-shimmer rounded-full" />
          <div className="flex-1">
            <div className="h-6 animate-shimmer rounded w-40 mb-2" />
            <div className="h-4 animate-shimmer rounded w-24" />
          </div>
        </div>
        <div className="h-2 animate-shimmer rounded-full mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#F8FAFC] rounded-xl p-4">
            <div className="h-3 animate-shimmer rounded w-16 mb-2" />
            <div className="h-6 animate-shimmer rounded w-20" />
          </div>
          <div className="bg-[#F8FAFC] rounded-xl p-4">
            <div className="h-3 animate-shimmer rounded w-20 mb-2" />
            <div className="h-6 animate-shimmer rounded w-16" />
          </div>
        </div>
      </div>

      {/* Recommended Majors */}
      <div className="card p-4 sm:p-6">
        <div className="h-6 animate-shimmer rounded w-44 mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl">
              <div className="w-10 h-10 animate-shimmer rounded-lg" />
              <div className="flex-1">
                <div className="h-5 animate-shimmer rounded w-36 mb-1" />
                <div className="h-3 animate-shimmer rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
