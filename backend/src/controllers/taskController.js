const Task = require('../models/Task');

/**
 * @desc    Get all tasks for the logged-in student (with search, filter, sort)
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = async (req, res, next) => {
  try {
    const {
      search,
      status,
      priority,
      subject,
      timeframe,
      sortBy = 'dueDate_asc',
    } = req.query;

    // Base query: only tasks belonging to authenticated user
    const query = { user: req.user.id };

    // Search query (matches title, description, or subject)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { subject: searchRegex },
      ];
    }

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Priority filter
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Subject/Course filter
    if (subject && subject !== 'All') {
      query.subject = subject;
    }

    // Timeframe filters
    const now = new Date();
    if (timeframe === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      query.dueDate = { $gte: startOfDay, $lte: endOfDay };
    } else if (timeframe === 'upcoming') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      query.dueDate = { $gte: startOfDay };
      query.status = { $ne: 'Completed' };
    } else if (timeframe === 'overdue') {
      query.dueDate = { $lt: now };
      query.status = { $ne: 'Completed' };
    }

    // Sorting definition
    let sortOptions = {};
    switch (sortBy) {
      case 'dueDate_asc':
        sortOptions = { dueDate: 1, priority: -1 };
        break;
      case 'dueDate_desc':
        sortOptions = { dueDate: -1 };
        break;
      case 'createdAt_desc':
        sortOptions = { createdAt: -1 };
        break;
      case 'createdAt_asc':
        sortOptions = { createdAt: 1 };
        break;
      case 'priority_desc':
        // Custom priority sort handling or by title
        sortOptions = { priority: 1, dueDate: 1 };
        break;
      case 'title_asc':
        sortOptions = { title: 1 };
        break;
      default:
        sortOptions = { dueDate: 1 };
    }

    const tasks = await Task.find(query).sort(sortOptions);

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single task by ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access unauthorized',
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      subject,
      priority,
      status,
      dueDate,
      isImportant,
    } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both task title and due date',
      });
    }

    const isCompleted = status === 'Completed';

    const task = await Task.create({
      user: req.user.id,
      title: title.trim(),
      description: description ? description.trim() : '',
      subject: subject && subject.trim() !== '' ? subject.trim() : 'General',
      priority: priority || 'Medium',
      status: status || 'Pending',
      dueDate: new Date(dueDate),
      isImportant: Boolean(isImportant),
      completedAt: isCompleted ? new Date() : null,
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access unauthorized',
      });
    }

    const {
      title,
      description,
      subject,
      priority,
      status,
      dueDate,
      isImportant,
    } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (subject !== undefined) task.subject = subject.trim() || 'General';
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = new Date(dueDate);
    if (isImportant !== undefined) task.isImportant = Boolean(isImportant);

    if (status !== undefined) {
      task.status = status;
      if (status === 'Completed' && !task.completedAt) {
        task.completedAt = new Date();
      } else if (status !== 'Completed') {
        task.completedAt = null;
      }
    }

    const updatedTask = await task.save();

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle task completion status (Pending <-> Completed)
 * @route   PATCH /api/tasks/:id/toggle
 * @access  Private
 */
const toggleTaskStatus = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access unauthorized',
      });
    }

    if (task.status === 'Completed') {
      task.status = 'Pending';
      task.completedAt = null;
    } else {
      task.status = 'Completed';
      task.completedAt = new Date();
    }

    const updatedTask = await task.save();

    return res.status(200).json({
      success: true,
      message: `Task marked as ${updatedTask.status}`,
      task: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access unauthorized',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      taskId: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard metrics & analytics for student
 * @route   GET /api/tasks/stats
 * @access  Private
 */
const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    const tasks = await Task.find({ user: userId });

    const total = tasks.length;
    let completed = 0;
    let pending = 0;
    let inProgress = 0;
    let overdue = 0;

    const priorityCounts = { High: 0, Medium: 0, Low: 0 };
    const subjectCounts = {};

    tasks.forEach((task) => {
      // Status counting
      if (task.status === 'Completed') {
        completed++;
      } else if (task.status === 'In Progress') {
        inProgress++;
      } else {
        pending++;
      }

      // Overdue check (only for non-completed tasks)
      if (task.status !== 'Completed' && new Date(task.dueDate) < now) {
        overdue++;
      }

      // Priority counting
      if (priorityCounts[task.priority] !== undefined) {
        priorityCounts[task.priority]++;
      }

      // Subject counting
      const subj = task.subject || 'General';
      subjectCounts[subj] = (subjectCounts[subj] || 0) + 1;
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Upcoming tasks due within next 72 hours
    const next72Hours = new Date(now.getTime() + 72 * 60 * 60 * 1000);
    const upcomingTasks = tasks
      .filter(
        (t) =>
          t.status !== 'Completed' &&
          new Date(t.dueDate) >= now &&
          new Date(t.dueDate) <= next72Hours
      )
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);

    // Recent activity (latest 5 created/updated)
    const recentTasks = [...tasks]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);

    return res.status(200).json({
      success: true,
      stats: {
        total,
        completed,
        pending,
        inProgress,
        overdue,
        completionRate,
        priorityCounts,
        subjectCounts,
        upcomingTasks,
        recentTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask,
  getTaskStats,
};
