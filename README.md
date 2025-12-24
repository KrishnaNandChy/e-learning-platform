# 🎓 EduLearn - Complete E-Learning Platform

A full-stack e-learning platform built with React (Frontend) and Node.js/Express/MongoDB (Backend). Features include course management, user authentication, role-based dashboards for Students, Instructors, and Admins.

![EduLearn Platform](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800)

## 🚀 Features

### For Students
- 📚 Browse and search courses with filters
- 🎯 Enroll in courses and track progress
- 📊 Personal dashboard with learning statistics
- 🔔 Notifications for course updates
- ⭐ Rate and review courses
- ❤️ Wishlist functionality
- 📜 Certificates on completion

### For Instructors
- 📝 Create and manage courses
- 📈 Analytics dashboard with earnings
- 👥 Student management
- 💬 Respond to reviews
- 📊 Performance metrics

### For Admins
- 👥 Complete user management
- 📚 Course oversight and moderation
- 📊 Platform-wide analytics
- ⚙️ System settings management
- 🔔 Broadcast notifications

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Navigation
- **Vite** - Build tool
- **Axios** - HTTP client
- **Lucide React** - Icons
- **CSS3** - Styling with custom design system

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
/workspace/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/          # Base UI components (Button, Card, etc.)
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── CourseCard.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── dashboards/  # Role-specific dashboards
│   │   │   │   ├── StudentDashboard.jsx
│   │   │   │   ├── InstructorDashboard.jsx
│   │   │   │   └── AdminDashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Courses.jsx
│   │   │   └── CourseDetail.jsx
│   │   ├── layouts/         # Layout components
│   │   ├── context/         # React Context (Auth)
│   │   ├── services/        # API services
│   │   ├── routes/          # Route protection
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles & design system
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── vite.config.js
│
├── server/                   # Node.js backend API
│   ├── config/              # Configuration files
│   │   └── db.js            # Database connection
│   ├── controllers/         # Route controllers
│   │   ├── auth.controller.js
│   │   ├── course.controller.js
│   │   ├── admin.controller.js
│   │   ├── review.controller.js
│   │   └── notification.controller.js
│   ├── middleware/          # Express middleware
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   └── error.middleware.js
│   ├── models/              # Mongoose models
│   │   ├── User.model.js
│   │   ├── Course.model.js
│   │   ├── Lesson.model.js
│   │   ├── Review.model.js
│   │   ├── Notification.model.js
│   │   └── Category.model.js
│   ├── routes/              # API routes
│   │   ├── auth.routes.js
│   │   ├── course.routes.js
│   │   ├── admin.routes.js
│   │   ├── review.routes.js
│   │   └── notification.routes.js
│   ├── seeds/               # Database seeders
│   │   └── seed.js          # Sample data seeder
│   ├── utils/               # Utility functions
│   │   └── jwt.js           # JWT helpers
│   ├── .env                 # Environment variables
│   ├── .env.example         # Example env file
│   ├── server.js            # Server entry point
│   └── package.json
│
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- **VS Code** (recommended) - [Download](https://code.visualstudio.com/)

### 📥 Step 1: Download the Project

#### Option A: Clone from GitHub
```bash
# Clone the repository
git clone https://github.com/your-username/edulearn-platform.git

# Navigate to project folder
cd edulearn-platform
```

#### Option B: Download ZIP
1. Go to the GitHub repository
2. Click the green "Code" button
3. Select "Download ZIP"
4. Extract the ZIP file
5. Open the extracted folder in VS Code

### 📦 Step 2: Install Dependencies

Open terminal in VS Code (`Ctrl + ~` or `Cmd + ~`)

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### ⚙️ Step 3: Configure Environment Variables

#### Backend (.env)
Create or update `/server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/edulearn
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

#### Frontend (.env)
Create or update `/frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=EduLearn
VITE_APP_URL=http://localhost:5173
```

### 🗄️ Step 4: Setup MongoDB

#### Option A: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service:
   - **Windows**: MongoDB should auto-start, or use `mongod`
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

#### Option B: MongoDB Atlas (Cloud - Recommended for Production)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Create a database user
4. Get your connection string
5. Update `MONGO_URI` in `/server/.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/edulearn
```

### 🌱 Step 5: Seed the Database (Optional but Recommended)

```bash
cd server
npm run seed
```

This creates sample data including:
- **Admin**: admin@edulearn.com / admin123
- **Instructor**: angela@edulearn.com / instructor123
- **Student**: john@example.com / student123
- Sample courses, reviews, and notifications

### 🏃 Step 6: Run the Application

#### Terminal 1 - Start Backend Server
```bash
cd server
npm run dev
```
Backend runs at: http://localhost:5000

#### Terminal 2 - Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs at: http://localhost:5173

### 🎉 Step 7: Access the Application

Open http://localhost:5173 in your browser

#### Test Accounts (after seeding):

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@edulearn.com | admin123 |
| Instructor | angela@edulearn.com | instructor123 |
| Student | john@example.com | student123 |

## 📱 Responsive Design

The platform is fully responsive and works on:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Laptops (1024px+)
- 🖥️ Desktops (1280px+)

## 🔗 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/change-password` | Change password |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | Get all courses (with filters) |
| GET | `/api/courses/:id` | Get single course |
| GET | `/api/courses/featured` | Get featured courses |
| POST | `/api/courses` | Create course (Instructor) |
| PUT | `/api/courses/:id` | Update course |
| DELETE | `/api/courses/:id` | Delete course |
| POST | `/api/courses/:id/enroll` | Enroll in course |
| GET | `/api/courses/user/enrolled` | Get enrolled courses |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Get dashboard stats |
| GET | `/api/admin/users` | Get all users |
| PUT | `/api/admin/users/:id` | Update user |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET | `/api/admin/courses` | Get all courses |

### Reviews & Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses/:id/reviews` | Get course reviews |
| POST | `/api/courses/:id/reviews` | Add review |
| GET | `/api/notifications` | Get notifications |
| PUT | `/api/notifications/read-all` | Mark all as read |

## 🎨 Design System

The platform uses a comprehensive CSS design system with:

### Colors
- **Primary**: Indigo (#6366f1)
- **Secondary**: Green (#10b981)
- **Accent**: Purple (#8b5cf6)
- **Neutrals**: Gray scale
- **Semantic**: Success, Warning, Error, Info

### Typography
- **Font**: Inter (Google Fonts)
- **Scale**: xs (12px) to 4xl (36px)

### Components
- Buttons (multiple variants)
- Input fields
- Cards
- Badges
- Progress bars
- Modals
- Alerts
- Avatars
- Ratings
- Spinners

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation
- XSS protection
- CORS configuration
- Rate limiting (can be added)

## 📝 Available Scripts

### Backend (server/)
```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
npm run seed     # Seed database with sample data
```

### Frontend (frontend/)
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect to Vercel or Netlify
3. Set environment variables
4. Deploy

### Backend (Railway/Render/Heroku)
1. Push code to GitHub
2. Connect to your hosting service
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Update connection string
3. Configure IP whitelist

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by Udemy, Coursera, and Unacademy
- Icons from Lucide React
- Fonts from Google Fonts
- Images from Unsplash

---

## 📞 Support

If you have any questions or need help, please:
1. Check the documentation above
2. Search existing issues
3. Create a new issue with detailed information

Happy Learning! 🎓
