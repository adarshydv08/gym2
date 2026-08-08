# IronFit — Gym Management (Full-stack)

IronFit is a client-ready gym management platform with role-based portals for OWNER / MANAGER / TRAINER / MEMBER. It combines a React + Vite frontend with a Spring Boot backend and supports persistent MySQL storage or quick local development using an embedded database.

## What’s included
- Owner admin portal with live dashboards, user directory, manager approvals, membership pricing, and landing page settings
- Manager approval queue for pending trainers, members, and manager onboarding
- Trainer creation with specialization, experience, certifications, and bio
- Public appointment booking form and admin review workflow
- Workout plan CRUD, member assignment, payments, and notifications
- JWT authentication and Spring Security role-based access

## Prerequisites
- Java 17 / 21 LTS installed (tested with Java 21)
- Node.js 18+ for the Vite frontend
- MySQL 8+ for persistent storage (recommended)
- Git (recommended)

## Quick start (Windows PowerShell)

### Backend
```powershell
cd backend
$env:JAVA_HOME='C:\Path\To\jdk-21'
$env:PATH="$env:JAVA_HOME\bin;" + $env:PATH
.\mvnw.cmd spring-boot:run
```

The backend starts on `http://localhost:8080` by default.

### Frontend
```powershell
cd frontend
npm install
npm run dev
```

Open the app at `http://localhost:5173`.

### Build for production

Backend:
```powershell
cd backend
.\mvnw.cmd -DskipTests package
java -jar target/*-SNAPSHOT.jar
```

Frontend:
```powershell
cd frontend
npm run build
# optional local preview
npx serve dist
```

## Client-ready demo reset
To deliver a clean client-ready demo, reset your MySQL database and restart the backend so `backend/src/main/resources/data.sql` can reseed fresh data.

The current seed file now clears stale demo records and inserts only approved demo accounts.

### Approved seeded demo accounts
- `owner@ironfit.in`
- `manager1@ironfit.in`
- `trainer1@ironfit.in`
- `tinku@ironfit.in`

> The owner dashboard now shows real database-driven metrics for revenue, attendance, membership growth, and plan distribution.

## Environment variables
Backend configuration can be set via `application.yml` or environment variables:
- `spring.datasource.url` / `DB_URL`
- `spring.datasource.username` / `DB_USERNAME`
- `spring.datasource.password` / `DB_PASSWORD`
- `jwt.secret` / `JWT_SECRET`

If you prefer editing `application.yml` directly, see `backend/src/main/resources/application.yml`.

API summary (selected endpoints)
- `POST /api/auth/login` — authenticate (returns JWT)
- `POST /api/auth/register` — register new user
- `POST /api/appointments` — public appointment request submission
- `GET /api/appointments` — OWNER/MANAGER: list appointment requests
- `PUT /api/appointments/{id}/contacted` — OWNER/MANAGER: mark request contacted
- `DELETE /api/appointments/{id}` — OWNER/MANAGER: delete a request
- `GET /api/trainers` — list all trainers
- `POST /api/trainers` — OWNER/MANAGER: create a new trainer
- `GET /api/membership-plans` — active membership plans
- `PUT /api/membership-plans/{id}` — OWNER: update pricing and visibility
- `PUT /api/settings` — OWNER: update landing page gym details
- `GET /api/users` — OWNER: view registered users
- `GET /api/managers/pending-approvals` — OWNER/MANAGER: pending approval queue
- `PUT /api/managers/users/{userId}/approve` — approve a pending user
- `PUT /api/managers/users/{userId}/reject` — reject a pending user
- Other admin endpoints: `/api/members`, `/api/payments`, `/api/tickets`, `/api/announcements`

Features implemented (high level)
- Role-based authentication & authorization (JWT + Spring Security)
- Public landing page with appointment booking form
- Owner/Manager portal: metrics, member/trainer management, approval workflows, membership pricing updates, and user directory
- Trainer portal: create/delete workout plans, manage assigned classes, and create trainers with specialization and experience metadata
- Workout plan CRUD and persistence
- Appointment request entity + notification creation on create
- React frontend using Vite; structured components and `apiClient` wrapper

