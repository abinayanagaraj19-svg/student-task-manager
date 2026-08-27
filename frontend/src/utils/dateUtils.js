/**
 * Format a date string or object to human-friendly display: "Aug 25, 2026"
 */
export const formatDisplayDate = (dateInput) => {
  if (!dateInput) return 'No due date';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

/**
 * Format a date for HTML input element: "YYYY-MM-DD"
 */
export const formatInputDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Check if a task is overdue (dueDate in past and status !== 'Completed')
 */
export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'Completed') return false;
  const due = new Date(dueDate);
  const now = new Date();
  // Set now to start of today for fair comparison
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  return dueDay < startOfToday;
};

/**
 * Check if a task is due today
 */
export const isDueToday = (dueDate) => {
  if (!dueDate) return false;
  const due = new Date(dueDate);
  const now = new Date();
  return (
    due.getFullYear() === now.getFullYear() &&
    due.getMonth() === now.getMonth() &&
    due.getDate() === now.getDate()
  );
};

/**
 * Get human-readable relative deadline: "Due today", "Overdue by 2 days", "Due in 3 days"
 */
export const getRelativeDeadline = (dueDate, status) => {
  if (!dueDate) return '';
  if (status === 'Completed') return 'Completed';

  const due = new Date(dueDate);
  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());

  const diffTime = dueDay - startOfToday;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return `Overdue by ${overdueDays} ${overdueDays === 1 ? 'day' : 'days'}`;
  }
  if (diffDays === 0) {
    return 'Due today';
  }
  if (diffDays === 1) {
    return 'Due tomorrow';
  }
  return `Due in ${diffDays} days`;
};
