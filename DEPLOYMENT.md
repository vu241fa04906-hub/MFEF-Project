# Deployment Guide for Render.com

This repository is configured to deploy seamlessly to [Render](https://render.com).

You can choose between:
1. **Option A (Recommended & Automated)**: 1-Click Render Blueprint (`render.yaml`) - Full-stack unified service.
2. **Option B**: Manual Render Web Service (Single Unified Service).
3. **Option C**: Two Separate Services (Render Web Service for API + Render Static Site for Vite UI).

---

## Prerequisites (MongoDB Atlas)

Before deploying, ensure your MongoDB Atlas cluster is accessible by Render:
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/).
2. In the left navigation, click **Network Access** under **Security**.
3. Click **Add IP Address** and choose **Allow Access from Anywhere** (`0.0.0.0/0`).
4. In **Database Access**, verify you have a database user with read/write privileges.
5. In **Database** -> **Connect**, select **Drivers** (Node.js) and copy your connection string (e.g., `mongodb+srv://username:<password>@cluster0.xxxx.mongodb.net/careerpilot?retryWrites=true&w=majority`).

---

## Option A: 1-Click Blueprint Deployment (Fastest & Recommended)

Render will read the included `render.yaml` file and automatically configure the build, start commands, health checks, and environment parameters.

1. Commit and push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Configure production build and Render deployment"
   git push origin main
   ```
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** in the top right, then select **Blueprint**.
4. Connect your GitHub repository (`vu241fa04906-hub/MFEF-Project`).
5. Render detects `render.yaml`. You will be prompted to enter the missing secrets:
   - **MONGODB_URI**: Paste your MongoDB Atlas connection string.
   - **GEMINI_API_KEY**: (Optional) Paste your Google Gemini API key if using AI career features.
   - `JWT_SECRET` and `ADMIN_SETUP_KEY` are automatically generated for you securely!
6. Click **Apply**.
7. Render will install dependencies, build the frontend bundle, start the Express server, and give you your live URL (e.g., `https://careerpilot-ai.onrender.com`).

---

## Option B: Manual Web Service on Render (Single Unified Service)

If you prefer to configure manually via the Render dashboard:

1. In the [Render Dashboard](https://dashboard.render.com), click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure the following fields:
   - **Name**: `careerpilot-ai` (or your preferred name)
   - **Region**: Any preferred region (e.g., Oregon, Ohio, Frankfurt)
   - **Branch**: `main`
   - **Root Directory**: *(Leave blank - uses repo root)*
   - **Runtime**: `Node`
   - **Build Command**: `npm run render-build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
4. Expand **Advanced** -> **Environment Variables** and add:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `MONGODB_URI` = `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/careerpilot?retryWrites=true&w=majority`
   - `JWT_SECRET` = *(Generate a long random string, e.g. using `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)*
   - `JWT_EXPIRES_IN` = `7d`
   - `GEMINI_API_KEY` = *(Optional Google Gemini API key)*
   - `GEMINI_MODEL` = `gemini-3.8-flash`
   - `MAX_UPLOAD_MB` = `5`
   - `ADMIN_SETUP_KEY` = *(A secure random key to promote the first admin account)*
5. Health Check Path: `/api/health`
6. Click **Create Web Service**.

---

## Option C: Separate Services (Backend Web Service + Frontend Static Site)

If you want separate hosting for the backend API and frontend static assets:

### 1. Backend Web Service:
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Environment Variables**:
  - `MONGODB_URI`: your MongoDB URI
  - `JWT_SECRET`: your JWT secret
  - `CLIENT_URL`: `https://careerpilot-frontend.onrender.com` (your frontend Render URL)

### 2. Frontend Static Site:
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Rewrite / Redirect Rules**:
  - Source: `/*`
  - Destination: `/index.html`
  - Action: `Rewrite`
- **Environment Variables**:
  - `VITE_API_URL`: `https://careerpilot-backend.onrender.com/api`

---

## Local Verification & Rendering

To run and render the full application locally:

### Option 1: Live Development Mode
```bash
# Starts backend (port 5000) and Vite frontend (port 5173) with hot reload
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Option 2: Production Preview Mode (Same as Render)
```bash
# Build the production frontend assets
npm run build

# Start the unified Express server
npm start
```
Open [http://localhost:5000](http://localhost:5000) in your browser to view the application served by Express just like on Render.
