# GridWars Deployment Guide

Complete deployment instructions for Vercel (Frontend) and Render (Backend).

---

## 🚀 BACKEND DEPLOYMENT (Render)

### Step 1: Prepare Backend for Production

**Update backend/src/index.ts** to use environment variables:

```typescript
const PORT = parseInt(process.env.PORT || '5000', 10);
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
```

**Ensure package.json has these scripts:**
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

### Step 2: Create .env File Locally (for reference)

Create `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_MONGODB_USERNAME:YOUR_MONGODB_PASSWORD@cluster0.xxxxx.mongodb.net/?appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this
CLIENT_URL=https://your-vercel-frontend-url.vercel.app
NODE_ENV=production
```

⚠️ **DO NOT commit .env to GitHub** - Set these on Render instead!

### Step 3: Deploy to Render

#### 3.1 Create Render Account
- Go to https://render.com
- Sign up with GitHub account (easier integration)

#### 3.2 Create New Web Service
1. Click **"New+"** → **"Web Service"**
2. Connect your GitHub repository (dheerajsingh9334/GridWars)
3. Fill in the form:
   - **Name:** `gridwars-backend` (or your choice)
   - **Environment:** `Node`
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

#### 3.3 Add Environment Variables on Render
Click **"Environment"** tab and add these variables:

```
MONGODB_URI=mongodb+srv://YOUR_MONGODB_USERNAME:YOUR_MONGODB_PASSWORD@cluster0.xxxxx.mongodb.net/?appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-minimum-32-chars
CLIENT_URL=https://your-vercel-frontend-url.vercel.app
NODE_ENV=production
PORT=5000
```

#### 3.4 Deploy
- Click **"Create Web Service"**
- Render will automatically deploy when you push to main
- Wait for deployment to complete
- Copy your Render backend URL (e.g., `https://gridwars-backend.onrender.com`)

### Render Deployment Commands (run locally before pushing)

```bash
# Build backend
cd backend
npm install
npm run build

# Test the build
npm start

# If everything works, commit and push
cd ..
git add backend/
git commit -m "Prepare backend for production"
git push origin main
```

---

## 🎨 FRONTEND DEPLOYMENT (Vercel)

### Step 1: Prepare Frontend for Production

**Update frontend/.env.production:**
```
VITE_API_URL=https://gridwars-backend.onrender.com/api
VITE_SOCKET_URL=https://gridwars-backend.onrender.com
```

**Ensure frontend/package.json has build script:**
```json
{
  "scripts": {
    "build": "tsc && vite build"
  }
}
```

### Step 2: Create vercel.json Configuration File

Create `frontend/vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "devCommand": "vite",
  "installCommand": "npm install",
  "framework": "vite",
  "outputDirectory": "dist"
}
```

### Step 3: Deploy to Vercel

#### 3.1 Option A: Deploy via Vercel CLI (Recommended)

**Install Vercel CLI globally:**
```bash
npm install -g vercel
```

**Deploy from your project root:**
```bash
# Navigate to frontend folder
cd frontend

# Deploy (first time will ask questions)
vercel

# For production deployment
vercel --prod
```

**When prompted:**
- **Which scope?** - Select your account
- **Link to existing project?** - No (first time)
- **Project name:** - `gridwars-frontend`
- **In which directory?** - Press Enter (current directory)
- **Want to modify settings?** - No
- **Build command:** - Press Enter (uses vercel.json)
- **Output directory:** - `dist`

#### 3.2 Option B: Deploy via Vercel Dashboard

1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click **"New Project"**
4. Select **GridWars** repository
5. Framework Preset: **Vite**
6. Root Directory: **frontend**
7. Add Environment Variables:
   ```
   VITE_API_URL=https://gridwars-backend.onrender.com/api
   VITE_SOCKET_URL=https://gridwars-backend.onrender.com
   ```
8. Click **"Deploy"**

### Frontend Deployment Commands

