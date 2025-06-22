// server/routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Admin Routes
// GET all employees (admin only)
router.get('/admin/employees', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const employees = await User.find({ role: 'employee' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Get task counts for each employee
    const employeesWithTasks = await Promise.all(
      employees.map(async (emp) => {
        const tasks = await Task.find({ assignedTo: emp._id });
        const completedTasks = tasks.filter(task => task.status === 'completed');
        
        return {
          ...emp.toObject(),
          tasksCount: tasks.length,
          completedTasks: completedTasks.length
        };
      })
    );

    res.json({
      success: true,
      data: employeesWithTasks
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// GET all tasks (admin only)
router.get('/admin/tasks', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const tasks = await Task.find()
      .populate('assignedTo', 'name username email')
      .populate('assignedBy', 'name username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// POST create new task (admin only)
router.post('/admin/tasks', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const { title, description, assignedTo, endDate, priority } = req.body;

    // Validate required fields
    if (!title || !assignedTo || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Title, assigned employee, and end date are required'
      });
    }

    // Check if assigned user exists and is an employee
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser || assignedUser.role !== 'employee') {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee selected'
      });
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      endDate: new Date(endDate),
      priority: priority || 'medium'
    });

    await task.save();
    
    // Populate the task with user details
    await task.populate('assignedTo', 'name username email');
    await task.populate('assignedBy', 'name username');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Employee Routes
// GET my tasks (employee only)
router.get('/employee/tasks', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employee') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Employee only.'
      });
    }

    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('assignedBy', 'name username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Get employee tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// PUT update task status (employee only)
router.put('/employee/tasks/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employee') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Employee only.'
      });
    }

    const { status } = req.body;
    const taskId = req.params.id;

    // Validate status
    if (!['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Find task and ensure it's assigned to this user
    const task = await Task.findOne({ 
      _id: taskId, 
      assignedTo: req.user._id 
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or not assigned to you'
      });
    }

    task.status = status;
    await task.save();

    // Populate the updated task
    await task.populate('assignedBy', 'name username');

    res.json({
      success: true,
      message: 'Task status updated successfully',
      data: task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// GET task statistics (for overview)
router.get('/stats', auth, async (req, res) => {
  try {
    let stats = {};

    if (req.user.role === 'admin') {
      // Admin stats - all tasks and employees
      const totalEmployees = await User.countDocuments({ role: 'employee' });
      const totalTasks = await Task.countDocuments();
      const completedTasks = await Task.countDocuments({ status: 'completed' });
      const pendingTasks = await Task.countDocuments({ status: 'pending' });
      const highPriorityTasks = await Task.countDocuments({ priority: 'high' });

      stats = {
        totalEmployees,
        totalTasks,
        completedTasks,
        pendingTasks,
        highPriorityTasks
      };
    } else {
      // Employee stats - only their tasks
      const totalTasks = await Task.countDocuments({ assignedTo: req.user._id });
      const completedTasks = await Task.countDocuments({ 
        assignedTo: req.user._id, 
        status: 'completed' 
      });
      const pendingTasks = await Task.countDocuments({ 
        assignedTo: req.user._id, 
        status: 'pending' 
      });
      const highPriorityTasks = await Task.countDocuments({ 
        assignedTo: req.user._id, 
        priority: 'high' 
      });

      stats = {
        totalTasks,
        completedTasks,
        pendingTasks,
        highPriorityTasks
      };
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;