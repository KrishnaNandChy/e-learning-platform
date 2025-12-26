# ⚡ Quick Start - EduLearn Platform

## 🎯 Everything You Need to Know in 5 Minutes

---

## ✅ **STEP 1: Requirements** (5 minutes)

Install these if you haven't:
1. **Node.js** - https://nodejs.org/ (Download LTS version)
2. **MongoDB** - https://www.mongodb.com/try/download/community
3. **VS Code** - https://code.visualstudio.com/ (Optional but recommended)

Verify installation:
```bash
node --version   # Should show v16+ 
npm --version    # Should show 8+
mongod --version # Should show 5+
```

---

## 🚀 **STEP 2: Setup** (3 minutes)

### 1. Clone or Download Project
```bash
# If you have Git
git clone <your-repo-url>
cd edulearn-platform

# OR download ZIP and extract it
```

### 2. Setup Backend
```bash
cd server
npm install
copy .env.example .env    # Windows
cp .env.example .env      # Mac/Linux
```

Edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/edulearn
JWT_SECRET=your_secret_key_123
CLIENT_URL=http://localhost:5173
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
copy .env.example .env    # Windows
cp .env.example .env      # Mac/Linux
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## ▶️ **STEP 3: Run** (1 minute)

### Open 3 Terminals:

**Terminal 1 - MongoDB:**
```bash
mongod
# Or if service: net start MongoDB (Windows)
```

**Terminal 2 - Backend:**
```bash
cd server
npm run dev
```
✅ Should see: "🚀 EduLearn Server Running!"

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Should see: "Local: http://localhost:5173/"

---

## 🌐 **STEP 4: Access** (30 seconds)

Open browser and go to:
- **http://localhost:5173** - Main website
- **http://localhost:5000** - Backend API

---

## 🎓 **STEP 5: Test** (2 minutes)

### Create Your First User:
1. Click "Sign Up"
2. Fill form:
   - Name: Your Name
   - Email: you@example.com
   - Password: Test123!
   - Role: Choose Student, Instructor, or Admin
3. Click "Create Account"

### Test Each Dashboard:

#### **Student Dashboard** (`/dashboard`)
- Sign up as "Student"
- View enrolled courses
- Track progress

#### **Instructor Dashboard** (`/instructor/dashboard`)
- Sign up as "Instructor" 
- Create courses
- Manage content

#### **Admin Dashboard** (`/admin/dashboard`)
- Sign up as any role
- Login to MongoDB and change role:
  ```javascript
  db.users.updateOne(
    { email: "youremail@example.com" },
    { $set: { role: "admin" } }
  )
  ```
- Logout and login again
- Visit `/admin/dashboard`

---

## 📁 **Project Structure**

```
edulearn-platform/
├── frontend/           # React app
│   ├── src/
│   │   ├── pages/     # 9 pages including dashboards
│   │   └── components/ # 20+ components
│   └── package.json
│
├── server/            # Node.js API
│   ├── models/       # 6 database models
│   ├── controllers/  # 6 controllers
│   ├── routes/       # API routes
│   └── server.js
│
└── Documentation/     # 10 guide files
```

---

## 🎯 **Three Dashboards**

| Dashboard | URL | Role Required | Purpose |
|-----------|-----|---------------|---------|
| Student | `/dashboard` | student | Learn courses, track progress |
| Instructor | `/instructor/dashboard` | instructor | Create/manage courses |
| Admin | `/admin/dashboard` | admin | Manage platform |

---

## 📡 **Key API Endpoints**

```
POST   /api/auth/register         - Sign up
POST   /api/auth/login            - Login
GET    /api/courses               - Get courses
POST   /api/enrollments/:courseId - Enroll
GET    /api/admin/stats           - Admin stats
```

Full API docs: Check backend console or `/api` route

---

## 🔧 **Quick Fixes**

### Port already in use?
```bash
# Change PORT in server/.env to 5001
# Or kill the process using the port
```

### Can't connect to MongoDB?
```bash
# Start MongoDB
mongod

# Or as service
net start MongoDB    # Windows
brew services start mongodb-community  # Mac
```

