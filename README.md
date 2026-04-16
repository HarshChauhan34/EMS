# EMS (Event Management System)

Full-stack MERN-style project with role-based workflows:

- `user`: browse and book events
- `organizer`: create/manage own events (after admin approval)
- `admin`: manage users, organizers, bookings, and events

Frontend is a React + Vite SPA, backend is an Express API with MongoDB.

## Project analysis

### Architecture summary

- Frontend: `frontend/` (React 19, React Router 7, Tailwind CSS 4, Axios, Framer Motion)
- Backend: `backend/` (Express 5, Mongoose 9, JWT auth, bcrypt, Nodemailer, Cloudinary upload)
- Database: MongoDB
- Auth: JWT in `Authorization: Bearer <token>`
- Storage: user session in `localStorage` (`user` object with token and role)

### Core business flow

1. User or organizer registers.
2. Organizer registration is stored as `pending` and cannot login until admin approval.
3. Approved organizer creates events (with image upload).
4. User books seats; available seats are reduced.
5. User can cancel booking; seats are restored.
6. Admin can approve/reject organizers and delete users (with related cleanup).

### Roles and permissions

- Public:
  - List events
  - Event details
  - Register/login
  - Forgot/reset password
- User:
  - Book event
  - View/cancel own bookings
  - Update profile
- Organizer (approved only):
  - Create/update own events
  - Delete own events
  - View organizer dashboard
- Admin:
  - View all users/bookings/events/organizers
  - Approve/reject organizer requests
  - Delete users (with bookings/events cleanup)
  - Delete any event

## Repository structure

```text
EMS/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth, roles, upload adapters
│   ├── models/          # User, Event, Booking schemas
│   ├── routes/          # API route modules
│   ├── utils/           # JWT + email helpers
│   └── server.js        # App bootstrap
├── frontend/
│   ├── src/
│   │   ├── pages/       # Auth, public, user, organizer, admin pages
│   │   ├── components/  # Reusable UI (Navbar, EventCard)
│   │   ├── services/    # Axios client and API service wrappers
│   │   ├── routes/      # Route guards by role
│   │   └── layouts/     # Admin/Organizer shell layouts
│   └── vercel.json      # SPA rewrite rule
└── README.md
```

## Tech stack

| Layer | Stack |
|---|---|
| Frontend | React 19, Vite 8, React Router 7, Tailwind CSS 4, Axios, Framer Motion |
| Backend | Node.js, Express 5, Mongoose 9, JWT, bcryptjs, Multer, Cloudinary, Nodemailer, MJML |
| Database | MongoDB |

## Environment variables

Create `backend/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>
JWT_SECRET=replace_with_secure_secret
PORT=5000

# optional but recommended
FRONTEND_URL=http://localhost:5173
EXPOSE_RESET_LINK=true
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=your_sender_email

# required if organizer uploads event images
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Important: frontend default fallback in code is a deployed API URL (`https://ems-4-dflv.onrender.com/api`).  
For local dev, set `VITE_API_URL` explicitly.

## Local setup

### 1) Backend

```bash
cd backend
npm install
npm start
```

Runs on `http://localhost:5000` (or `PORT`).

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on Vite dev server (typically `http://localhost:5173`).

## API overview

Base path: `/api`

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `PUT /auth/profile` (protected)
- `GET /auth/me` (protected)

### Events

- `GET /events` (public; organizer effectively sees own events when authenticated)
- `GET /events/:id`
- `POST /events` (approved organizer only; multipart `image`)
- `PUT /events/:id` (approved organizer only; own event)
- `DELETE /events/:id` (admin or approved organizer; organizer only own event)

### Bookings

- `POST /bookings` (user only)
- `GET /bookings/my` (user)
- `GET /bookings` (admin)
- `PUT /bookings/cancel/:id` (booking owner)

### Admin

- `GET /admin/users`
- `DELETE /admin/users/:id`
- `GET /admin/users/:id/bookings`
- `GET /admin/organizers`
- `GET /admin/organizers/pending`
- `PUT /admin/organizers/:id/approve`
- `PUT /admin/organizers/:id/reject`

### Dashboard

- `GET /dashboard` (admin)

## Frontend routes

- Public: `/`, `/event/:id`, `/login`, `/register`, `/forgot-password`, `/reset-password/:token`
- User: `/my-bookings`, `/profile`
- Admin: `/admin`, `/admin/users`, `/admin/organizers`
- Organizer: `/organizer`, `/organizer/create-event`, `/organizer/edit-event/:id`

## Data models (high level)

- `User`: name, email, password, role, organizer approval status, block flag, password reset fields
- `Event`: title, description, category, date, location, price, seats, image, createdBy, organizerName
- `Booking`: user, event, seatsBooked, totalAmount, paymentStatus, bookingStatus

## Deployment notes

- Frontend includes `frontend/vercel.json` SPA rewrite:
  - `/(.*)` -> `/index.html`
- Backend serves static `/uploads` path (legacy/local image handling), but current event image flow uses Cloudinary middleware.
- CORS middleware currently allows all origins (`origin: "*"`) and no credentials.

## Current implementation notes

- Admin signup is not exposed via register flow; create first admin directly in MongoDB by setting `role: "admin"` on a user.
- Organizer create/update routes expect image upload support; configure Cloudinary env values.
- No automated tests are present yet (`backend` test script is placeholder).

## Suggested next improvements

1. Add a root `docker-compose` for one-command local startup.
2. Add integration tests for auth, booking, and organizer approval workflows.
3. Tighten CORS and add rate-limiting for auth endpoints.
4. Add seed script for first admin user.
