export const TASK_STATUSES = [
  { id: 'Pending', label: 'Pending', color: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20' },
  { id: 'In Progress', label: 'In Progress', color: 'bg-sky-50 text-sky-700 border-sky-200 ring-sky-500/20' },
  { id: 'Completed', label: 'Completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20' },
];

export const TASK_PRIORITIES = [
  { id: 'High', label: 'High Priority', badgeColor: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20', dotColor: 'bg-rose-500' },
  { id: 'Medium', label: 'Medium Priority', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20', dotColor: 'bg-amber-500' },
  { id: 'Low', label: 'Low Priority', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20', dotColor: 'bg-emerald-500' },
];

export const POPULAR_SUBJECTS = [
  'All',
  'Computer Science',
  'Data Structures & Algorithms',
  'Web Development',
  'Database Systems',
  'Mathematics',
  'Artificial Intelligence',
  'Operating Systems',
  'Final Project',
  'General',
];

export const SORT_OPTIONS = [
  { value: 'dueDate_asc', label: 'Due Date (Earliest First)' },
  { value: 'dueDate_desc', label: 'Due Date (Latest First)' },
  { value: 'createdAt_desc', label: 'Recently Created' },
  { value: 'priority_desc', label: 'Priority (High to Low)' },
  { value: 'title_asc', label: 'Title (A - Z)' },
];
