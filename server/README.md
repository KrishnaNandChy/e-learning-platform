# EduLearn Backend API

Node.js/Express backend API for the EduLearn E-Learning Platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Seed database with sample data
npm run seed

# Start development server
npm run dev

# Start production server
npm start
```

## 📁 Structure

```
server/
├── config/
│   └── db.js            # MongoDB connection
├── controllers/
│   ├── auth.controller.js
│   ├── course.controller.js
│   ├── admin.controller.js
│   ├── review.controller.js
│   └── notification.controller.js
├── middleware/
│   ├── auth.middleware.js
│   ├── role.middleware.js
│   └── error.middleware.js
├── models/
│   ├── User.model.js
│   ├── Course.model.js
│   ├── Lesson.model.js
│   ├── Review.model.js
│   ├── Notification.model.js
│   └── Category.model.js
├── routes/
│   ├── auth.routes.js
│   ├── course.routes.js
│   ├── admin.routes.js
│   ├── review.routes.js
│   └── notification.routes.js
├── seeds/
│   └── seed.js          # Database seeder
├── utils/
│   └── jwt.js           # JWT utilities
├── server.js            # Entry point
└── package.json
```

## 🌐 Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/edulearn
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Courses
- `GET /api/courses` - List courses (with filters)
- `GET /api/courses/:id` - Get course details
- `GET /api/courses/featured` - Featured courses
- `POST /api/courses` - Create course (Instructor)
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `POST /api/courses/:id/enroll` - Enroll in course
- `GET /api/courses/user/enrolled` - Get enrolled courses
- `GET /api/courses/instructor/my-courses` - Instructor's courses

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/courses` - List all courses
- `PUT /api/admin/courses/:id/feature` - Toggle featured

### Reviews
- `GET /api/courses/:id/reviews` - Course reviews
- `POST /api/courses/:id/reviews` - Add review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/read-all` - Mark all as read
- `PUT /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

## 👤 Test Accounts

After running `npm run seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@edulearn.com | admin123 |
| Instructor | angela@edulearn.com | instructor123 |
| Student | john@example.com | student123 |

## 📜 Scripts

```bash
npm start     # Production server
npm run dev   # Development with nodemon
npm run seed  # Seed database
```

## 🔒 Security

- JWT authentication
- bcrypt password hashing
- Role-based access control
- Input validation
- CORS configured
