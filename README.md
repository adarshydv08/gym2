<div align="center">

# 🏋️‍♂️ IronFit Gym Platform

### **Full-Stack Gym & Fitness Center SaaS Platform — Deployed Live Online 🚀**

[![Live Application](https://img.shields.io/badge/🌐_LIVE_WEBSITE-ironfit--gym--ruddy.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://ironfit-gym-ruddy.vercel.app/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot_3.2-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/DevOps-Docker_Container-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)

<br />

### 🔗 **[👉 Launch Live Web Application 👈](https://ironfit-gym-ruddy.vercel.app/)**

<br />

</div>

---

## 🌟 Executive Showcase

**IronFit** is an enterprise-grade, multi-tenant gym management platform deployed live online. Built to modernize fitness center operations, it connects gym owners, operational managers, trainers, and members into one seamless web application with real-time notifications, dynamic analytics, automated database initialization, class scheduling, and digital invoicing.

### 🌐 **Live Production Deployment Information**
* 🚀 **Live Production Website**: [**https://ironfit-gym-ruddy.vercel.app/**](https://ironfit-gym-ruddy.vercel.app/)
* ⚡ **Cloud Infrastructure**: Frontend deployed on **Vercel Global CDN** | Backend API deployed in **Docker Container on Render** | Production Database powered by **Render PostgreSQL 16**

---

## 🔑 Test Drive the Live App (Demo Accounts)

You can test all 4 role portals directly on the live website **[https://ironfit-gym-ruddy.vercel.app/](https://ironfit-gym-ruddy.vercel.app/)**:

> [!IMPORTANT]  
> **Universal Password for all demo accounts**: `Password@123`

| Role Portal | Email Login | Phone Login | Key Features & Access |
| --- | --- | --- | --- |
| 👑 **Owner (Admin)** | `owner@ironfit.in` | `+91 98765 43210` | Full administrative control, financial revenue analytics, user approvals, gym setting configuration (hours, UPI ID, address). |
| 💼 **Manager** | `manager1@ironfit.in` | `+91 98765 43211` | Member & trainer registration approvals, class schedule creation, attendance tracking, support desk ticket resolution. |
| 🏋️ **Trainer** | `trainer1@ironfit.in` | `+91 98765 43212` | Assigned client roster, client health metric logs, custom workout routine builder with target sets/reps/weights. |
| 💳 **Member** | `tinku@ironfit.in` | `+91 98765 43213` | Digital membership card, active subscription duration, online class booking, assigned workout view, support tickets & billing receipts. |

---

## ✨ Platform Features & Capabilities

### 🌐 Public Visitor Experience
- **Public Landing Showcase**: Facility highlights, trainer catalog, class schedule overview, and active membership plans.
- **Trial Appointment Booking**: Prospective members can request free trial sessions with instant administrative alerts.

### 👑 Owner & Executive Suite
- **Financial Analytics & Growth Reports**: Revenue trends, active membership counters, and plan distribution graphs (via Recharts).
- **User Governance**: Approve or reject new staff and member registrations.
- **Dynamic Configuration**: Update gym contact details, business hours, and UPI payment ID.

### 💼 Manager Operations Desk
- **Onboarding Approvals**: Dedicated queue for member and trainer verification.
- **Group Class Scheduling**: Organize HIIT, Yoga, and Strength sessions with slot tracking.
- **Support Desk**: Manage customer complaints and service inquiries.

### 🏋️ Trainer Coaching Hub
- **Client Management**: Track assigned members, height/weight metrics, and goal progress.
- **Workout Plan Builder**: Craft customized daily routines with detailed exercises, sets, reps, and target weights.

### 💳 Member Portal
- **Digital Passes & Invoices**: View active plan status, remaining days, and automated billing receipts.
- **Class Booking**: Reserve seats in live group classes with real-time slot validation.
- **Personalized Workouts**: Follow trainer-assigned workout regimens step-by-step.

---

## 🏗️ Production Architecture

```
                    +------------------------------------+
                    |  Vercel CDN (Frontend Web App)     |
                    | https://ironfit-gym-ruddy.vercel.app|
                    +------------------------------------+
                                      |
                              (HTTPS / JWT API)
                                      v
                    +------------------------------------+
                    |   Render Docker Web Service (API)  |
                    |   (Spring Boot 3.2 + Security)     |
                    +------------------------------------+
                                      |
                                      v
                    +------------------------------------+
                    |   Render Cloud PostgreSQL 16 DB    |
                    | (Automated DDL Schema & Seeding)   |
                    +------------------------------------+
```

---

## 🛠️ Technology Stack

* **Frontend**: React 18.3, Vite, Lucide React Icons, Recharts, Custom Glassmorphic CSS Engine
* **Backend API**: Java 21, Spring Boot 3.2, Spring Security 6, JWT Authentication, Spring Data JPA
* **Database**: PostgreSQL 16 (Cloud Production) & MySQL 8.0 (Local Development)
* **DevOps & Containers**: Docker, Multi-Stage Builds, Docker Compose, Nginx
* **Cloud Infrastructure**: Vercel (Frontend Global CDN) & Render (Backend Container & Database)

---

## 💻 Local Development Setup (Optional)

If you want to run or inspect the project locally on your machine:

```bash
docker compose up --build
```
- **Frontend App**: `http://localhost`
- **Backend API**: `http://localhost:8080/api`
- **Swagger Docs**: `http://localhost:8080/swagger-ui/index.html`

For full details on the cloud deployment blueprint and local setup, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

---

## 📜 License

Distributed under the [MIT License](LICENSE).
