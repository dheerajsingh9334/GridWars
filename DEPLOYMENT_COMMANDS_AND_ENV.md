# DEPLOYMENT SUMMARY - All Commands & Environment Variables

## 📋 TABLE OF CONTENTS
1. [Quick Start](#quick-start)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Environment Variables](#environment-variables)
5. [Troubleshooting](#troubleshooting)

---

## 🚀 QUICK START

### Timeline: ~15-20 minutes total

```bash
# 1. Deploy Backend (2-5 min)
# 2. Deploy Frontend (1-2 min)
# 3. Update URLs (5 min)
# 4. Test (5 min)
```

---

## BACKEND DEPLOYMENT (Render)

### STEP 1: Create Render Account
```
1. Go to https://render.com
2. Click "Sign up"
3. Use GitHub account for easy linking
```

### STEP 2: Create Web Service on Render
```
1. Click "+ New" → "Web Service"
2. Connect your GitHub repository
3. Repository: dheerajsingh9334/GridWars
4. Select "Create Web Service"
```

### STEP 3: Configure Build & Start
```
Fill in the form:
- Name: gridwars-backend
- Environment: Node
- Region: Choose closest to you
- Build Command: npm install && npm run build
- Start Command: npm start
```

### STEP 4: Add Environment Variables
```
Click "Environment" and add these exactly:

MONGODB_URI
mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?appName=Cluster0

JWT_SECRET
aB3xKm9wP2qRsT4uVwXyZ5cDeFgHiJkL

CLIENT_URL
https://your-gridwars-frontend.vercel.app

NODE_ENV
production

PORT
5000
```

⚠️ **Generate a strong JWT_SECRET:**
```bash
# Mac/Linux:
openssl rand -base64 32

# Or use: https://www.lastpass.com/features/password-generator
```

### STEP 5: Deploy
```
Click "Create Web Service"
Wait for deployment (green status = success)
Copy your Render URL: https://gridwars-backend.onrender.com (example)
```

### RENDER DEPLOY COMMANDS (Local Machine)

```bash
# Only needed if making backend changes
cd backend
npm install
npm run build
npm start  # Test locally

# Then push to GitHub (Render auto-deploys)
git add backend/
git commit -m "Update backend"
git push origin main
```

---

## FRONTEND DEPLOYMENT (Vercel)

### STEP 1: Create Vercel Account
```
Go to https://vercel.com
Sign up with GitHub account
```

### STEP 2: Update Frontend Environment Variables
```
Create file: frontend/.env.production
Content:
VITE_API_URL=https://gridwars-backend.onrender.com/api
VITE_SOCKET_URL=https://gridwars-backend.onrender.com

Replace "gridwars-backend" with your actual Render URL
```

### STEP 3: Install Vercel CLI (RECOMMENDED)
```bash
npm install -g vercel
```

### STEP 4: Deploy to Vercel
```bash
cd frontend
vercel --prod

Follow the prompts:
- Select your account
- Confirm project name: gridwars-frontend
- Framework: Vite
- Build command: npm run build
- Output directory: dist
```

### STEP 5: Get Your Vercel URL
```
Vercel will show: https://your-gridwars-frontend.vercel.app
Copy this URL!
```

### FRONTEND DEPLOY COMMANDS

#### Option A: CLI (Simple)
```bash
cd frontend
vercel --prod
# That's it! Updates with one command
```

#### Option B: Git Push (Easiest)
```bash
# Just push to GitHub - Vercel auto-deploys!
git add frontend/
git commit -m "Update frontend"
git push origin main
# Wait 1-2 minutes for auto-deployment
```

---

## 🔐 ENVIRONMENT VARIABLES

### Backend (Render Dashboard)

| Variable | Where to Get | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas | `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/?appName=Cluster0` |
| `JWT_SECRET` | Generate random | `aB3xKm9wP2qRsT4uVwXyZ5cDeFgHiJkL` |
| `CLIENT_URL` | Your Vercel URL | `https://gridwars-frontend.vercel.app` |
| `NODE_ENV` | Type exactly | `production` |
| `PORT` | Type exactly | `5000` |

### Frontend (Vercel Dashboard or .env.production)

| Variable | Where to Get | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Render Backend URL + /api | `https://gridwars-backend.onrender.com/api` |
| `VITE_SOCKET_URL` | Render Backend URL | `https://gridwars-backend.onrender.com` |

### Update Sequence

```
1. Deploy Backend → Get Render URL
2. Add Render URL to Frontend .env.production
3. Deploy Frontend → Get Vercel URL
4. Add Vercel URL to Render's CLIENT_URL
5. Render redeploys automatically
6. Done!
```

---

## 🔧 FILE LOCATIONS IN PROJECT

```
gridwars/
├── DEPLOYMENT.md                    ← Full guide (read this first)
├── DEPLOYMENT_QUICK_REFERENCE.md    ← Quick commands
├── .gitignore                       ← Protects .env files
├── frontend/
│   ├── vercel.json                  ← Vercel config
│   ├── .env.example                 ← Template for .env
│   └── .env.production              ← Actual production (don't commit!)
└── backend/
    ├── .env.example                 ← Template for .env
    └── .env.production              ← Actual production (don't commit!)
```

---

## ✅ DEPLOYMENT CHECKLIST

### Before Deploying
- [ ] Push all code to GitHub main branch
- [ ] Change JWT_SECRET to strong random string
- [ ] Have MongoDB connection string ready
- [ ] Test build locally: `npm run build`

### Render Deployment
- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Create Web Service
- [ ] Add ALL environment variables
- [ ] Wait for green status
- [ ] Copy Render URL

### Vercel Deployment
- [ ] Update frontend/.env.production with Render URL
- [ ] Create Vercel account
- [ ] Deploy: `vercel --prod` OR push to main
- [ ] Wait for deployment
- [ ] Copy Vercel URL

### Post-Deployment
- [ ] Update Render's CLIENT_URL with Vercel URL
- [ ] Test: Open Vercel URL in browser
- [ ] Test signup/signin
- [ ] Check browser console (no errors)
- [ ] Test WebSocket (real-time updates)

---

## 🧪 TESTING AFTER DEPLOYMENT

### Test Backend Health
```bash
curl https://your-render-url.onrender.com/api/health

Expected response:
{"status": "ok", "timestamp": "..."}
```

### Test Frontend
```
1. Open https://your-vercel-url.vercel.app
2. Should load the login page
3. Sign up with test account
4. Should be able to see the game board
5. Open DevTools → Console (no red errors)
```

### Test WebSocket Connection
```
1. Open DevTools → Network
2. Filter: WS (WebSocket)
3. You should see a WebSocket connection to Render
4. Should have status "101 Switching Protocols"
```

---

## 🆘 TROUBLESHOOTING

### Problem: 401 Unauthorized on Login
```
Check:
1. JWT_SECRET is set on Render
2. Backend is running (check Render logs)
3. MongoDB is connected
4. Frontend sending credentials correctly
```

### Problem: WebSocket Won't Connect
```
Check:
1. VITE_SOCKET_URL in Vercel environment
2. CLIENT_URL in Render environment
3. Both have HTTPS (not HTTP)
4. No typos in URLs
```

### Problem: Blank Page on Frontend
```
Check:
1. Vercel build logs (any errors?)
2. VITE_API_URL is correct
3. Browser console → any red errors?
4. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

### Problem: Database Connection Error
```
Check:
1. MONGODB_URI is correct
2. MongoDB Atlas: whitelist IP (allow 0.0.0.0/0)
3. Username/password has no special characters (or URL-encoded)
4. Cluster is active
```

### Problem: Deployment Stuck
```
Check:
1. Render/Vercel build logs
2. package.json has "build" and "start" scripts
3. No TypeScript errors
4. All dependencies installed locally first
```

### Problem: Cookies Not Persisting
```
Check:
1. Backend CORS has credentials: true
2. Frontend API has withCredentials: true
3. Domain is HTTPS in production
4. Check browser DevTools → Application → Cookies
```

### Problem: Cold Start Slow (Render Free Tier)
```
Solution:
- Render free tier spins down after 15 min inactivity
- First request takes 30-50 seconds
- Upgrade to paid plan for instant starts
- Or check status at https://status.render.com
```

---

## 📝 USEFUL LINKS

| Resource | URL |
|----------|-----|
| Render Dashboard | https://dashboard.render.com |
| Vercel Dashboard | https://vercel.com/dashboard |
| MongoDB Atlas | https://www.mongodb.com/cloud/atlas |
| JWT Generator | https://www.lastpass.com/features/password-generator |
| Render Docs | https://render.com/docs |
| Vercel Docs | https://vercel.com/docs |

---

## 🔄 CONTINUOUS DEPLOYMENT (After Initial Setup)

### Auto-Redeployment
```
After first deployment, every git push triggers auto-deploy:

Backend:
git push origin main
→ Render sees change → auto-builds & deploys (2-5 min)

Frontend:
git push origin main
→ Vercel sees change → auto-builds & deploys (1-2 min)

NO MANUAL COMMANDS NEEDED!
```

### Manual Redeploy if Needed
```bash
# Frontend only
cd frontend
vercel --prod

# Backend
# Just push to GitHub (Render auto-deploys)
git push origin main
```

---

## 🎯 EXACT COPY-PASTE COMMANDS

### Generate JWT Secret (copy output)
```bash
openssl rand -base64 32
```

### Backend deploy locally (test before pushing)
```bash
cd backend && npm install && npm run build && npm start
```

### Frontend deploy to Vercel
```bash
cd frontend && vercel --prod
```

### Push everything to GitHub
```bash
git add . && git commit -m "Deploy to production" && git push origin main
```

---

## 💡 PRO TIPS

1. **Keep .env files secret** - Never commit real values to GitHub
2. **Use environment variables** - All secrets go in dashboard, not code
3. **Monitor logs** - Check Render & Vercel logs if issues occur
4. **Test changes locally** - Always test `npm run build` before deploying
5. **Auto-scaling** - Both Render and Vercel auto-scale for you
6. **HTTPS by default** - Both platforms provide free SSL certificates

---

## 🎓 NEXT STEPS

1. Deploy backend to Render (this guide)
2. Deploy frontend to Vercel (this guide)
3. Test full application
4. Set up error monitoring (optional: Sentry, LogRocket)
5. Celebrate! 🎉

---

**Deployment should take ~15-20 minutes. Good luck! 🚀**

Questions? Check DEPLOYMENT.md for detailed explanations.
