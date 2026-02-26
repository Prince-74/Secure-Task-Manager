## Secure Task Management Application

This project is a **production-ready secure multi-user Task Management System** built with:

- **Frontend**: Next.js (App Router) in the `frontend/` folder
- **Backend**: Node.js + Express in the `backend/` folder
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT stored in HTTP-only cookies
- **Security**: Bcrypt password hashing and AES-256 encryption for task descriptions

Frontend and backend are fully separated; **no Next.js API routes are used**.

---

### 1. Project Structure

- **root/**
  - **backend/** – Express API server
    - `src/config/db.js` – MongoDB connection
    - `src/models/User.js`, `src/models/Task.js` – Mongoose models
    - `src/utils/encryption.js` – AES-256 task description encryption/decryption
    - `src/utils/jwt.js` – JWT generation/verification and cookie options
    - `src/middleware/auth.js` – JWT auth middleware
    - `src/middleware/errorHandler.js` – centralized error handling
    - `src/middleware/validateRequest.js` – express-validator result handler
    - `src/validators/*.js` – auth and task input validation
    - `src/controllers/*.js` – auth and task controllers
    - `src/routes/authRoutes.js`, `src/routes/taskRoutes.js` – routing only
    - `src/app.js` – Express app, CORS, middleware, routes
    - `src/server.js` – server bootstrap + DB connection
    - `.env.example` – environment template
  - **frontend/** – Next.js App Router client
    - `app/layout.js` – root layout
    - `app/page.js` – redirect to `/login`
    - `app/login/page.js` – login page
    - `app/register/page.js` – registration page
    - `app/dashboard/page.js` – protected dashboard with task CRUD
    - `lib/apiClient.js` – fetch helper with `credentials: "include"`

---

### 2. Environment Configuration

Copy the backend example env file and fill your values:

```bash
cd backend
cp .env.example .env
```

`backend/.env`:

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/secure_task_manager
JWT_SECRET=your_jwt_secret_here
AES_SECRET=your_32_char_strong_secret_here
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

- **`JWT_SECRET`**: long random string used to sign JWTs.
- **`AES_SECRET`**: must be **exactly 32 characters** (32 bytes) to satisfy AES-256 key size.
- **`CLIENT_URL`**: the base URL of the Next.js app; used for CORS with credentials.

For the frontend, you can optionally configure the API base URL:

`frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

If not provided, the frontend defaults to `http://localhost:5000`.

---

### 3. Installation & Running Locally

**Backend**

```bash
cd backend
npm install
npm run dev   # starts Express on PORT (default 5000)
```

**Frontend**

```bash
cd frontend
npm install
npm run dev   # starts Next.js on http://localhost:3000
```

Ensure both servers are running for the full app to work.

---

### 4. API Overview

Base URL (backend): `http://localhost:5000`

All responses use the structure:

```json
{ "success": true | false, "message": "Description", ... }
```

#### Auth Routes (`/api/auth`)

- **POST** `/api/auth/register`
  - Body: `{ "name": string, "email": string, "password": string }`
  - Hashes password with bcrypt, generates JWT, sets HTTP-only cookie.
- **POST** `/api/auth/login`
  - Body: `{ "email": string, "password": string }`
  - Validates credentials, generates JWT, sets HTTP-only cookie.
- **POST** `/api/auth/logout`
  - Clears the JWT cookie (protected; requires auth).
- **GET** `/api/auth/me`
  - Returns current user info based on JWT from cookie.

#### Task Routes (`/api/tasks`) – All **protected**

Cookie with valid JWT must be present.

- **POST** `/api/tasks`
  - Body: `{ "title": string, "description": string, "status"?: "Pending" | "In Progress" | "Completed" }`
  - Description is encrypted with AES-256 before storage.
- **GET** `/api/tasks`
  - Query:
    - `page` (number, default 1)
    - `limit` (number, default 10)
    - `status` (one of `"Pending"`, `"In Progress"`, `"Completed"`)
    - `search` (case-insensitive title search)
  - Returns decrypted descriptions and pagination metadata.
- **GET** `/api/tasks/:id`
  - Returns a single task owned by the authenticated user.
- **PUT** `/api/tasks/:id`
  - Body may include any of: `title`, `description`, `status`.
  - Updates and re-encrypts description if changed.
- **DELETE** `/api/tasks/:id`
  - Deletes the specified task owned by the user.

All task queries internally filter by `userId` from the JWT to enforce authorization.

---

### 5. Security Implementation

- **Passwords**
  - Hashed with **bcrypt** (`SALT_ROUNDS = 10`) before saving.
- **JWT**
  - Signed with `JWT_SECRET`.
  - Expiration: **1 day**.
  - Stored in an **HTTP-only cookie** named `token` with:
    - `httpOnly: true`
    - `sameSite: "strict"`
    - `secure: true` in production
- **Task Description Encryption**
  - Uses **AES-256-CBC** with a 32-byte key from `AES_SECRET`.
  - Stores as `iv:ciphertext` in the DB.
  - Decrypted on read before JSON responses.
- **CORS**
  - Enabled with credentials:
    - `origin: CLIENT_URL`
    - `credentials: true`
- **Input Validation**
  - Uses `express-validator` with dedicated validator modules.
  - Central `validateRequest` middleware converts validation errors into structured JSON.
- **Error Handling**
  - Controllers use `async/await` and `try/catch`.
  - Central `errorHandler` middleware returns:
    ```json
    { "success": false, "message": "Error message" }
    ```

---

### 6. Frontend Behavior

- **Authentication Flow**
  - `/login` and `/register` send requests to `/api/auth/login` and `/api/auth/register`.
  - On success, user is redirected to `/dashboard`.
  - JWT cookie is managed entirely by the browser and never exposed to JS.
- **Protected Dashboard**
  - `/dashboard` calls `/api/auth/me` on load; if unauthorized, redirects to `/login`.
  - All API calls use:
    ```js
    fetch(API_URL, { credentials: "include" });
    ```
- **Task Management**
  - Create, edit, and delete tasks from the dashboard UI.
  - Supports:
    - Pagination (`page`, `limit`)
    - Filter by status
    - Case-insensitive search by title

---

### 7. Deployment Notes

- Set `NODE_ENV=production` and provide production values for:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `AES_SECRET` (still 32 chars)
  - `CLIENT_URL` (your deployed frontend URL)
- Ensure your deployment platform allows:
  - **Forwarding cookies** across frontend and backend
  - **CORS with credentials** between the two origins if they differ

The application demonstrates:

- Clean separation between frontend and backend
- Strong authentication and authorization
- AES-256 encryption of sensitive task data
- Pagination, filtering, and search
- Production-minded configuration and error handling