Troubleshooting & common commands
- If backend fails to start: confirm `JAVA_HOME` points to a compatible JDK- To reset stale data and reseed a clean client-ready dataset: drop the existing database, recreate it, then restart the backend so `backend/src/main/resources/data.sql` runs fresh.- To re-run DB schema/data (for dev): `backend/src/main/resources/schema.sql` and `data.sql` are executed by the app if configured — check `application.yml`
- To run backend with verbose logs: `.\mvnw.cmd -Dspring-boot.run.profiles=dev spring-boot:run`

Notes about ports and CORS
- Backend default: 8080. Frontend default: 5173. If ports conflict, update `application.yml` or Vite `vite.config.js`.

Resume-ready bullets (pick and tailor 5-8 bullets)
- Built a full-stack gym management app using React (Vite) and Spring Boot; implemented REST APIs, JWT auth, and role-based access controls.
- Designed and implemented appointment-request workflow (public form → persisted `AppointmentRequest` entity → owner/manager review UI).
- Implemented trainer-facing features: workout plan creation, class assignments, and trainer-specific endpoints for business logic.
- Added owner/manager portal features: dashboards, metrics, member/trainer management, announcements, payments summary and appointment handling.
- Modeled domain entities with JPA (members, trainers, classes, workouts, appointments) and wrote migration-ready SQL schema + seed data.
- Improved developer DX by integrating Maven wrapper (`mvnw`) and Vite dev server; documented reproducible run & build steps in README.
- Wrote client-side React components using context-based auth (`AuthContext`), `apiClient` for API calls, and role-based routing (Trainer/Owner/Member portals).
- Wrote and ran backend integration & unit tests with Maven; validated clean `mvnw -q clean test` runs locally.

What you can add to your resume (phrasing suggestions)
- "Full-stack developer — implemented a role-based gym management platform (React, Vite, Spring Boot, MySQL)."
- "Built secure REST APIs with JWT authentication and Spring Security; designed database schema and transactional services."
- "Implemented public booking flow and owner-facing admin portal; improved operational visibility with dashboards and metrics."
- "Led end-to-end feature delivery: requirement → API design → frontend integration → tests → deployment-ready build."

If you'd like, I can:
- run the backend + frontend locally in this environment and verify endpoints, or
- create a `backend/.env.example` and `frontend/.env.example`, or
- add a Docker Compose file to run both services and a local MySQL instance.

---
Updated: August 5, 2026

## Data model & storage locations

This project stores domain data in JPA entities (backend) and persists to SQL tables (schema in `backend/src/main/resources/schema.sql`). Key domain mappings:

- Members
	- Entity: `backend/src/main/java/com/gymmanagement/entity/Member.java`
	- Repository: `backend/src/main/java/com/gymmanagement/repository/MemberRepository.java`
	- Controller / APIs: `backend/src/main/java/com/gymmanagement/controller/MemberController.java`
	- Database table: `members` (see `schema.sql`)
	- Frontend: `frontend/src/components/MemberPortal.jsx` (member dashboard), Owner/Manager portals list members in `frontend/src/components/OwnerPortal.jsx` and `frontend/src/components/ManagerPortal.jsx`

- Trainers
	- Entity: `backend/src/main/java/com/gymmanagement/entity/Trainer.java`
	- Repository: `backend/src/main/java/com/gymmanagement/repository/TrainerRepository.java`
	- Controller / APIs: `backend/src/main/java/com/gymmanagement/controller/TrainerController.java`
	- Database table: `trainers`
	- Frontend: `frontend/src/components/TrainerPortal.jsx`, assignment UI in `OwnerPortal.jsx` and `ManagerPortal.jsx`

