interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  default: 'bg-[#F1F5F9] text-[#64748B]',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

// Status-specific badges for common use cases
export function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    // University statuses
    researching: { variant: 'default', label: 'Researching' },
    applying: { variant: 'info', label: 'Applying' },
    applied: { variant: 'warning', label: 'Applied' },
    accepted: { variant: 'success', label: 'Accepted' },
    rejected: { variant: 'error', label: 'Rejected' },
    waitlisted: { variant: 'warning', label: 'Waitlisted' },
    withdrawn: { variant: 'default', label: 'Withdrawn' },

    // Task statuses
    not_started: { variant: 'default', label: 'Not Started' },
    in_progress: { variant: 'info', label: 'In Progress' },
    completed: { variant: 'success', label: 'Completed' },

    // Test statuses
    planned: { variant: 'default', label: 'Planned' },
    preparing: { variant: 'info', label: 'Preparing' },
    scheduled: { variant: 'warning', label: 'Scheduled' },

    // Essay statuses
    draft: { variant: 'default', label: 'Draft' },
    in_review: { variant: 'warning', label: 'In Review' },
    final: { variant: 'success', label: 'Final' },

    // Recommendation statuses
    not_requested: { variant: 'default', label: 'Not Requested' },
    requested: { variant: 'info', label: 'Requested' },
    submitted: { variant: 'success', label: 'Submitted' },
  };

  const config = statusConfig[status] || { variant: 'default', label: status };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}

// Level badge for honors
export function LevelBadge({ level }: { level: string }) {
  const levelConfig: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    school: { variant: 'default', label: 'School' },
    state: { variant: 'info', label: 'State' },
    regional: { variant: 'info', label: 'Regional' },
    national: { variant: 'warning', label: 'National' },
    international: { variant: 'success', label: 'International' },
  };

  const config = levelConfig[level] || { variant: 'default', label: level };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
