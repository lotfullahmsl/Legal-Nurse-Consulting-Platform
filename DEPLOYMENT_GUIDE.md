# Free Deployment Guide

## 🚀 Deploy Your Legal Nurse Platform for FREE

This guide will help you deploy your application using completely free services.

---

## Prerequisites

1. GitHub account
2. Vercel account (sign up with GitHub)
3. Render account (sign up with GitHub)
4. MongoDB Atlas account (free)

---

## Step 1: Setup MongoDB Atlas (Database) - FREE

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for free account
3. Create a new cluster:
   - Choose **FREE** tier (M0)
   - Select a cloud provider (AWS recommended)
   - Choose region closest to you
   - Click "Create Cluster"

4. Create Database User:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `admin`
   - Password: Generate a secure password (save it!)
   - User Privileges: "Read and write to any database"

5. Whitelist IP Address:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

6. Get Connection String:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Example: `mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/legal-nurse?retryWrites=true&w=majority`

---

## Step 2: Deploy Backend to Render - FREE

1. Go to https://render.com and sign up with GitHub

2. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/legal-nurse-platform.git
   git push -u origin main
   ```

3. Create New Web Service:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name:** legal-nurse-backend
     - **Region:** Oregon (US West)
     - **Branch:** main
     - **Root Directory:** backend
     - **Runtime:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `node server.js`
     - **Plan:** Free

4. Add Environment Variables:
   Click "Advanced" → "Add Environment Variable":
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string_from_step1
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   JWT_EXPIRE=7d
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

5. Click "Create Web Service"

6. Wait for deployment (5-10 minutes)

7. Copy your backend URL (e.g., `https://legal-nurse-backend.onrender.com`)

**Note:** Free tier sleeps after 15 minutes of inactivity. First request may take 30-60 seconds to wake up.

---

## Step 3: Deploy Frontend to Vercel - FREE

1. Go to https://vercel.com and sign up with GitHub

2. Update Frontend Environment:
   Edit `frontend/.env`:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```
   Replace with your actual Render backend URL from Step 2.

3. Commit the change:
   ```bash
   git add frontend/.env
   git commit -m "Update API URL for production"
   git push
   ```

4. Import Project:
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset:** Create React App
     - **Root Directory:** frontend
     - **Build Command:** `npm run build`
     - **Output Directory:** build

5. Add Environment Variable:
   - Click "Environment Variables"
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.onrender.com/api`

6. Click "Deploy"

7. Wait for deployment (2-5 minutes)

8. Your app is live! 🎉

---

## Step 4: Test Your Deployment

1. Visit your Vercel URL (e.g., `https://legal-nurse-platform.vercel.app`)

2. Try to register a new account

3. Login and test features

4. Check if backend is responding (may take 30-60 seconds on first request)

---

## Free Tier Limitations

### Vercel (Frontend)
- ✅ Unlimited bandwidth
- ✅ Automatic HTTPS
- ✅ 100GB bandwidth/month
- ✅ Perfect for this project

### Render (Backend)
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ 750 hours/month (enough for 1 month)
- ⚠️ First request after sleep: 30-60 seconds
- ✅ Automatic HTTPS
- ✅ Good for demos

### MongoDB Atlas (Database)
- ✅ 512MB storage
- ✅ Shared cluster
- ✅ Perfect for testing
- ⚠️ Limited to 100 connections

---

## Upgrade Options (When Needed)

### If backend sleep is annoying:
- **Render:** $7/month for always-on
- **Railway:** $5/month for 500 hours
- **Fly.io:** $5/month for always-on

### If you need more database storage:
- **MongoDB Atlas M10:** $9/month (2GB storage)

---

## Troubleshooting

### Backend not responding:
- Wait 60 seconds (it's waking up from sleep)
- Check Render logs for errors
- Verify MongoDB connection string

### Frontend can't connect to backend:
- Check `REACT_APP_API_URL` in Vercel environment variables
- Make sure it ends with `/api`
- Check CORS settings in backend

### Database connection failed:
- Verify MongoDB Atlas IP whitelist (0.0.0.0/0)
- Check username/password in connection string
- Ensure database user has correct permissions

---

## Custom Domain (Optional - FREE)

### Vercel:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Render:
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed

---

## Monitoring & Logs

### Vercel:
- Dashboard → Your Project → Deployments
- Click on deployment to see build logs

### Render:
- Dashboard → Your Service → Logs
- Real-time logs of your backend

### MongoDB Atlas:
- Dashboard → Metrics
- Monitor database performance

---

## Security Notes

⚠️ **Important for Production:**
- Change all default passwords
- Use strong JWT_SECRET
- Enable MongoDB Atlas IP whitelist properly
- Add rate limiting
- Enable audit logging
- Consider upgrading to paid tiers for HIPAA compliance

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com

---

## Summary

✅ **Frontend:** Vercel (Free forever)
✅ **Backend:** Render (Free with sleep)
✅ **Database:** MongoDB Atlas (Free 512MB)
✅ **Total Cost:** $0/month

Perfect for demos, testing, and small projects!
