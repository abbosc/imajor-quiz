'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface TaskWithProgress {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  order_index: number;
  status: 'not_started' | 'in_progress' | 'completed';
  notes: string | null;
  progress_id: string | null;
}

const categoryColors: Record<string, string> = {
  research: 'bg-blue-100 text-blue-700',
  networking: 'bg-purple-100 text-purple-700',
  'self-reflection': 'bg-pink-100 text-pink-700',
  experience: 'bg-green-100 text-green-700',
  planning: 'bg-amber-100 text-amber-700',
};

const statusConfig = {
  not_started: {
    label: 'Not Started',
    color: 'bg-gray-100 text-gray-600',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth={2} />
      </svg>
    ),
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-600',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-100 text-green-600',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'not_started' | 'in_progress' | 'completed'>('all');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      const response = await fetch('/api/user/task-progress');
      const result = await response.json();
      if (result.data) {
        setTasks(result.data);
        // Initialize notes
        const notesMap: Record<string, string> = {};
        result.data.forEach((task: TaskWithProgress) => {
          if (task.notes) notesMap[task.id] = task.notes;
        });
        setNotes(notesMap);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: 'not_started' | 'in_progress' | 'completed') => {
    try {
      const response = await fetch('/api/user/task-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: taskId,
          status: newStatus,
          notes: notes[taskId] || null,
        }),
      });

      if (response.ok) {
        setTasks(prev =>
          prev.map(task =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
        toast.success(`Task marked as ${statusConfig[newStatus].label.toLowerCase()}`);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const saveNotes = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      await fetch('/api/user/task-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: taskId,
          status: task?.status || 'not_started',
          notes: notes[taskId] || null,
        }),
      });
      toast.success('Notes saved');
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Failed to save notes');
    }
  };

  const filteredTasks = tasks.filter(task =>
    filter === 'all' || task.status === filter
  );

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    notStarted: tasks.filter(t => t.status === 'not_started').length,
  };

  const progressPercent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B4A]"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0F172A] mb-1 sm:mb-2">Exploration Tasks</h1>
        <p className="text-xs sm:text-sm md:text-base text-[#64748B]">
          Track your progress as you explore different majors and career paths.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="card p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-3 sm:gap-4 md:gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-[#64748B]">Overall Progress</span>
              <span className="text-xs sm:text-sm font-bold text-[#0F172A]">{progressPercent}%</span>
            </div>
            <div className="h-2 sm:h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6D] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 sm:flex">
            <div className="text-center">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-[10px] sm:text-xs text-[#64748B]">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              <p className="text-[10px] sm:text-xs text-[#64748B]">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-400">{stats.notStarted}</p>
              <p className="text-[10px] sm:text-xs text-[#64748B]">Not Started</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4 md:mb-6 overflow-x-auto pb-2">
        {(['all', 'not_started', 'in_progress', 'completed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              filter === status
                ? 'bg-[#FF6B4A] text-white'
                : 'bg-white text-[#64748B] hover:bg-[#F8FAFC] border border-[#E2E8F0]'
            }`}
          >
            {status === 'all' ? 'All' : statusConfig[status].label}
            <span className="ml-1 sm:ml-2 opacity-75">
              ({status === 'all' ? stats.total : stats[status === 'not_started' ? 'notStarted' : status === 'in_progress' ? 'inProgress' : 'completed']})
            </span>
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-[#E2E8F0] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
            {filter === 'all' ? 'No tasks available' : `No ${statusConfig[filter].label.toLowerCase()} tasks`}
          </h3>
          <p className="text-[#64748B]">
            {filter === 'all'
              ? 'Check back later for exploration tasks.'
              : 'Change the filter to see other tasks.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {filteredTasks.map((task, index) => (
            <div key={task.id} className="card overflow-hidden">
              <div className="p-2.5 sm:p-3 md:p-4">
                <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                  {/* Task Number & Status Toggle */}
                  <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                    <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-[#F8FAFC] text-[#64748B] font-medium text-xs sm:text-sm">
                      {index + 1}
                    </div>
                    <button
                      onClick={() => {
                        const nextStatus =
                          task.status === 'not_started' ? 'in_progress' :
                          task.status === 'in_progress' ? 'completed' : 'not_started';
                        updateTaskStatus(task.id, nextStatus);
                      }}
                      className={`p-1 sm:p-1.5 rounded-lg transition-colors ${statusConfig[task.status].color}`}
                      title={`Click to change status (current: ${statusConfig[task.status].label})`}
                    >
                      <div className="w-4 h-4 sm:w-5 sm:h-5">{statusConfig[task.status].icon}</div>
                    </button>
                  </div>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                      <h3 className={`text-sm sm:text-base font-semibold ${task.status === 'completed' ? 'text-[#64748B] line-through' : 'text-[#0F172A]'}`}>
                        {task.title}
                      </h3>
                      {task.category && (
                        <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs ${categoryColors[task.category] || 'bg-gray-100 text-gray-700'}`}>
                          {task.category}
                        </span>
                      )}
                      <span className={`hidden sm:inline px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs ${statusConfig[task.status].color}`}>
                        {statusConfig[task.status].label}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-xs sm:text-sm text-[#64748B] mb-1.5 sm:mb-2 line-clamp-2">{task.description}</p>
                    )}

                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                      className="text-xs sm:text-sm text-[#FF6B4A] hover:underline flex items-center gap-1"
                    >
                      {expandedTask === task.id ? 'Hide notes' : 'Add notes'}
                      <svg
                        className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${expandedTask === task.id ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-1">
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'completed')}
                        className="p-1.5 sm:p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                        title="Mark as completed"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expandable Notes Section */}
              {expandedTask === task.id && (
                <div className="px-2.5 sm:px-3 md:px-4 pb-2.5 sm:pb-3 md:pb-4 pt-0">
                  <div className="border-t border-[#E2E8F0] pt-2.5 sm:pt-3 md:pt-4 ml-8 sm:ml-10 md:ml-12">
                    <label className="block text-xs sm:text-sm font-medium text-[#0F172A] mb-1.5 sm:mb-2">
                      Personal Notes
                    </label>
                    <textarea
                      value={notes[task.id] || ''}
                      onChange={(e) => setNotes(prev => ({ ...prev, [task.id]: e.target.value }))}
                      placeholder="Add your notes, reflections, or resources here..."
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-[#E2E8F0] focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none resize-none text-xs sm:text-sm"
                    />
                    <div className="flex justify-end mt-1.5 sm:mt-2">
                      <button
                        onClick={() => saveNotes(task.id)}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-white bg-[#FF6B4A] hover:bg-[#FF5A36] transition-colors"
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
