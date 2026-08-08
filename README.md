# IronFit Gym Management Platform

IronFit is a full-stack gym management system for gym owners, managers, trainers, members, and public visitors. It provides a public gym website, secure role-based portals, membership sales, class management, workout plans, attendance, payments, complaints, announcements, appointments, and notifications.

The project uses React and Vite for the frontend, Spring Boot for the REST API, Spring Security with JWT for authentication, Maven for backend builds, and MySQL 8 for persistent storage.

## Application URLs

| Service | URL |
| --- | --- |
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080/api |
| OpenAPI UI | http://localhost:8080/swagger-ui/index.html |
| MySQL | localhost:3306 |

## Technology Stack

- Frontend: React 19, Vite, JavaScript, Recharts, Framer Motion, Lucide React
- Backend: Java 21 target, Spring Boot 3.2, Spring Web, Spring Data JPA, Spring Security
- Authentication: JWT tokens and BCrypt password hashing
- Database: MySQL 8.0+
- Build tools: Maven Wrapper (`mvnw.cmd`) and npm
- API documentation: Springdoc OpenAPI

## Requirements

- Java JDK 21 or a compatible newer JDK
- Node.js 18 or newer
- npm
- MySQL Server 8 or newer
- Git

The current Windows development setup uses Java 23 successfully. Java 21 LTS is recommended for a consistent team environment.

## Run the Project

### 1. Start MySQL

Make sure the MySQL Windows service is running:

```powershell
Get-Service MySQL80
```

If it is stopped:

```powershell
Start-Service MySQL80
```

The default local database configuration is:

```text
Host:     localhost
Port:     3306
Database: ironfit_db
Username: root
Password: Yadav@9876
```

The application creates the database when permitted by MySQL. The schema and seed scripts run when the backend starts.

### 2. Start the backend

Open a PowerShell terminal and run:

```powershell
cd "C:\Users\adars\OneDrive\Desktop\gym2\gym2\backend"
.\mvnw.cmd spring-boot:run
```

Keep this terminal open. A successful startup ends with a message that Tomcat started on port 8080.

Do not run this command twice. If you see `Port 8080 was already in use`, the backend is already running or another application is using that port.

### 3. Install and start the frontend

Run `npm install` once after cloning, or again only after `package.json` changes or `node_modules` is deleted:

```powershell
cd "C:\Users\adars\OneDrive\Desktop\gym2\gym2\frontend"
npm install
```

Every normal development session requires only:

```powershell
cd "C:\Users\adars\OneDrive\Desktop\gym2\gym2\frontend"
npm run dev
```

Open http://localhost:5173 in a browser. The optional `--host=127.0.0.1` flag is not required for normal local use.

## Demo Accounts

All seeded demo accounts use the password `Password@123`.

| Role | Email | Main access |
| --- | --- | --- |
| Owner | `owner@ironfit.in` | Full administration and reporting |
| Manager | `manager1@ironfit.in` | Operations and approval workflows |
| Trainer | `trainer1@ironfit.in` | Classes, members, and workout plans |
| Member | `tinku@ironfit.in` | Membership, classes, workouts, payments, and support |

Use the email or phone number as the login identifier.

## Public Website

Visitors can use the landing page without signing in to:

- View the gym brand, facilities, services, trainers, classes, testimonials, and contact information
- Review active membership plans and pricing
- Submit an appointment request with name, email, phone, preferred service, date, time, and message
- Receive a success or error response after submitting a request
- Open the login and registration flow

Appointment requests are stored in MySQL and create a notification for the appropriate administrative users.

## Owner Portal

The owner has complete administrative control over the gym:

- View dashboard metrics for revenue, attendance, memberships, users, classes, and plan distribution
- Review revenue trends and membership growth charts
- View the user directory and role/status information
- Approve or reject pending member, trainer, and manager registrations
- Approve manager records created through the manager workflow
- Create and manage trainers with specialization, experience, certifications, bio, rating, and monthly rate
- View and manage members, membership status, membership numbers, and trainer assignments
- Create, update, activate, deactivate, and price membership plans
- Review successful payments and payment history
- Review public appointment requests, reply to requests, mark them contacted, and delete requests
- Review and manage complaints and their messages
- Create and manage announcements for gym users
- Update gym settings shown on the public website, including name, logo, address, phone, email, hours, holidays, and UPI ID
- View notifications and administrative activity

## Manager Portal

Managers handle day-to-day gym operations:

