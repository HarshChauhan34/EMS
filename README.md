# EMS — Event Management System

Full-stack web application for discovering events, booking seats, and managing events as an administrator. The project follows a classic **MERN-style** layout: a **React** SPA talks to a **Node.js** REST API backed by **MongoDB**.

## Features

### For users

- **Account**: Register and log in; JWT stored in `localStorage` and sent on API requests.
- **Events**: Browse events on the home page and open event details (title, description, category, date, location, price, seats).
- **Bookings**: Book seats for an event; view **My Bookings**; cancel bookings when supported by the API.
- **Profile**: Update profile (authenticated).

### For administrators

- **Dashboard**: Aggregated stats (users, events, bookings, revenue from confirmed bookings).
- **Events**: Create, edit, and delete events; optional image upload (JPEG/PNG, stored under `backend/uploads` and served at `/uploads`).
- **Users & bookings**: List users (non-admin), expand to see a user’s confirmed bookings; overview of all bookings for reporting.

> **First admin account**: Registration from the UI always creates a `user`. To get an admin, create a user in MongoDB and set `role` to `"admin"`, or call `POST /api/auth/register` with `role: "admin"` during setup (treat this as a deployment concern in production).

## Tech stack

| Layer    | Technologies |
|----------|----------------|
| Frontend | React 19, React Router 7, Vite 8, Tailwind CSS 4, Axios |
| Backend  | Express 5, Mongoose 9, JWT (`jsonwebtoken`), bcryptjs, Multer (disk storage), CORS |
| Database | MongoDB (via `MONGO_URI`) |

## Repository layout

```
EMS/
├── backend/          # Express API (server.js)
│   ├── config/       # DB connection
│   ├── controllers/
│   ├── middleware/   # auth, admin role, uploads
│   ├── models/       # User, Event, Booking
│   ├── routes/
│   └── uploads/      # Event images (created at runtime)
├── frontend/         # Vite + React app
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── services/ # Axios API client
│       └── routes/   # AdminRoute, etc.
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- A MongoDB instance (e.g. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or local MongoDB)

## Environment variables

### Backend (`backend/.env`)

Create `backend/.env` (do not commit real secrets):

```env
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster.example.mongodb.net/dbname
JWT_SECRET=your_long_random_secret
PORT=5000
```

### Frontend (`frontend/.env`)

Optional; defaults to `http://localhost:5000/api` if unset:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, point `VITE_API_URL` at your deployed API (must include the `/api` path suffix used by this client).

## Local development

### 1. Backend

```bash
cd backend
npm install
npm start
```

API listens on `PORT` (default **5000**). Health check: `GET http://localhost:5000/`.

Ensure `backend/uploads` exists if you use event image uploads (Multer uses `uploads/` as destination).

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Dev server defaults to **http://localhost:5173** (Vite). The API allows this origin in CORS (`backend/server.js`).

### 3. CORS

Allowed origins are configured in `backend/server.js` (e.g. `http://localhost:5173` and a deployed Vercel URL). If you use another frontend URL, add it to `allowedOrigins` there.

## API overview

Base path: `/api` (axios `baseURL` should end with `/api`).

| Method & path | Access | Description |
|---------------|--------|-------------|
| `POST /api/auth/register` | Public | Register |
| `POST /api/auth/login` | Public | Login |
| `PUT /api/auth/profile` | User (JWT) | Update profile |
| `GET /api/events` | Public | List events |
| `GET /api/events/:id` | Public | Event by ID |
| `POST /api/events` | Admin + JWT | Create event (multipart: `image`) |
| `PUT /api/events/:id` | Admin + JWT | Update event (optional `image`) |
| `DELETE /api/events/:id` | Admin + JWT | Delete event |
| `POST /api/bookings` | User + JWT | Create booking |
| `GET /api/bookings/my` | User + JWT | Current user’s bookings |
| `GET /api/bookings` | Admin + JWT | All bookings |
| `PUT /api/bookings/cancel/:id` | User + JWT | Cancel booking |
| `GET /api/dashboard` | Admin + JWT | Dashboard stats |
| `GET /api/admin/users` | Admin + JWT | All users |
| `GET /api/admin/users/:id/bookings` | Admin + JWT | Bookings for a user |

Send `Authorization: Bearer <token>` for protected routes.

## Frontend production build

```bash
cd frontend
npm run build
npm run preview   # optional local preview of dist/
```

The app includes `frontend/vercel.json` with SPA rewrites so client-side routes work on static hosts.

## License

ISC (backend `package.json`). Add or align a root license if you publish the repo.
