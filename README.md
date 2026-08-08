# IronFit Full-Stack Startup Guide

## Prerequisites
- Java 17 or 23 ✅ (Java 23 detected)
- MySQL 8.0 ✅ (running as service MySQL80)
- Node.js 20+ ✅ (v20 detected)
- Maven (download if not installed, see below)

---

## Step 1: Install Maven (if not installed)
Download from: https://maven.apache.org/download.cgi
Extract to C:\Program Files\Apache\maven\
Add C:\Program Files\Apache\maven\bin to System PATH

---

## Step 2: Configure MySQL Database
Open MySQL Workbench or run:
  mysql -u root -p
  CREATE DATABASE IF NOT EXISTS ironfit_db;

Then set your password in the backend environment:
  - Edit: backend/src/main/resources/application.yml
  - Change DB_PASSWORD default to your actual password:
    password: ${DB_PASSWORD:YOUR_PASSWORD_HERE}

---

## Step 3: Start Backend
  cd backend
  mvn spring-boot:run

The backend will:
  ✅ Create all tables (schema.sql)
  ✅ Insert demo Indian data (data.sql)
  ✅ Start on http://localhost:8080
  ✅ Swagger UI: http://localhost:8080/swagger-ui/index.html

---

## Step 4: Start Frontend (already running)
  cd frontend
  npm install    (already done)
  npm run dev    (running at http://localhost:5173)

---

## Demo Login Accounts
| Role    | Email                | Password     |
|---------|--------------------- |--------------|
| Owner   | owner@ironfit.in     | Password@123 |
| Manager | manager1@ironfit.in  | Password@123 |
| Trainer | trainer11@ironfit.in | Password@123 |
| Member  | tinku@ironfit.in     | Password@123 |

---

## Architecture
Frontend (React/Vite :5173) → REST API → Spring Boot (:8080) → MySQL (:3306)

## API Documentation
http://localhost:8080/swagger-ui/index.html
