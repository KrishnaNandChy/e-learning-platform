# 🎓 EduPlatform - Enterprise E-Learning Platform

A **production-ready, enterprise-level full-stack E-Learning Platform** inspired by Udemy, Coursera, and Unacademy. Built with modern technologies and best practices for scalability, security, and user experience.

## 🌟 Features

### User Roles & Access Control
- **Students**: Self-register, browse courses, enroll, learn, take tests, ask doubts, create notes, earn certificates
- **Instructors**: Admin-managed accounts, create/manage courses, answer doubts, view analytics
- **Admin/Admin Helper**: Full platform access, manage users, approve courses, handle payments

### Core Modules
- ✅ **Authentication & RBAC**: JWT with refresh tokens, role-based access control, email verification
- ✅ **Course Management**: CRUD operations, curriculum builder, draft-publish workflow, admin approval
- ✅ **Learning Module**: Video/text lessons, progress tracking, resources, bookmarks
- ✅ **Doubt & Q&A System**: Per-lesson questions, attachments, status tracking, multi-role replies
- ✅ **Notes System**: Private student notes linked to lessons
- ✅ **Assessment System**: MCQs, True/False, timed exams, **mandatory negative marking**, auto-evaluation
- ✅ **Certificate Generation**: Auto-generated PDF certificates with QR codes, unique IDs, public verification
- ✅ **Payment System**: Stripe integration, order management, refunds, instructor earnings
- ✅ **Notifications**: Email and in-app notifications for various events

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Refresh Tokens
- **File Storage**: Cloudinary (images, videos, documents)
- **Payments**: Stripe
- **Email**: Nodemailer with HTML templates
- **PDF Generation**: PDFKit with QRCode
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Client**: Axios with interceptors
- **UI Components**: Custom component library
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
workspace/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Cloudinary, Email config
│   │   ├── controllers/     # Route handlers
│   │   ├── middlewares/     # Auth, error handling, upload
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── validators/      # Input validation
│   │   ├── utils/           # Helpers, ApiResponse, ApiError
│   │   └── server.js        # App entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   │   ├── (main)/      # Public pages (home, courses, auth)
│   │   │   ├── (dashboard)/ # Dashboard pages (student, instructor, admin)
│   │   │   └── (learning)/  # Learning interface
│   │   ├── components/      # Reusable UI components
│   │   ├── lib/             # API client, utilities
│   │   ├── store/           # Zustand stores
│   │   ├── styles/          # Global styles
│   │   └── types/           # TypeScript interfaces
│   ├── tailwind.config.ts
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- Cloudinary account
- Stripe account (for payments)
- SMTP server (for emails)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
cp .env.example .env
```

4. Configure environment variables:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/elearning

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM="EduPlatform <noreply@eduplatform.com>"

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

5. Seed the database (optional):
```bash
npm run seed
```

6. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_APP_NAME=EduPlatform
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 API Documentation

API documentation is available at `/api-docs` when running the backend server:
```
http://localhost:5000/api-docs
```

### Key API Endpoints

| Module | Endpoint | Description |
|--------|----------|-------------|
| Auth | `POST /api/v1/auth/register` | Register new student |
| Auth | `POST /api/v1/auth/login` | Student login |
| Auth | `POST /api/v1/auth/create-instructor` | Create instructor (admin) |
| Courses | `GET /api/v1/courses` | List all courses |
| Courses | `POST /api/v1/courses` | Create course (instructor) |
| Lessons | `POST /api/v1/lessons` | Create lesson |
| Enrollments | `POST /api/v1/enrollments/free/:courseId` | Enroll in free course |
| Tests | `POST /api/v1/tests/:id/submit` | Submit test answers |
| Certificates | `POST /api/v1/certificates/generate/:enrollmentId` | Generate certificate |
| Payments | `POST /api/v1/payments/create-intent` | Create payment intent |

## 🔐 Security Features

- JWT authentication with refresh token rotation
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- Secure file uploads with type checking
- CORS configuration
- Helmet security headers
- XSS protection

## 🎨 UI/UX Features

- Modern, clean design inspired by top e-learning platforms
- Fully responsive layout (mobile, tablet, desktop)
- Dark/light mode ready (color system)
- Smooth animations with Framer Motion
- Loading states and skeletons
- Toast notifications
- Form validation with helpful error messages

## 📊 Dashboard Features

### Student Dashboard
- Course progress tracking
- Learning streaks
- Certificate collection
- Doubt management
- Personal notes

### Instructor Dashboard
- Course management
- Student analytics
- Revenue tracking
- Doubt responses
- Earnings reports

### Admin Dashboard
- Platform analytics
- User management
- Course approval workflow
- Payment management
- Audit logs

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend build
cd frontend
npm run build
```

## 📦 Deployment

### Backend
- Deploy to any Node.js hosting (AWS, GCP, DigitalOcean, Heroku)
- Set up MongoDB Atlas for database
- Configure Cloudinary for file storage

### Frontend
- Deploy to Vercel (recommended for Next.js)
- Configure environment variables
- Set up API proxy or CORS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by Udemy, Coursera, Unacademy, and Skillshare
- Built with modern best practices for enterprise applications
- Designed for scalability and maintainability
