interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-full bg-[#F8FAFC] flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[#0F172A] mb-2">{title}</h3>
      {description && (
        <p className="text-[#64748B] max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2.5 rounded-xl font-medium text-white gradient-accent hover:shadow-lg hover:shadow-[#FF6B4A]/25 transition-all duration-300"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// Pre-configured empty states for common use cases
export function NoUniversitiesEmpty({ onAdd }: { onAdd: () => void }) {
  return (
    <EmptyState
      icon={
        <svg className="w-8 h-8 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      }
      title="No universities yet"
      description="Start building your college list by adding universities you're interested in."
      action={{ label: 'Add University', onClick: onAdd }}
    />
  );
}

export function NoTestsEmpty({ onAdd }: { onAdd: () => void }) {
  return (
    <EmptyState
      icon={
        <svg className="w-8 h-8 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      }
      title="No tests tracked"
      description="Keep track of your standardized tests like SAT, ACT, TOEFL, and more."
      action={{ label: 'Add Test', onClick: onAdd }}
    />
  );
}

export function NoActivitiesEmpty({ onAdd }: { onAdd: () => void }) {
  return (
    <EmptyState
      icon={
        <svg className="w-8 h-8 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      }
      title="No activities added"
      description="Document your extracurricular activities for your college applications."
      action={{ label: 'Add Activity', onClick: onAdd }}
    />
  );
}

export function NoEssaysEmpty({ onAdd }: { onAdd: () => void }) {
  return (
    <EmptyState
      icon={
        <svg className="w-8 h-8 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      }
      title="No essays yet"
      description="Start writing and organizing your college application essays."
      action={{ label: 'Create Essay', onClick: onAdd }}
    />
  );
}
