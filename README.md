# Project Submission Dashboard

A full-stack project submission and review dashboard built for the Associate Web Instructor hiring task. Students can submit GitHub projects and track their reviews. Mentors can review submissions, while administrators can manage mentors and review projects.

## Features

- Student signup and role-based login (Student, Mentor, Admin)
- Student project submission with validation, duplicate repository prevention, and rate limiting
- Personal submission list with status and reviewer feedback
- Paginated mentor/admin submission dashboard
- Server-side status and text filters
- Approve/reject actions with required reviewer feedback
- Submission statistics by status
- Admin mentor creation, search, status filters, pagination, and account activation/deactivation
- Toast notifications for form and action feedback

## Technology

- **Language:** TypeScript
- **Frontend:** Next.js, React, Tailwind CSS, shadcn/ui components
- **Backend:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT in an HTTP-only cookie, with role-based authorization

## Requirements

- Node.js and npm
- PostgreSQL server
- Git

## Run locally

### 1. Clone the repository

```bash
git clone https://github.com/tashrifmiyaji/project-submission-dashboard.git
cd project-submission-dashboard
```

If you have been given a different repository URL, use that URL in the `git clone` command.

### 2. Create a PostgreSQL database

Start PostgreSQL, then create an empty database. For example, in `psql`:

```sql
CREATE DATABASE project_submission_dashboard;
```

Use your own PostgreSQL username, password, host, port, and database name in the backend connection string below.

### 3. Configure the backend

Create `backend/.env`:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@localhost:5432/project_submission_dashboard
JWT_ACCESS_SECRET=replace_with_a_long_random_secret
ACCESS_TOKEN_TTL_SECONDS=900
ADMIN_NAME=Dashboard Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace_with_a_strong_admin_password
```

Replace the example database password, JWT secret, admin email, and admin password with your own values. Do not commit `.env` files or share their secrets.

Install backend dependencies, generate the Prisma client, apply migrations, and start the API:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

On startup, the backend creates the configured Admin account if no Admin exists yet. Keep this terminal running. The API listens on `http://localhost:5000`.

### 4. Configure the frontend

In a second terminal, create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

Install frontend dependencies and start Next.js:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Create a Student account from the signup page. Sign in as the Admin using the values configured in `backend/.env`; the Admin can create Mentor accounts from the Admin dashboard.

### Useful commands

Run from the corresponding `backend` or `frontend` directory:

```bash
npm run dev
npm run build
```

The backend `dev` command starts the API with file watching. The frontend `dev` command starts Next.js. `npm run build` checks/creates the production build.

## Authentication and roles

After login or signup, the API sets an `accessToken` HTTP-only cookie. Protected requests must send that cookie; browser clients are configured with credentials enabled. The API also includes `accessToken` in the login/signup response body.

| Role | Permissions |
| --- | --- |
| `STUDENT` | Create and view their own submissions |
| `MENTOR` | View/filter submissions, see statistics, and review projects |
| `ADMIN` | All review permissions, plus create/search/filter mentors and change mentor account status |

Access tokens and cookies use the same lifetime, configured by `ACCESS_TOKEN_TTL_SECONDS` (900 seconds / 15 minutes in the example).

## API reference

All endpoints are prefixed with `/api`. The default local base URL is `http://localhost:5000/api`. JSON request bodies should use `Content-Type: application/json`.

### Response format

Most endpoints use this envelope:

```json
{
  "success": true,
  "message": "Request completed",
  "data": {}
}
```

Paginated endpoints also include `meta`:

```json
{
  "success": true,
  "message": "Records retrieved successfully",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

Errors use this shape:

```json
{
  "success": false,
  "message": "A description of the error"
}
```

Common status codes are `400` (validation error), `401` (not authenticated), `403` (role/account not allowed), `404` (not found), `409` (duplicate or already reviewed), `429` (rate limit), and `500` (server error).

### Health

#### `GET /health`

Public. No body, path parameters, or query parameters.

**`200` response**

```json
{
  "success": true,
  "message": "Project Submission Dashboard API is running"
}
```

### Auth

#### `POST /auth/signup`

Public. Creates a Student account and sets the authentication cookie.

**JSON body**

| Field | Type | Rules |
| --- | --- | --- |
| `name` | string | 2–100 characters |
| `email` | string | Valid email, up to 254 characters; normalized to lowercase |
| `password` | string | 8–72 characters |

```json
{
  "name": "Sam Student",
  "email": "sam@example.com",
  "password": "change-me-123"
}
```

**`201` response**

```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "id": "user-id",
      "name": "Sam Student",
      "email": "sam@example.com",
      "role": "STUDENT",
      "isActive": true,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    },
    "accessToken": "jwt-token"
  }
}
```

The response also sets an HTTP-only `accessToken` cookie. Duplicate email returns `409`.

#### `POST /auth/login`

Public. Sets the authentication cookie after successful login.

**JSON body**

| Field | Type | Rules |
| --- | --- | --- |
| `email` | string | Valid email, up to 254 characters |
| `password` | string | Required, up to 72 characters |

```json
{
  "email": "sam@example.com",
  "password": "change-me-123"
}
```

**`200` response:** same `data.user` and `data.accessToken` shape as signup, with message `Login successful`. Invalid credentials return `401`; a deactivated account returns `403`.

#### `POST /auth/logout`

Public. Clears the authentication cookie. No body, path parameters, or query parameters.

**`200` response**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### `GET /auth/me`

Authenticated, any active role. No body, path parameters, or query parameters.

**`200` response**

```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "id": "user-id",
    "name": "Sam Student",
    "email": "sam@example.com",
    "role": "STUDENT",
    "isActive": true,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

#### `PATCH /auth/change-password`

Authenticated, any active role.

**JSON body**

| Field | Type | Rules |
| --- | --- | --- |
| `currentPassword` | string | Required |
| `newPassword` | string | 8–72 characters; must differ from current password |

```json
{
  "currentPassword": "change-me-123",
  "newPassword": "new-password-456"
}
```

**`200` response**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Users / Mentors

All `/users/mentors` endpoints require an authenticated `ADMIN`.

#### `POST /users/mentors`

Creates a Mentor account.

**JSON body:** `name`, `email`, and `password`; validation rules match signup (name 2–100, email valid/up to 254, password 8–72). Example:

```json
{
  "name": "Morgan Mentor",
  "email": "morgan@example.com",
  "password": "mentor-password-123"
}
```

**`201` response:** `data` contains the created Mentor (`id`, `name`, `email`, `role`, `isActive`, `createdAt`, `updatedAt`). Password is never returned. Existing email returns `409`.

#### `GET /users/mentors`

Returns a paginated Mentor list.

**Query parameters**

| Parameter | Type | Default | Rules |
| --- | --- | --- | --- |
| `search` | string | none | Matches name/email; up to 100 characters |
| `isActive` | `"true"` or `"false"` | none | Filter active state |
| `page` | integer | `1` | Minimum `1` |
| `limit` | integer | `10` | `1`–`100` |

Example: `/users/mentors?search=morgan&isActive=true&page=1&limit=10`

**`200` response:** paginated envelope; each `data` item contains `id`, `name`, `email`, `role`, `isActive`, `createdAt`, and `updatedAt`.

#### `PATCH /users/mentors/:mentorId/status`

Changes a Mentor's active state.

**Path parameter:** `mentorId` — Mentor user ID.

**JSON body**

```json
{
  "isActive": false
}
```

**`200` response:** `data` contains the updated Mentor fields listed for `GET /users/mentors`. Nonexistent IDs or IDs that do not belong to Mentors return `404`.

### Submissions

#### `POST /submissions`