```bash
# Build frontend
cd frontend
npm install
npm run build

# Test the build locally
npm run preview

# Deploy to Vercel
vercel --prod

# Or deploy automatically when you push to main (Vercel auto-deploys)
cd ..
git add frontend/
git commit -m "Prepare frontend for production"
git push origin main
```

---

## 🔗 ENVIRONMENT VARIABLES SUMMARY

### Backend (Render)

| Variable | Value | Notes |
|----------|-------|-------|
| `MONGODB_URI` | `mongodb+srv://user:password@cluster.mongodb.net/?appName=Cluster0` | Get from MongoDB Atlas |
| `JWT_SECRET` | `your-secret-key-min-32-chars` | Change from default! Keep secure! |
| `CLIENT_URL` | `https://your-vercel-url.vercel.app` | Update after deploying frontend |
| `NODE_ENV` | `production` | Always for Render |
| `PORT` | `5000` | Default, Render will use it |

### Frontend (Vercel)

| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_API_URL` | `https://gridwars-backend.onrender.com/api` | Update with your Render URL |
| `VITE_SOCKET_URL` | `https://gridwars-backend.onrender.com` | Update with your Render URL |

---

## 📋 DEPLOYMENT CHECKLIST

### Before Deploying

- [ ] Change JWT_SECRET to a strong random string (at least 32 characters)
- [ ] Set MONGODB_URI to your production MongoDB instance
- [ ] Ensure CORS is configured properly in backend
- [ ] Test locally: `npm run build` && `npm run preview` (both frontend and backend)
- [ ] Push all changes to main branch on GitHub

### Render Backend Deployment

- [ ] Create Render account and connect GitHub
- [ ] Create Web Service on Render
- [ ] Add all environment variables to Render
- [ ] Deploy and get backend URL
- [ ] Test health endpoint: `https://your-render-url/api/health`

### Vercel Frontend Deployment

- [ ] Update VITE_API_URL and VITE_SOCKET_URL with Render backend URL
- [ ] Create Vercel account and connect GitHub
- [ ] Deploy frontend to Vercel
- [ ] Update Render `CLIENT_URL` to Vercel URL
- [ ] Test app at Vercel URL

### Post-Deployment Testing

- [ ] Test signup endpoint
- [ ] Test signin endpoint (cookies)
- [ ] Test real-time WebSocket connection
- [ ] Test tile updates
- [ ] Check browser console for errors

---

## 🆘 TROUBLESHOOTING

### CORS Issues
If frontend can't reach backend:
- Ensure `CLIENT_URL` on Render matches your Vercel URL exactly
- Check browser DevTools → Network tab
- Verify `withCredentials: true` in frontend axios config

### WebSocket Connection Fails
- Check `VITE_SOCKET_URL` matches Render backend URL
- Ensure Socket.IO is configured with `withCredentials: true`
- Check browser console for connection errors

### MongoDB Connection Error
- Verify MONGODB_URI is correct (includes password)
- Check IP whitelist on MongoDB Atlas (allow all or Render's IP)
- Test URI in MongoDB Compass locally first

### Deployment Stuck
- Check Render/Vercel build logs
- Ensure `build` and `start` scripts are in package.json
- For Render: minimum 0.5GB RAM recommended

### Cookies Not Working
- Ensure backend has `credentials: true` in CORS
- Frontend must have `withCredentials: true`
- Check that protocol is HTTPS in production

---

## 📚 USEFUL LINKS

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **Generate JWT Secret:** https://www.lastpass.com/features/password-generator

---

## 🔄 REDEPLOYMENT

### Update Backend on Render
```bash
# Make changes
git add backend/
git commit -m "Update backend"
git push origin main
# Render auto-redeploys!
```

### Update Frontend on Vercel
```bash
# Make changes
git add frontend/
git commit -m "Update frontend"
git push origin main
# Vercel auto-redeploys!
```

---

**Good luck deploying! 🚀**
