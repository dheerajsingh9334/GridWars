# Render Backend Deployment Fix

## The Issue
Render runs `npm prune --production` which removes dev dependencies (@types packages) needed for TypeScript compilation.

## The Solution
Update your Render deployment settings:

### Option 1: Modify Build Command (Recommended)
1. Go to Render Dashboard → Your Service → Settings
2. Change the "Build Command" from:
   ```
   npm install && npm run build
   ```
   To:
   ```
   npm install --include=dev && npm run build
   ```
3. Keep "Start Command" as:
   ```
   npm start
   ```
4. Click "Save" and Render will trigger a new deploy

### Option 2: Set Environment Variable
In Render Dashboard → Environment Variables, add:
```
NPM_PRODUCTION=false
```

### Option 3: Use render.yaml (If Available)
We've created `render.yaml` in the root directory which explicitly defines the build process.

---

## What's Fixed in This Commit

✅ Ensured all devDependencies are in package.json (@types packages)
✅ Created render.yaml for explicit Render configuration
✅ Created backend/.npmrc for npm configuration
✅ Verified all code compiles locally with `npm run build`
✅ Verified dist/ folder is built and ready

## Next Steps

1. **Update Render Settings** (Do this manually on Render dashboard):
   - Go to your GridWars backend service
   - Click "Settings"
   - Find "Build Command"
   - Change it to: `npm install --include=dev && npm run build`
   - Click "Save"

2. **Trigger New Deploy**:
   - Render will automatically redeploy with the new settings
   - Wait for deployment to complete (should succeed now)

3. **Monitor Deploy**:
   - Check build logs on Render dashboard
   - Should see all types packages install
   - Should see successful TypeScript compilation

---

## Common Build Commands for Render

**For Node + TypeScript (like ours):**
```
npm install --include=dev && npm run build
```

**For Node + Production Only:**
```
npm ci --production
```

**For Node + Dev Dependencies:**
```
npm install
```

---

## TypeScript Dev Dependencies Required

Our project needs these dev dependencies for compilation:
- @types/express
- @types/bcryptjs
- @types/jsonwebtoken
- @types/cookie-parser
- @types/cors
- @types/node
- typescript
- ts-node-dev

All are listed in `backend/package.json` devDependencies.

---

## Testing Locally

To verify everything works:
```bash
cd backend
npm install
npm run build
npm start
```

This should compile without errors and start the server.
