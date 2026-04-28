# 🚀 Quick Deployment Reference

## BACKEND (Render) - Commands

```bash
# 1. Build and test locally
cd backend
npm install
npm run build
npm start
# Test: curl http://localhost:5000/api/health

# 2. Deploy to Render
# Push to GitHub (Render auto-deploys from main)
cd ..
git add backend/
git commit -m "Deploy backend to Render"
git push origin main
```

## FRONTEND (Vercel) - Commands

### Option A: CLI Deployment (Recommended)
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
cd frontend
vercel --prod

# 4. Auto-deployments
# Every push to main triggers auto-deployment
git add frontend/
git commit -m "Deploy frontend to Vercel"
git push origin main
```

### Option B: GitHub Integration
```bash
# Just push to GitHub - Vercel auto-deploys!
git add frontend/
git commit -m "Update frontend"
git push origin main
```

---

## 🔐 Environment Variables

### BACKEND (Render Dashboard)

Add these in **Render → Environment** tab:

```
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?appName=Cluster0

JWT_SECRET=generate-a-random-secret-minimum-32-characters-here

CLIENT_URL=https://your-frontend-vercel-url.vercel.app

NODE_ENV=production

PORT=5000
```

### FRONTEND (Vercel Dashboard or CLI)

Add these in **Vercel → Settings → Environment Variables**:

```
VITE_API_URL=https://gridwars-backend.onrender.com/api

VITE_SOCKET_URL=https://gridwars-backend.onrender.com
```

Or via CLI:
```bash
vercel env add VITE_API_URL
# Enter: https://gridwars-backend.onrender.com/api

vercel env add VITE_SOCKET_URL
# Enter: https://gridwars-backend.onrender.com
```

---

## 📊 Step-by-Step Deployment Order

### 1️⃣ Deploy Backend First
```bash
cd backend
npm run build
# Push to GitHub
git push origin main
# Render auto-deploys, wait for green status
# Copy your Render URL: https://gridwars-backend.onrender.com
```

### 2️⃣ Update Frontend ENV Variables
Update `frontend/.env.production`:
```
VITE_API_URL=https://gridwars-backend.onrender.com/api
VITE_SOCKET_URL=https://gridwars-backend.onrender.com
```

Then push:
```bash
git add frontend/
git push origin main
# Vercel auto-deploys
```

### 3️⃣ Update Backend's CLIENT_URL
On Render dashboard → Environment Variables:
```
CLIENT_URL=https://your-gridwars-frontend.vercel.app
```

---

## ✅ Testing Deployed App

```bash
# Test backend health
curl https://gridwars-backend.onrender.com/api/health

# Test frontend
Open: https://your-gridwars-frontend.vercel.app

# Test signup
# Test signin
# Test real-time (check console for WebSocket connection)
```

---

## 🔄 Auto-Redeployment

Once set up, deployments are automatic:

**Backend (Render):**
- Every push to main → auto-deploys
- Takes 2-5 minutes

**Frontend (Vercel):**
- Every push to main → auto-deploys
- Takes 1-2 minutes

No manual commands needed!

---

## 🆘 Quick Fixes

### WebSocket not connecting?
```
Check:
1. VITE_SOCKET_URL in Vercel environment
2. CLIENT_URL in Render environment
3. Frontend has withCredentials: true
4. Backend CORS allows your frontend URL
```

### 401 Unauthorized?
```
Check:
1. JWT_SECRET is set on Render
2. Cookies are being sent (check Network tab)
3. Backend is running (curl health endpoint)
```

### Blank page on frontend?
```
Check:
1. Build logs on Vercel (any errors?)
2. VITE_API_URL is correct
3. Browser console for errors
4. Backend is responding
```

### Cold start taking too long?
```
Render free tier spins down after 15 min of inactivity
Consider upgrading to paid plan for instant starts
```

---

## 📝 Generate Strong JWT Secret

```bash
# Linux/Mac:
openssl rand -base64 32

# Or use this online:
# https://www.lastpass.com/features/password-generator
```

Example output:
```
aB3xKm9wP2qRsT4uVwXyZ5cDeFgHiJkL
```

---

## 🎯 MongoDB Atlas Setup (if needed)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create account → Create cluster
3. Add user with password
4. Get connection string (Copy to MONGODB_URI)
5. Add IP whitelist (allow all: 0.0.0.0/0)
6. Connection string format:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?appName=Cluster0
   ```

---

## 📚 Console Commands After Deployment

```bash
# Check deployment status on Render
# (Manual - view Render dashboard)

# Check deployment status on Vercel
vercel list

# Rollback to previous deployment
vercel rollback

# View Vercel logs
vercel logs https://your-gridwars-frontend.vercel.app --follow
```

---

**You're all set! Happy deploying! 🚀**