- View operational dashboard metrics
- Review the pending approval queue
- Approve or reject eligible member and trainer accounts
- View members and trainers
- Assign trainers to members
- View classes, class schedules, and attendance information
- Review appointment requests and mark them contacted
- Manage complaints and operational feedback
- View announcements, payments, and notifications according to their permissions

## Trainer Portal

Trainers manage coaching and assigned member work:

- View their trainer profile, specialization, experience, certifications, and rating
- View assigned members and member status
- View assigned classes and schedules
- Create workout plans for members
- Add exercises with sets, repetitions, weight, rest time, and workout day
- Update or delete workout plans and exercises
- Review member workout access and trainer feedback workflows
- Receive regular operational notifications

Approval request notifications are not shown in the trainer notification panel.

## Member Portal

Members can manage their gym activity from one portal:

- View dashboard summary, membership status, days remaining, attendance, classes, and workout information
- Purchase an active membership plan using the available payment-method options
- View membership history and payment history
- View payment amount, method, status, transaction ID, and invoice information
- Browse active classes and book classes when an active membership exists
- View booked classes and booking status
- View attendance records and check-in/check-out details
- View the latest assigned workout plan and exercise details
- View trainer and manager feedback
- Update profile information such as address, emergency contact, height, weight, and blood group
- Raise support complaints/tickets and review ticket status and messages
- Read relevant announcements and notifications

Approval request notifications are not shown in the member notification panel. Notifications can be removed from the panel after the user completes them.

## Registration and Approval Workflow

1. A visitor registers as a member, trainer, or manager.
2. The account is stored with the appropriate role and pending status when approval is required.
3. The owner or manager sees the request in the approval queue, subject to role permissions.
4. The authorized administrator approves or rejects the request.
5. Approved users can sign in and access their role portal.
6. Rejected or pending users receive the appropriate access response from authentication.

Owner and manager accounts retain approval notifications. Member and trainer approval notifications are filtered from their notification lists and unread counts.

## Membership and Payment Workflow

1. A member opens the Membership section.
2. The frontend loads active plans from `/api/membership-plans`.
3. The member selects a plan and payment method.
4. The backend validates the member and plan.
5. A membership is created with start date, end date, status, and amount paid.
6. A successful payment record is created with a transaction ID.
7. An invoice record is created for the payment.
8. The member portal reloads membership and payment data.

The current application records successful local/demo payments. It does not connect to a real payment gateway.

## Database and SQL Files

Database configuration is in `backend/src/main/resources/application.yml`.

- `backend/src/main/resources/schema.sql`: table definitions and relationships
- `backend/src/main/resources/data.sql`: demo roles, users, plans, memberships, classes, attendance, workouts, payments, complaints, announcements, notifications, and gym settings

Important tables include:

| Area | Tables |
| --- | --- |
| Authentication | `users`, `roles`, `user_roles` |
| People | `members`, `trainers`, `managers` |
| Membership | `membership_plans`, `memberships` |
| Classes | `classes`, `class_bookings`, `attendance` |
| Coaching | `workout_plans`, `workout_exercises` |
| Finance | `payments`, `invoices` |
| Operations | `appointment_requests`, `complaints`, `complaint_messages` |
| Communication | `announcements`, `notifications` |
| Configuration | `gym_settings` |

The backend uses `spring.jpa.hibernate.ddl-auto=update` and SQL initialization mode `always`. Do not use the demo seed configuration against production data because the seed script clears and recreates demo records.

## Configuration Overrides

Environment variables can override the defaults in `application.yml`:

```powershell
$env:DB_HOST = "localhost"
$env:DB_PORT = "3306"
$env:DB_NAME = "ironfit_db"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "your-password"
$env:JWT_SECRET = "your-long-secret"
$env:PORT = "8080"
```

The frontend API base URL can be changed with `VITE_API_BASE_URL`:

```text
VITE_API_BASE_URL=http://localhost:8080/api
```

## API Overview

All protected endpoints require a JWT bearer token returned by `/api/auth/login`.

### Authentication

- `POST /api/auth/login`: authenticate by email or phone
- `POST /api/auth/register`: register a new account
- `GET /api/auth/me`: restore the current authenticated session

### Public and website data

- `GET /api/settings`: public gym settings
- `GET /api/membership-plans`: active membership plans
- `GET /api/trainers`: trainer listings
- `GET /api/classes`: class listings
- `POST /api/appointments`: submit a public appointment request

### Administration