Authenticated `STUDENT`. Creates a project submission. Maximum **5 requests per student per 15 minutes**; excess requests return `429`.

**JSON body**

| Field | Type | Rules |
| --- | --- | --- |
| `projectName` | string | 3–150 characters |
| `repositoryUrl` | string | HTTPS GitHub URL with exactly `owner/repository`; canonicalized before save |
| `liveUrl` | string | Valid HTTPS URL |
| `description` | string | 20–5000 characters |

```json
{
  "projectName": "Portfolio Dashboard",
  "repositoryUrl": "https://github.com/student/portfolio-dashboard",
  "liveUrl": "https://portfolio.example.com",
  "description": "A responsive portfolio dashboard built with Next.js and TypeScript."
}
```

**`201` response:** `data` contains `id`, `projectName`, normalized `repositoryUrl`, `liveUrl`, `description`, `status` (`PENDING`), `reviewComment`, `reviewedAt`, `createdAt`, and `updatedAt`.

Submitting the same normalized repository twice for the same student returns `409`.

#### `GET /submissions/my`

Authenticated `STUDENT`. Returns only the current student's submissions.

**Query parameters**

| Parameter | Type | Default | Rules |
| --- | --- | --- | --- |
| `status` | `PENDING`, `APPROVED`, `REJECTED` | none | Optional status filter |
| `search` | string | none | Project name contains this text; up to 150 characters |
| `page` | integer | `1` | Minimum `1` |
| `limit` | integer | `10` | `1`–`100` |

**`200` response:** paginated envelope; `data` items contain the submission fields returned by `POST /submissions`.

#### `GET /submissions`

Authenticated `MENTOR` or `ADMIN`. Returns submissions from all students.

**Query parameters:** same `status`, `search`, `page`, and `limit` fields as `GET /submissions/my`. Filtering and pagination are applied server-side. Search matches project name, student name, or student email.

**`200` response:** paginated envelope; each submission includes `id`, project fields, status/review fields, timestamps, `student` (`id`, `name`, `email`), and `reviewedBy` (the same public user fields, or `null`).

#### `GET /submissions/stats`

Authenticated `MENTOR` or `ADMIN`. No body, path parameters, or query parameters.

**`200` response**

```json
{
  "success": true,
  "message": "Submission statistics retrieved successfully",
  "data": {
    "total": 12,
    "pending": 4,
    "approved": 6,
    "rejected": 2
  }
}
```

### Reviews

#### `PATCH /reviews/:submissionId`

Authenticated `MENTOR` or `ADMIN`. Reviews a pending submission once.

**Path parameter:** `submissionId` — submission ID.

**JSON body**

| Field | Type | Rules |
| --- | --- | --- |
| `status` | `"APPROVED"` or `"REJECTED"` | Required |
| `reviewComment` | string | 5–2000 characters; required for either decision |

```json
{
  "status": "APPROVED",
  "reviewComment": "Great work. The project is clear and works as expected."
}
```

**`200` response:** `data` contains the reviewed submission fields, student (`id`, `name`, `email`), and reviewer (`id`, `name`, `email`, `role`). Missing submission returns `404`; already-reviewed submission returns `409`.

## Postman collection

Import [`postman/project-submission-dashboard.postman_collection.json`](./postman/project-submission-dashboard.postman_collection.json) into Postman.

The collection contains **Health**, **Auth**, **Users - Mentors**, **Submissions**, and **Reviews** folders. Set the collection variable `baseUrl` if the API is not at `http://localhost:5000/api`.

Authentication is cookie-based. After sending Login or Signup, Postman stores the `accessToken` cookie for the API host; send protected requests to the same host so the cookie is included. Use the seeded Admin login for mentor management, a Mentor login for review actions, or a Student login for student submissions. Switch accounts by logging in as the relevant user.

## Repository layout

```text
backend/     Express API, Prisma schema/migrations, admin seed
frontend/    Next.js application
postman/     Postman API collection
```
