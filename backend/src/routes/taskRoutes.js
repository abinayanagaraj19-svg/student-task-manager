const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// All task routes require JWT authentication
router.use(protect);

// Task Collection & Stats routes
router.route('/').get(getTasks).post(createTask);
router.get('/stats', getTaskStats);

// Single Task routes
router.route('/:id').get(getTaskById).put(updateTask).delete(deleteTask);
router.patch('/:id/toggle', toggleTaskStatus);

module.exports = router;