- `GET /api/users`: user directory
- `GET /api/managers/pending-approvals`: pending approval queue
- `PUT /api/managers/users/{userId}/approve`: approve a user
- `PUT /api/managers/users/{userId}/reject`: reject a user
- `GET /api/appointments`: list appointment requests
- `PUT /api/appointments/{id}/contacted`: mark an appointment contacted
- `POST /api/appointments/{id}/reply`: reply to an appointment request
- `DELETE /api/appointments/{id}`: delete an appointment request
- `PUT /api/membership-plans/{id}`: update a membership plan
- `PUT /api/settings`: update gym settings

### Member services

- `GET /api/members/{id}`: member profile
- `GET /api/memberships/member/{memberId}/active`: active membership
- `GET /api/memberships/member/{memberId}`: membership history
- `POST /api/memberships/purchase`: purchase a membership and create payment/invoice records
- `GET /api/payments/member/{memberId}`: member payment history
- `POST /api/classes/{classId}/book?memberId={memberId}`: book a class
- `GET /api/classes/bookings/member/{memberId}`: member bookings
- `GET /api/attendance/member/{memberId}`: attendance records
- `GET /api/workouts/member/{memberId}`: member workouts
- `GET /api/members/{memberId}/workout-plan/latest`: latest workout plan
- `POST /api/tickets`: create a complaint/support ticket
- `GET /api/tickets/member/{memberId}`: member tickets

### Notifications

- `GET /api/notifications/user/{userId}`: user notifications
- `GET /api/notifications/user/{userId}/unread-count`: unread notification count
- `PUT /api/notifications/{id}/read`: mark a notification read
- `DELETE /api/notifications/{id}`: remove a completed notification

## Production Build

Build the backend:

```powershell
cd "C:\Users\adars\OneDrive\Desktop\gym2\gym2\backend"
.\mvnw.cmd -DskipTests package
java -jar target\ironfit-backend-1.0.0.jar
```

Build the frontend:

```powershell
cd "C:\Users\adars\OneDrive\Desktop\gym2\gym2\frontend"
npm run build
```

The generated frontend files are placed in `frontend/dist`.

## Troubleshooting

### `not a git repository`

Run Git commands from the repository root, not the parent folder:

```powershell
cd "C:\Users\adars\OneDrive\Desktop\gym2\gym2"
git status
```

### `Port 8080 was already in use`

The backend is already running, or another process owns the port. Check it with:

```powershell
Get-NetTCPConnection -State Listen -LocalPort 8080
```

Use the existing backend, or stop the owning process before restarting Spring Boot.

### Maven Wrapper errors

Run the command from `backend` and confirm Java is installed:

```powershell
java -version
cd "C:\Users\adars\OneDrive\Desktop\gym2\gym2\backend"
.\mvnw.cmd spring-boot:run
```

### Database connection errors

Check that MySQL80 is running, that `ironfit_db` exists, and that the credentials in `application.yml` or environment variables are correct.

### Frontend API errors

Confirm the backend is running on port 8080 and that the frontend is using:

```text
http://localhost:8080/api
```

Clear an expired browser session by signing out or removing the `ironfit_token` and `ironfit_user` entries from local storage.

## Repository Structure

```text
gym2/
├── backend/
│   ├── src/main/java/com/gymmanagement/
│   │   ├── controller/      REST controllers
│   │   ├── dto/             API request and response objects
│   │   ├── entity/          JPA database entities
│   │   ├── repository/      Spring Data repositories
│   │   ├── security/        JWT and Spring Security configuration
│   │   └── service/         Business logic
│   ├── src/main/resources/
│   │   ├── application.yml  Runtime configuration
│   │   ├── schema.sql       Database schema
│   │   └── data.sql         Demo seed data
│   ├── mvnw.cmd              Maven Wrapper for Windows
│   └── pom.xml               Maven dependencies and build config
├── frontend/
│   ├── src/api/              API client
│   ├── src/components/       Public website and role portals
│   ├── src/context/          Authentication and toast state
│   ├── App.jsx               Application routing and layout
│   └── package.json           Frontend scripts and dependencies
└── README.md
```

## Git Workflow

The repository root is:

```text
C:\Users\adars\OneDrive\Desktop\gym2\gym2
```

Use this folder for Git commands:

```powershell
cd "C:\Users\adars\OneDrive\Desktop\gym2\gym2"
git status
git add .
git commit -m "Describe the change"
git push origin main
```

Before committing, run the relevant backend compile and frontend build commands and review `git diff`.
