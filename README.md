# 🎓 StudySync — Student Task Management System (MERN Stack)

A full-stack, responsive web application designed specifically for students to manage coursework, homework assignments, exams, and personal study goals. Built with **React.js**, **Node.js**, **Express.js**, and **MongoDB with Mongoose**, featuring **JWT Authentication**, real-time **Dashboard Analytics**, and advanced **Search & Filtering**.

---

## 🌟 Key Features

### 1. 🔐 User Authentication & Student Profile
- **Secure Registration & Login**: Password hashing with `bcryptjs` and token-based authentication with `jsonwebtoken` (JWT).
- **Student Profile**: Capture student's name, major/degree, and institution.
- **Isolated User Space**: Every student only accesses and manages their own tasks.
- **Demo Mode**: One-click quick-fill button for fast demonstration during internship evaluations.

### 2. 📊 Student Dashboard & Productivity Analytics
- **Summary Metric Cards**: Total Tasks, Pending Tasks, In Progress Tasks, Completed Tasks, and Overdue indicators.
- **Visual Completion Meter**: Real-time academic progress bar calculating `(Completed / Total) * 100%`.
- **Priority Distribution**: Visual color-coded breakdown across High, Medium, and Low priorities.
- **Upcoming Deadlines Spotlight**: Urgent alert widget displaying assignments due in the next 72 hours.

### 3. 📝 Complete Task & Assignment Management (CRUD)
- **Create**: Add task title, detailed description, course/subject (e.g. Computer Science, Mathematics), priority, status, and due date.
- **Read**: Responsive Grid and Compact List view modes.
- **Update**: Modal editor for all fields and instant 1-click status toggle (Pending ⇄ Completed).
- **Delete**: Protected deletion with confirmation modal dialog.

### 4. 🔍 Advanced Search, Filtering & Sorting
- **Live Search**: Debounced search across task titles, descriptions, and subjects.
- **Status Filter**: All, Pending, In Progress, Completed.
- **Priority Filter**: All, High (🔴), Medium (🟡), Low (🟢).
- **Subject Filter**: Filter dynamically by course/subject.
- **Timeframe Filter**: All Time, Due Today, Upcoming, Overdue.
- **Multi-criteria Sorting**: Sort by Due Date (Earliest/Latest), Date Created, Priority, or Title (A-Z).

### 5. 🎨 Modern & Responsive UI/UX
- Built with **Tailwind CSS**, **Lucide Icons**, and Google Font **Plus Jakarta Sans**.
- Accessible modal dialogs with keyboard `Esc` listener and body scroll lock.
- Floating toast notifications for real-time operation feedback.
- Fully responsive across mobile, tablet, and desktop screens.

---

## 🏗️ Project Architecture

```
student-task-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection with diagnostic logging
│   │   ├── controllers/
│   │   │   ├── authController.js     # Signup, Login, Profile endpoints
│   │   │   └── taskController.js     # Task CRUD, search, filter, stats
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT Bearer verification
│   │   │   └── errorMiddleware.js    # Centralized error & 404 handler
│   │   ├── models/
│   │   │   ├── User.js               # Student User Schema
│   │   │   └── Task.js               # Task Schema with indexes
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # /api/auth routes
│   │   │   └── taskRoutes.js         # /api/tasks routes
│   │   └── server.js                 # Express application initialization
│   ├── .env.example                  # Environment configuration template
│   ├── .env                          # Local environment variables
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg               # Application icon
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/               # Navbar, Badge, StatCard, Modal, Toast, ConfirmDialog
│   │   │   ├── tasks/                # TaskCard, TaskList, TaskFormModal, TaskFilters
│   │   │   └── dashboard/            # StatsOverview, ProgressChart, UpcomingDeadlines
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Student authentication state
│   │   │   └── TaskContext.jsx       # Task state, operations & filters
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx         # Signin screen with demo credentials
│   │   │   ├── RegisterPage.jsx      # Signup screen
│   │   │   ├── DashboardPage.jsx     # Dashboard analytics & widgets
│   │   │   ├── TasksPage.jsx         # Full task manager with search & filter
│   │   │   └── NotFoundPage.jsx      # 404 handler
│   │   ├── services/
│   │   │   └── api.js                # Axios HTTP client with JWT interceptor
│   │   ├── utils/
│   │   │   ├── constants.js          # Statuses, priorities, subjects, sort options
│   │   │   └── dateUtils.js          # Date formatters & deadline calculations
│   │   ├── App.jsx                   # React Router with Protected Route guards
│   │   ├── main.jsx                  # React DOM mount point
│   │   └── index.css                 # Tailwind CSS styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   ├── .env
│   └── package.json
│
├── package.json                      # Root workspace helper scripts
└── README.md                         # Documentation & run guide
```

---

## 🚀 Step-by-Step Local Setup & Run Guide

### Prerequisites
- **Node.js**: v18 or higher (tested on Node v20+)
- **MongoDB**: Either local MongoDB Community Server **OR** a free [MongoDB Atlas](https://cloud.mongodb.com) cloud cluster (recommended).

---

### Step 1: Configure Backend Environment Variables

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Open or create `.env` (a ready-to-use `.env` is already configured):
   ```env
   PORT=5000
   NODE_ENV=development
   # Option A: Local MongoDB
   MONGO_URI=mongodb://127.0.0.1:27017/student_task_db
   
   # Option B: MongoDB Atlas (Cloud - Free)
   # MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/student_task_db?retryWrites=true&w=majority

   JWT_SECRET=super_secret_student_task_jwt_key_2026_internship_project
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```

---

### Step 2: Start the Backend Server

```bash
cd backend
npm install
npm run dev
# Or: npm start
```
The backend will launch at: **`http://localhost:5000`**

---

### Step 3: Start the Frontend Application

Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The frontend will launch at: **`http://localhost:5173`**

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new student | No |
| `POST` | `/api/auth/login` | Authenticate student & receive JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated student profile | Yes (`Bearer <token>`) |
| `PUT` | `/api/auth/profile` | Update student profile details | Yes (`Bearer <token>`) |

### Tasks (`/api/tasks`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Get all tasks (supports `search`, `status`, `priority`, `subject`, `timeframe`, `sortBy`) | Yes |
| `POST` | `/api/tasks` | Create a new task | Yes |
| `GET` | `/api/tasks/stats` | Aggregate dashboard analytics & overdue stats | Yes |
| `GET` | `/api/tasks/:id` | Get single task by ID | Yes |
| `PUT` | `/api/tasks/:id` | Update task details | Yes |
| `PATCH`| `/api/tasks/:id/toggle` | Toggle task status (Pending ⇄ Completed) | Yes |
| `DELETE`| `/api/tasks/:id` | Delete a task | Yes |

---

