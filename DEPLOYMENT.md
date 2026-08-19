# 🚀 Complete 100% Free Online Deployment Guide

This guide will take you step-by-step through deploying your **IronFit Gym Management Platform** online **100% free with no credit card required**.

---

## 🏗️ Deployment Overview

| Service | Platform | Cost | Setup Time |
| --- | --- | --- | --- |
| **Code Hosting** | [GitHub](https://github.com) | **$0 / Free** | ~3 mins |
| **Frontend** | [Vercel](https://vercel.com) | **$0 / Free** | ~2 mins |
| **Backend API** | [Render](https://render.com) | **$0 / Free** | ~5 mins |
| **Database** | [Render Postgres](https://render.com) or [Aiven MySQL](https://aiven.io) | **$0 / Free** | ~2 mins |

---

## Step 1: Push Your Code to GitHub

1. Go to [github.com](https://github.com) and click **Sign Up** (if you don't have an account).
2. Click the **`+`** icon in the top right -> **New repository**.
3. Name it `ironfit-gym-platform` and click **Create repository**.
4. Run the following commands in your terminal to push your project:

```powershell
git init
git add .
git commit -m "Initial commit with production deployment files"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/ironfit-gym-platform.git
git push -u origin main
```

---

## Step 2: Deploy Backend & Database on Render (Free)

1. Go to [render.com](https://render.com) and click **Get Started for Free** -> **Sign in with GitHub**.
2. Click **New +** in the top navigation bar -> Select **Blueprints**.
3. Connect your `ironfit-gym-platform` repository.
4. Render will automatically detect the `render.yaml` file in your repository!
5. Click **Apply**.

Render will automatically create:
- A free **PostgreSQL Database** (`ironfit-postgres`)
- A free **Spring Boot Backend Web Service** (`ironfit-backend`)

Once deployment finishes, copy your backend public URL (e.g. `https://ironfit-backend-xxxx.onrender.com`).

---

## Step 3: Deploy Frontend on Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and click **Sign Up** -> **Continue with GitHub**.
2. Click **Add New...** -> **Project**.
3. Import your `ironfit-gym-platform` repository.
4. In the configuration window:
   - **Root Directory**: Click Edit and select `frontend`.
   - **Framework Preset**: Vite (detected automatically).
   - **Environment Variables**:
     - Name: `VITE_API_BASE_URL`
     - Value: `https://ironfit-backend-xxxx.onrender.com/api` *(replace with your Render backend URL)*
5. Click **Deploy**.

Vercel will compile your app and give you a live production link like `https://ironfit-gym-platform.vercel.app`! 🎉

---

## 🛠️ Alternative: Manual Step-by-Step Backend Deploy on Render

If you prefer to deploy manually without Render Blueprints:

1. **Create Free Database on Render**:
   - Go to **Dashboard** -> **New +** -> **PostgreSQL**.
   - Name: `ironfit-db`
   - Plan: **Free**
   - Click **Create Database**.
   - Copy the **Internal Database URL** or individual Host, Database, User, Password fields.

2. **Create Free Web Service for Backend**:
   - Go to **Dashboard** -> **New +** -> **Web Service**.
   - Connect your GitHub repo.
   - Settings:
     - **Name**: `ironfit-backend`
     - **Region**: Oregon (or nearest)
     - **Root Directory**: `backend`
     - **Runtime**: **Docker**
     - **Docker Command / File**: `Dockerfile`
   - **Environment Variables**:
     - `PORT` = `8080`
     - `JWT_SECRET` = `IronFitGymManagementPlatformSuperSecretJWTKey2026RoorkeeUttarakhand`
     - `DB_HOST` = *(from your Render Postgres details)*
     - `DB_PORT` = `5432`
     - `DB_NAME` = `ironfit_db`
     - `DB_USERNAME` = *(from Render Postgres details)*
     - `DB_PASSWORD` = *(from Render Postgres details)*
     - `DB_DRIVER` = `org.postgresql.Driver`
     - `DB_DIALECT` = `org.hibernate.dialect.PostgreSQLDialect`
   - Click **Create Web Service**.

---

## 🧪 Local Production Test (Docker Compose)

Before deploying to the web, you can test the exact production environment locally on your PC:

```powershell
docker compose up --build
```

Access the full stack locally at:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/api
- **OpenAPI Docs**: http://localhost:8080/swagger-ui/index.html

---

## 🔑 Demo Login Accounts

Once deployed, your online site comes pre-seeded with these demo credentials:

| Role | Email | Password |
| --- | --- | --- |
| **Owner (Admin)** | `owner@ironfit.in` | `Password@123` |
| **Manager** | `manager@ironfit.in` | `Password@123` |
| **Trainer** | `trainer@ironfit.in` | `Password@123` |
| **Member** | `member@ironfit.in` | `Password@123` |