- Managers
	- Entity: `backend/src/main/java/com/gymmanagement/entity/Manager.java`
	- Repository: `backend/src/main/java/com/gymmanagement/repository/ManagerRepository.java`
	- Controller / APIs: `backend/src/main/java/com/gymmanagement/controller/ManagerController.java`
	- Database table: `managers`
	- Frontend: `frontend/src/components/ManagerPortal.jsx` and Owner portal manager approvals (`OwnerPortal.jsx`)

- Owners (role)
	- Represented by `User` records with `ROLE_OWNER` in the `roles` / `user_roles` tables
	- User entity: `backend/src/main/java/com/gymmanagement/entity/User.java`
	- Roles & mappings: `backend/src/main/resources/schema.sql` (`roles`, `user_roles`)

- Workout plans
	- Entity: `backend/src/main/java/com/gymmanagement/entity/WorkoutPlan.java`
	- Repository: `backend/src/main/java/com/gymmanagement/repository/WorkoutPlanRepository.java`
	- Controller / APIs: `backend/src/main/java/com/gymmanagement/controller/WorkoutController.java`
	- Database tables: `workout_plans`, `workout_exercises`
	- Frontend: member/trainer portals fetch latest plan via `/api/members/{id}/workout-plan/latest`

- Appointments (public requests)
	- Entity: `backend/src/main/java/com/gymmanagement/entity/AppointmentRequest.java`
	- Repository: `backend/src/main/java/com/gymmanagement/repository/AppointmentRequestRepository.java`
	- Controller / APIs: `backend/src/main/java/com/gymmanagement/controller/AppointmentRequestController.java`
	- Database table: `appointment_requests`
	- Frontend: public booking in `frontend/src/components/PublicWebsite.jsx`; admin UI in `OwnerPortal.jsx`

- Notifications
	- Entity: `backend/src/main/java/com/gymmanagement/entity/Notification.java`
	- Repository: `backend/src/main/java/com/gymmanagement/repository/NotificationRepository.java`
	- Database table: `notifications`
	- Frontend: notification list endpoints are used by portal components to show alerts

If you need a visual diagram or a single CSV/markdown table mapping every file to its table, I can generate that next.

## Demo Login Accounts
| Role    | Email                | Password     |
|---------|--------------------- |--------------|
| Owner   | owner@ironfit.in     | Password@123 |
| Manager | manager1@ironfit.in  | Password@123 |
| Trainer | trainer11@ironfit.in | Password@123 |
| Member  | tinku@ironfit.in     | Password@123 |

IronFit — Full-stack Gym Management Platform (React/Vite | Spring Boot | MySQL)

- Built a secure, role-based gym management application with Owner/Manager/Trainer/Member portals, JWT auth, and fine-grained REST APIs.
- Implemented end-to-end flows: public appointment booking → persisted `AppointmentRequest` → owner/manager review and notifications; trainer workout plan CRUD and member access; trainer assignment and member management.
- Modeled domain using JPA entities and a migration-ready SQL schema (`schema.sql`) including `users`, `members`, `trainers`, `managers`, `workout_plans`, `appointment_requests`, and `notifications`.
- Technologies: React + Vite, Spring Boot, Spring Security (JWT), Maven wrapper, MySQL (or in-memory DB for dev); built with developer DX in mind (wrappers, seed data, clear run instructions).

Suggested resume blurb (copy-paste):

Full-stack developer — implemented IronFit, a role-based gym management platform using React (Vite) and Spring Boot. Built REST APIs with JWT auth and Spring Security, modeled domain with JPA and SQL schema, and delivered owner/trainer/manager/member portals with appointment booking, workout plans, notifications, and admin dashboards.

---
If you'd like, I can also:
- Add a `backend/.env.example` and `frontend/.env.example` with all required env vars, or
- Generate a simple ER diagram and a single-file mapping of entity → table → repo → controller for documentation, or
- Run the backend and frontend builds now and report any errors.