### Frontend can't reach backend?
1. Check backend is running (Terminal 2)
2. Verify `VITE_API_URL` in frontend/.env
3. Restart both servers

### Styles not working?
```bash
# Restart frontend dev server
Ctrl+C
npm run dev
```

---

## 📚 **Documentation Files**

**Start Here:**
1. **QUICK_START.md** (this file) - 5-minute guide
2. **START_HERE.md** - Overview
3. **COMPLETE_SETUP_GUIDE.md** - Detailed setup

**Reference:**
4. **FINAL_PROJECT_SUMMARY.md** - Complete overview
5. **COMPONENT_GUIDE.md** - Component usage
6. **PROJECT_OVERVIEW.md** - Detailed info

**Additional:**
7. **README.md** - Main documentation
8. **SETUP_GUIDE.md** - Basic setup
9. **VISUAL_GUIDE.md** - UI/UX overview
10. **IMPLEMENTATION_SUMMARY.md** - What was built

---

## 🎨 **Features You Can Use**

✅ User registration & login  
✅ Browse courses with filters  
✅ Course details with curriculum  
✅ Enroll in courses  
✅ Track learning progress  
✅ Leave reviews & ratings  
✅ Create courses (as instructor)  
✅ Manage platform (as admin)  
✅ Mobile responsive  
✅ Beautiful UI/UX  

---

## 🚀 **Deploy to Production**

**Backend (Render):**
1. Visit https://render.com
2. Connect GitHub repo
3. Deploy server folder
4. Add environment variables

**Frontend (Vercel):**
1. Visit https://vercel.com
2. Connect GitHub repo
3. Deploy frontend folder
4. Update VITE_API_URL

Detailed deployment guide: See COMPLETE_SETUP_GUIDE.md

---

## 💡 **Pro Tips**

1. **Use VS Code** for best experience
2. **Install extensions**: ESLint, Prettier, Tailwind CSS IntelliSense
3. **Split terminal** to run both servers
4. **Use Thunder Client** extension for API testing
5. **Enable auto-save** in VS Code

---

## ✅ **Checklist**

Before starting:
- [ ] Node.js installed
- [ ] MongoDB installed & running
- [ ] Dependencies installed (npm install)
- [ ] Environment files configured (.env)
- [ ] Both servers start without errors
- [ ] Can access http://localhost:5173
- [ ] Can create account and login

---

## 🎉 **You're Ready!**

Your complete E-Learning platform is now running!

### Quick Access:
```
Frontend:    http://localhost:5173
Backend:     http://localhost:5000
Student:     /dashboard
Instructor:  /instructor/dashboard
Admin:       /admin/dashboard
```

### Need Help?
- Check COMPLETE_SETUP_GUIDE.md
- Review troubleshooting section
- Check browser console for errors
- Check server terminal for logs

---

## 📞 **Support**

### Common Commands:
```bash
# Backend
cd server
npm run dev      # Start development
npm start        # Start production

# Frontend  
cd frontend
npm run dev      # Start development
npm run build    # Build for production

# MongoDB
mongod           # Start MongoDB
mongosh          # Connect to MongoDB
```

### File Locations:
- Backend config: `server/.env`
- Frontend config: `frontend/.env`
- Database: `edulearn` database in MongoDB

---

## 🎯 **What Next?**

1. **Explore** - Browse all pages and features
2. **Test** - Try all three dashboard types
3. **Customize** - Change colors, content, branding
4. **Learn** - Review the code and documentation
5. **Deploy** - Push to production when ready

---

## 🌟 **Features Summary**

| Feature | Status | Dashboard |
|---------|--------|-----------|
| Browse Courses | ✅ | Public |
| User Auth | ✅ | All |
| Enroll & Learn | ✅ | Student |
| Track Progress | ✅ | Student |
| Create Courses | ✅ | Instructor |
| Manage Users | ✅ | Admin |
| Platform Analytics | ✅ | Admin |
| Reviews & Ratings | ✅ | All |
| Mobile Responsive | ✅ | All |

---

**That's it! You're all set to build something amazing! 🚀**

---

**Questions?** Check the other documentation files!

**Built with ❤️** | **Ready to Launch** | **100% Complete**
