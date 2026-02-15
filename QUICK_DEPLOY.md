# ⚡ Quick Deploy (5 Minutes)

## Fastest way to deploy for FREE

### 1. MongoDB Atlas (2 min)
```
1. Go to mongodb.com/cloud/atlas/register
2. Create free cluster (M0)
3. Create user: admin / [password]
4. Network: Allow 0.0.0.0/0
5. Copy connection string
```

### 2. Push to GitHub (1 min)
```bash
git init
git add .
git commit -m "Deploy"
git remote add origin https://github.com/YOUR_USERNAME/legal-nurse.git
git push -u origin main
```

### 3. Render Backend (1 min)
```
1. render.com → New Web Service
2. Connect GitHub repo
3. Root: backend
4. Build: npm install
5. Start: node server.js
6. Add env: MONGODB_URI, JWT_SECRET
7. Deploy
```

### 4. Vercel Frontend (1 min)
```
1. vercel.com → Import Project
2. Select GitHub repo
3. Root: frontend
4. Add env: REACT_APP_API_URL=https://your-backend.onrender.com/api
5. Deploy
```

### Done! 🎉

Your app is live at:
- Frontend: https://your-app.vercel.app
- Backend: https://your-backend.onrender.com

**Note:** Backend sleeps after 15 min. First request takes 30-60 sec to wake up.
