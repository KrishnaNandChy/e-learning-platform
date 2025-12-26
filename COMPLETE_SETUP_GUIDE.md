# 🚀 Complete Setup Guide - EduLearn Platform

## 📋 Table of Contents
1. [System Requirements](#system-requirements)
2. [Initial Setup](#initial-setup)
3. [Clone from GitHub](#clone-from-github)
4. [VS Code Setup](#vs-code-setup)
5. [Backend Setup](#backend-setup)
6. [Frontend Setup](#frontend-setup)
7. [Database Setup](#database-setup)
8. [Running the Application](#running-the-application)
9. [Testing the Application](#testing-the-application)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

---

## 🖥️ System Requirements

### Required Software:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)
- **VS Code** (Recommended) - [Download](https://code.visualstudio.com/)

### Check Installed Versions:
```bash
node --version    # Should be v16+ 
npm --version     # Should be 8+
mongo --version   # Should be 5+
git --version     # Any recent version
```

---

## 🎯 Initial Setup

### 1. Install Node.js
1. Visit https://nodejs.org/
2. Download LTS version (Long Term Support)
3. Run installer and follow instructions
4. Verify installation: `node --version`

### 2. Install MongoDB
**Option A: Local Installation (Recommended for Development)**
1. Visit https://www.mongodb.com/try/download/community
2. Download MongoDB Community Server
3. Install and start MongoDB service
4. Verify: Open command prompt and type `mongod --version`

**Option B: MongoDB Atlas (Cloud - for Production)**
1. Visit https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Use in .env file

### 3. Install VS Code
1. Visit https://code.visualstudio.com/
2. Download and install
3. Install recommended extensions (see VS Code Setup below)

---

## 📥 Clone from GitHub

### Method 1: Using Git Command
```bash
# Open terminal/command prompt
# Navigate to where you want the project
cd C:/Projects  # or your preferred location

# Clone the repository
git clone https://github.com/YOUR_USERNAME/edulearn-platform.git

# Navigate into project
cd edulearn-platform
```

### Method 2: Using VS Code
1. Open VS Code
2. Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
3. Type "Git: Clone"
4. Enter repository URL
5. Choose location to save
6. VS Code will open the project

### Method 3: Download ZIP
1. Go to GitHub repository
2. Click green "Code" button
3. Click "Download ZIP"
4. Extract the ZIP file
5. Open folder in VS Code

---

## 🛠️ VS Code Setup

### Recommended Extensions:
Install these extensions in VS Code:

1. **ESLint** - Code linting
2. **Prettier** - Code formatting
3. **ES7+ React/Redux/React-Native snippets** - React snippets
4. **Tailwind CSS IntelliSense** - Tailwind autocomplete
5. **MongoDB for VS Code** - MongoDB management
6. **REST Client** or **Thunder Client** - API testing
7. **GitLens** - Enhanced Git features
8. **Auto Rename Tag** - HTML/JSX tag renaming
9. **Path Intellisense** - File path autocomplete

### To Install Extensions:
1. Open VS Code
2. Click Extensions icon (left sidebar) or press `Ctrl+Shift+X`
3. Search for extension name
4. Click "Install"

### VS Code Settings (Optional):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

Add this to: File > Preferences > Settings > Open Settings (JSON)

---

## 🔧 Backend Setup

### Step 1: Navigate to Server Folder
```bash
cd server
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs all packages from `package.json`:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- dotenv
- and more...

### Step 3: Environment Configuration
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   **Windows Command Prompt:**
   ```bash
   copy .env.example .env
   ```

2. Open `.env` file and configure:
   ```env
   NODE_ENV=development
   PORT=5000
   
   # Local MongoDB
   MONGO_URI=mongodb://127.0.0.1:27017/edulearn
   
   # OR MongoDB Atlas (for production)
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/edulearn
   
   JWT_SECRET=change_this_to_your_secret_key_123
   JWT_EXPIRE=7d
   COOKIE_EXPIRE=7
   
   CLIENT_URL=http://localhost:5173
   ```

3. Generate a strong JWT_SECRET:
   ```bash
   # In Node.js REPL (type `node` in terminal)
   require('crypto').randomBytes(32).toString('hex')
   ```

### Step 4: Verify Backend Setup
```bash
# Check if all dependencies installed
npm list --depth=0

# Try running the server
npm run dev
```

If successful, you should see:
```
╔═══════════════════════════════════════╗
║   🚀 EduLearn Server Running!        ║
║   📍 Port: 5000                      ║
║   🌍 Environment: development        ║
║   📊 Database: Connected             ║
╚═══════════════════════════════════════╝
```

---

## 🎨 Frontend Setup

### Step 1: Navigate to Frontend Folder
```bash
# From project root
cd frontend

# Or if you're in server folder
cd ../frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs:
- react
- react-dom
- react-router-dom
- axios
- tailwindcss
- vite
- and more...

### Step 3: Environment Configuration
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   **Windows:**
   ```bash
   copy .env.example .env
   ```

2. Open `.env` and configure:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=EduLearn
   VITE_NODE_ENV=development
   ```

### Step 4: Verify Frontend Setup
```bash
# Check dependencies
npm list --depth=0

# Try running dev server
npm run dev
```

If successful, you should see:
```
  VITE v5.1.4  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🗄️ Database Setup

### Using Local MongoDB

#### 1. Start MongoDB Service

**Windows:**
```bash
# Method 1: As a service (if installed as service)
net start MongoDB

# Method 2: Manual start
mongod
```

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

#### 2. Verify MongoDB is Running
```bash
# Connect to MongoDB shell
mongosh
# or
mongo

# You should see MongoDB shell prompt
```

#### 3. Create Database (Optional - Auto-created)
```javascript
// In MongoDB shell
use edulearn
db.createCollection("users")
show dbs
```

### Using MongoDB Atlas (Cloud)

1. **Create Cluster:**
   - Visit https://www.mongodb.com/cloud/atlas
   - Sign up / Log in
   - Create new cluster (Free tier available)
   - Wait for cluster to be created (~5 minutes)

2. **Configure Access:**
   - Click "Database Access"
   - Add new database user
   - Set username and password
   - Grant "Read and write to any database" permission

3. **Network Access:**
   - Click "Network Access"
   - Add IP Address
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add specific IP addresses

4. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password
   - Update `MONGO_URI` in server `.env` file

---

## ▶️ Running the Application

### Method 1: Run Both Servers Separately

#### Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Keep this terminal running. You should see:
```
🚀 EduLearn Server Running!
📍 Port: 5000
📊 Database: Connected
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Keep this terminal running. You should see:
```
➜  Local:   http://localhost:5173/
```

### Method 2: Using VS Code Integrated Terminals

1. **Open VS Code**
2. **Split Terminal:**
   - Click Terminal > New Terminal
   - Click the split icon (⊞) to create split view
   
3. **Left Terminal - Backend:**
   ```bash
   cd server
   npm run dev
   ```

4. **Right Terminal - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

### Method 3: Using VS Code Tasks (Advanced)

Create `.vscode/tasks.json`:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Backend",
      "type": "shell",
      "command": "cd server && npm run dev",
      "presentation": {
        "group": "dev"
      }
    },
    {
      "label": "Start Frontend",
      "type": "shell",
      "command": "cd frontend && npm run dev",
      "presentation": {
        "group": "dev"
      }
    }
  ]
}
```

Then: Terminal > Run Task > Select task

---

## 🧪 Testing the Application

### 1. Open Browser
Navigate to: **http://localhost:5173**

### 2. Test Homepage
- Should see beautiful landing page
- Hero section with CTAs
- Featured courses
- Categories
- All should be responsive

### 3. Test Navigation
- Click "Login" - should see login page
- Click "Sign Up" - should see registration page
- Click "Courses" - should see course listing
- Click on a course - should see course details

### 4. Test Registration
1. Go to Sign Up page
2. Fill in form:
   - Name: Test User
   - Email: test@example.com
   - Password: Test123!
   - Select role: Student
   - Agree to terms
3. Click "Create Account"
4. Should redirect to dashboard (if backend connected)

### 5. Test API Endpoints

Using VS Code REST Client or Thunder Client:

```http
### Register User
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Test123!",
  "role": "student"
}

### Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Test123!"
}

### Get Courses
GET http://localhost:5000/api/courses

### Get Single Course
GET http://localhost:5000/api/courses/COURSE_ID
```

---

## 🚀 Deployment

### Deploy Backend (Heroku/Railway/Render)

#### Using Render (Recommended - Free Tier):

1. **Prepare for Deployment:**
   - Make sure `.env` variables are set
   - Ensure `package.json` has start script:
     ```json
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
     ```

2. **Deploy to Render:**
   - Visit https://render.com
   - Sign up with GitHub
   - Click "New +" > "Web Service"
   - Connect your repository
   - Configure:
     - Name: edulearn-backend
     - Environment: Node
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Add environment variables from `.env`
   - Click "Create Web Service"

3. **Get Deployment URL:**
   - Example: `https://edulearn-backend.onrender.com`
   - Update frontend `.env`:
     ```env
     VITE_API_URL=https://edulearn-backend.onrender.com/api
     ```

### Deploy Frontend (Vercel/Netlify)

#### Using Vercel (Recommended):

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```

4. **Follow prompts:**
   - Set up and deploy: Yes
   - Which scope: Your account
   - Link to existing project: No
   - Project name: edulearn-frontend
   - Directory: ./
   - Override settings: No

5. **Add Environment Variables:**
   - Go to Vercel dashboard
   - Select your project
   - Settings > Environment Variables
   - Add `VITE_API_URL` with your backend URL

6. **Redeploy:**
   ```bash
   vercel --prod
   ```

---

## 🔧 Troubleshooting

### Problem: MongoDB Won't Start

**Solution:**
```bash
# Check if MongoDB is running
# Windows
tasklist | findstr mongod

# Mac/Linux
ps aux | grep mongod

# Try starting manually
mongod --dbpath /path/to/data
```

### Problem: Port Already in Use

**Solution:**
```bash
# Find process using port
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

Or change port in `.env`:
```env
PORT=5001
```

### Problem: Frontend Can't Connect to Backend

**Solutions:**
1. Check backend is running: `http://localhost:5000`
2. Check CORS settings in `server.js`
3. Verify `.env` VITE_API_URL is correct
4. Check browser console for errors
5. Restart both servers

### Problem: npm install fails

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Windows
rmdir /s node_modules
del package-lock.json
npm install
```

### Problem: Tailwind styles not working

**Solutions:**
1. Check `tailwind.config.js` content paths
2. Restart dev server: `Ctrl+C` then `npm run dev`
3. Clear browser cache
4. Check `index.css` has Tailwind directives

### Problem: Database Connection Error

**Solutions:**
1. Check MongoDB is running
2. Verify MONGO_URI in `.env`
3. For Atlas: Check IP whitelist
4. Check username/password
5. Test connection:
   ```javascript
   const mongoose = require('mongoose');
   mongoose.connect('your_uri')
     .then(() => console.log('Connected!'))
     .catch(err => console.error(err));
   ```

---

## 📝 Quick Reference Commands

### Backend Commands:
```bash
npm run dev          # Start development server
npm start            # Start production server
npm install          # Install dependencies
```

### Frontend Commands:
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm install          # Install dependencies
```

### Git Commands:
```bash
git clone <url>      # Clone repository
git pull             # Get latest changes
git status           # Check status
git add .            # Stage all changes
git commit -m "msg"  # Commit changes
git push             # Push to GitHub
```

### MongoDB Commands:
```bash
mongosh              # Connect to MongoDB
show dbs             # List databases
use edulearn         # Switch to database
show collections     # List collections
db.users.find()      # Query users
```

---

## ✅ Final Checklist

Before you start development:
- [ ] Node.js installed and verified
- [ ] MongoDB installed/configured
- [ ] VS Code installed with extensions
- [ ] Project cloned/downloaded
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Environment files configured
- [ ] MongoDB running
- [ ] Backend server starts successfully
- [ ] Frontend server starts successfully
- [ ] Can access homepage at localhost:5173
- [ ] API endpoints respond correctly

---

## 🎉 You're Ready!

Your EduLearn platform is now set up and running!

### Access Points:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/ (shows endpoints)

### Next Steps:
1. Explore the application
2. Test all features
3. Review the code
4. Customize as needed
5. Deploy to production

### Need Help?
- Check documentation files
- Review troubleshooting section
- Check browser console for errors
- Check server terminal for errors

---

**Happy Coding! 🚀**

Built with ❤️ for the education community
