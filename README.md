# 🚀 Secure Task Management Application

> A **production-ready secure multi-user Task Management System** with complete authentication, encryption, and API integration.

## ✨ Key Features

| Feature | Technology | Details |
|---------|-----------|---------|
| 🎨 **Frontend** | Next.js (App Router) | Modern React-based UI in `frontend/` |
| 🖥️ **Backend** | Node.js + Express | RESTful API in `backend/` |
| 💾 **Database** | MongoDB + Mongoose | Scalable document storage |
| 🔐 **Authentication** | JWT | HTTP-only cookies, 1-day expiration |
| 🛡️ **Encryption** | AES-256 + Bcrypt | Task descriptions encrypted, passwords hashed |
| 🔀 **Architecture** | Fully Separated | No Next.js API routes used |

---

## 📑 Quick Navigation

- [🚀 Quick Start](#quick-start)
- [📁 Project Structure](#project-structure)
- [⚙️ Environment Setup](#environment-configuration)
- [📦 Installation & Running](#installation--running-locally)
- [🔌 API Endpoints](#api-overview)
- [🔐 Security Features](#security-implementation)
- [🎯 Frontend Behavior](#frontend-behavior)
- [🌐 Deployment](#deployment-notes)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** and **npm** installed
- **MongoDB** running (local or cloud)
- A code editor (VS Code recommended)

### 30-Second Setup

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (in new terminal)
cd frontend && npm install && npm run dev
```

Then open **http://localhost:3000** in your browser! 🎉

---

## 📁 Project Structure

```
📦 Full Stack Task Manager
├── 📂 backend/                    ← Express API Server
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── 🔧 config/
│       │   └── db.js               (MongoDB connection)
│       ├── 📋 models/
│       │   ├── User.js             (User schema)
│       │   └── Task.js             (Task schema)
│       ├── 🛠️ utils/
│       │   ├── encryption.js       (AES-256 encryption)
│       │   └── jwt.js              (JWT management)
│       ├── 🚨 middleware/
│       │   ├── auth.js             (JWT verification)
│       │   ├── errorHandler.js     (Error management)
│       │   └── validateRequest.js  (Input validation)
│       ├── ✅ validators/
│       │   ├── authValidators.js   (Auth validation rules)
│       │   └── taskValidators.js   (Task validation rules)
│       ├── 🎮 controllers/
│       │   ├── authController.js   (Login/Register logic)
│       │   └── taskController.js   (Task CRUD logic)
│       ├── 🛣️ routes/
│       │   ├── authRoutes.js       (Auth endpoints)
│       │   └── taskRoutes.js       (Task endpoints)
│       ├── app.js                  (Express config & middleware)
│       └── server.js               (Server startup & DB connection)
│
└── 📂 frontend/                   ← Next.js Client
    ├── next.config.mjs
    ├── package.json
    ├── .env.local (optional)
    ├── app/
    │   ├── layout.js               (Root layout)
    │   ├── page.js                 (Redirect to /login)
    │   ├── 🔐 login/page.js        (Login page)
    │   ├── 📝 register/page.js     (Registration page)
    │   └── 📊 dashboard/page.js    (Protected task dashboard)
    ├── components/                 (UI components)
    └── lib/
        └── apiClient.js            (API helper with credentials)
```



## ⚙️ Environment Configuration

### Backend Setup

1️⃣ **Create `.env` file from template:**

```bash
cd backend
cp .env.example .env
```

2️⃣ **Fill in your values in `backend/.env`:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/secure_task_manager

# Security Keys (⚠️ CRITICAL)
JWT_SECRET=your_super_secret_random_jwt_key_here_make_it_long
AES_SECRET=12345678901234567890123456789012           # MUST be exactly 32 chars!

# Frontend URL for CORS
CLIENT_URL=http://localhost:3000
```

### ⚠️ Important Environment Variables

| Variable | Type | Example | Notes |
|----------|------|---------|-------|
| `JWT_SECRET` | String | `abc123xyz...` | Use a long, random string |
| `AES_SECRET` | String | 32 characters exactly | Required for AES-256 encryption (exactly 32 bytes) |
| `CLIENT_URL` | URL | `http://localhost:3000` | Must match your frontend URL for CORS |
| `MONGO_URI` | MongoDB URL | `mongodb://localhost:27017/db` | Local or cloud MongoDB |

### Frontend Setup (Optional)

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

> ℹ️ If not provided, defaults to `http://localhost:5000`

---

## 📦 Installation & Running Locally

### Backend Setup

```bash
cd backend
npm install
npm run dev    # Starts on http://localhost:5000
```

✅ You should see: `Server running on port 5000`

### Frontend Setup

Open **another terminal** and run:

```bash
cd frontend
npm install
npm run dev    # Starts on http://localhost:3000
```

✅ You should see: `▲ Next.js ready in ...`

### ✨ Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

> **⚠️ Important:** Keep both servers running for the full app to work!

---

## 🔌 API Overview

### Base URL
```
http://localhost:5000
```

### Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### 🔑 Auth Endpoints

**Base:** `/api/auth`

#### 📝 Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```
**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": { "userId": "...", "email": "john@example.com" }
}
```

#### 🔓 Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```
**Response:** Sets HTTP-only cookie `token` with JWT
```json
{ "success": true, "message": "Logged in successfully", "data": { "user": {...} } }
```

#### 🚪 Logout
```http
POST /api/auth/logout
(requires authentication)
```

#### 👤 Get Current User
```http
GET /api/auth/me
(requires authentication)
```

---

### 📋 Task Endpoints

**Base:** `/api/tasks` | **🔒 All Protected (Requires Auth)**

#### ✨ Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the full-stack application",
  "status": "Pending"
}
```
**Status options:** `Pending` | `In Progress` | `Completed`

#### 📚 Get All Tasks
```http
GET /api/tasks?page=1&limit=10&status=Pending&search=project
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number for pagination |
| `limit` | number | 10 | Items per page |
| `status` | string | - | Filter by status |
| `search` | string | - | Search by title (case-insensitive) |

**Response:**
```json
{
  "success": true,
  "data": {
    "tasks": [...],
    "totalCount": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

#### 🔍 Get Single Task
```http
GET /api/tasks/:id
```

#### ✏️ Update Task
```http
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "status": "In Progress"
}
```

#### 🗑️ Delete Task
```http
DELETE /api/tasks/:id
```

---

## 🔐 Security Implementation

### 🔒 Password Security
```
🛡️ Algorithm: Bcrypt (SALT_ROUNDS = 10)
✅ Passwords are hashed before saving to database
✅ Never stored in plain text
```

### 🔑 JWT Authentication
| Feature | Configuration |
|---------|---|
| **Signing** | Uses `JWT_SECRET` |
| **Expiration** | 1 day (86,400 seconds) |
| **Storage** | HTTP-only cookie named `token` |
| **Cookie Options** | `httpOnly: true`, `sameSite: "strict"`, `secure: true` (prod) |
| **Access** | Never exposed to JavaScript |

### 🔐 Data Encryption
```
Algorithm: AES-256-CBC
Key Length: 32 bytes (256 bits)
Storage Format: iv:ciphertext (stored in DB)
Target: Task descriptions automatically encrypted on write
        Task descriptions automatically decrypted on read
```

### 🌐 CORS Protection
```javascript
{
  origin: CLIENT_URL,        // Only allow frontend origin
  credentials: true          // Allow cookie transmission
}
```

### ✅ Input Validation
- **Tool:** `express-validator`
- **Method:** Dedicated validator modules for Auth & Tasks
- **Handler:** Central `validateRequest` middleware
- **Response:** Structured JSON errors

### ❌ Error Handling
- **Pattern:** `async/await` with `try/catch`
- **Centralized:** Error handler middleware catches all errors
- **Response:** `{ "success": false, "message": "..." }`

---

## 🎯 Frontend Behavior

### 🔐 Authentication Flow

```
1. User visits http://localhost:3000
   ↓
2. Redirected to /login page
   ↓
3. Enter credentials & submit
   ↓
4. Request sent to POST /api/auth/login
   ↓
5. Backend validates & sets HTTP-only cookie token
   ↓
6. Browser automatically includes cookie in requests
   ↓
7. Redirect to /dashboard
```

### 📊 Protected Dashboard
- ✅ Calls `/api/auth/me` on load to verify authentication
- ❌ If unauthorized → redirects to `/login`
- 🔄 All API calls use `fetch(url, { credentials: "include" })`

### 📝 Task Management Features
- 🆕 **Create** new tasks with title, description, status
- 🔍 **Pagination** (customize page & limit)
- 🏷️ **Filter** by status (Pending, In Progress, Completed)
- 🔎 **Search** by title (case-insensitive)
- ✏️ **Edit** existing tasks
- 🗑️ **Delete** tasks

---

## 🌐 Deployment Notes

### Pre-Deployment Checklist

```bash
✅ Set NODE_ENV=production
✅ Configure production values:
✅ Set MONGO_URI (cloud MongoDB URI)
✅ Generate long random JWT_SECRET
✅ Generate 32-character AES_SECRET
✅ Update CLIENT_URL (deployed frontend URL)
```

### Deployment Requirements

- ✨ Frontend and backend must be able to **forward cookies** across requests
- 🔐 Enable **CORS with credentials** between frontend and backend origins
- 🔌 Both services must be accessible from their respective domains

---

## ✨ What This Project Demonstrates

- 🎯 Clean architecture with **complete separation** between frontend and backend
- 🔐 Strong **authentication & authorization** using JWT
- 🛡️ **Encryption** of sensitive data (AES-256)
- 📊 Advanced **pagination, filtering, and search**
- 🏗️ **Production-ready** configuration and error handling
- 🌐 **CORS with credentials** for secure cross-origin requests

---

## 📚 Technology Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| **Backend Runtime** | Node.js | 14+ |
| **API Framework** | Express.js | 4.x |
| **Frontend Framework** | Next.js | 13+ (App Router) |
| **Database** | MongoDB | 4.x+ |
| **ODM** | Mongoose | 7.x+ |
| **Auth** | JWT | - |
| **Security** | Bcrypt + AES-256 | - |

---

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---
