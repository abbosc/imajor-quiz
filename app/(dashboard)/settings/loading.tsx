export default function SettingsLoading() {
  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="h-8 animate-shimmer rounded-lg w-28 mb-2" />
        <div className="h-4 animate-shimmer rounded w-56" />
      </div>

      {/* Profile Section */}
      <div className="card p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="h-6 animate-shimmer rounded w-40 mb-4" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="h-4 animate-shimmer rounded w-20 mb-2" />
              <div className="h-12 animate-shimmer rounded-xl" />
            </div>
          ))}
          <div className="h-12 animate-shimmer rounded-xl mt-4" />
        </div>
      </div>

      {/* Majors Section */}
      <div className="card p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="h-6 animate-shimmer rounded w-36 mb-2" />
        <div className="h-4 animate-shimmer rounded w-72 mb-4" />

        {/* Search Box */}
        <div className="h-12 animate-shimmer rounded-xl mb-4" />

        {/* Majors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-12 animate-shimmer rounded-xl" />
          ))}
        </div>
      </div>

      {/* Account Section */}
      <div className="card p-4 sm:p-6">
        <div className="h-6 animate-shimmer rounded w-24 mb-4" />
        <div className="h-16 animate-shimmer rounded-xl mb-4" />
        <div className="h-12 animate-shimmer rounded-xl" />
      </div>
    </div>
  );
}
