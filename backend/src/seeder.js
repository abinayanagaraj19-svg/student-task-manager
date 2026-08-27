const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Task = require('./models/Task');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('\x1b[33m[Seeder] Cleaning existing demo data...\x1b[0m');
    await User.deleteMany({ email: 'alex.student@university.edu' });

    console.log('\x1b[34m[Seeder] Creating demo student account...\x1b[0m');
    const demoUser = await User.create({
      name: 'Alex Rivera',
      email: 'alex.student@university.edu',
      password: 'password123',
      major: 'Computer Science & Software Engineering',
      institution: 'Metropolitan Tech University',
      avatarColor: '#4f46e5',
    });

    const now = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;

    console.log('\x1b[34m[Seeder] Inserting sample coursework tasks...\x1b[0m');
    const sampleTasks = [
      {
        user: demoUser._id,
        title: 'Implement Dijkstra’s Algorithm in Python',
        description: 'Complete Lab 4 assignment for Data Structures course. Include time & space complexity analysis.',
        subject: 'Data Structures & Algorithms',
        priority: 'High',
        status: 'In Progress',
        dueDate: new Date(now.getTime() + 1 * oneDayMs), // Tomorrow
        isImportant: true,
      },
      {
        user: demoUser._id,
        title: 'Design REST API for E-Commerce Backend',
        description: 'Build Express routes, Mongoose schemas, and integrate JWT auth for final term project.',
        subject: 'Web Development',
        priority: 'High',
        status: 'Pending',
        dueDate: new Date(now.getTime() + 2 * oneDayMs),
        isImportant: true,
      },
      {
        user: demoUser._id,
        title: 'Linear Algebra Problem Set 5',
        description: 'Matrix diagonalization and Eigenvalues problems from Chapter 6 (exercises 12 to 24).',
        subject: 'Mathematics',
        priority: 'Medium',
        status: 'Completed',
        dueDate: new Date(now.getTime() - 2 * oneDayMs),
        completedAt: new Date(now.getTime() - 1 * oneDayMs),
      },
      {
        user: demoUser._id,
        title: 'Prepare Chapter 3 Slides for Seminar',
        description: 'Prepare a 10-minute presentation on Operating Systems Process Scheduling algorithms.',
        subject: 'Operating Systems',
        priority: 'Medium',
        status: 'Pending',
        dueDate: new Date(now.getTime() + 4 * oneDayMs),
        isImportant: false,
      },
      {
        user: demoUser._id,
        title: 'Neural Networks Loss Functions Paper Summary',
        description: 'Read and summarize the assigned arXiv paper on cross-entropy vs focal loss for classification.',
        subject: 'Artificial Intelligence',
        priority: 'Low',
        status: 'Completed',
        dueDate: new Date(now.getTime() - 4 * oneDayMs),
        completedAt: new Date(now.getTime() - 3 * oneDayMs),
      },
    ];

    await Task.insertMany(sampleTasks);

    console.log('\x1b[32m[Seeder Success] Demo student and 5 sample tasks successfully seeded!\x1b[0m');
    console.log('Demo Login:');
    console.log('  Email:    alex.student@university.edu');
    console.log('  Password: password123');
    process.exit(0);
  } catch (error) {
    console.error('\x1b[31m[Seeder Error]\x1b[0m', error.message);
    process.exit(1);
  }
};

seedData();
