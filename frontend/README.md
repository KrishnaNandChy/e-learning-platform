# EduLearn - E-Learning Platform Frontend

A modern, scalable, and professional E-Learning Platform frontend built with React, inspired by platforms like Udemy, Coursera, and Skillshare.

![EduLearn](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200)

## 🚀 Features

### Core Pages
- **Home Page** - Hero section, featured courses, categories, testimonials, instructor highlights
- **Authentication** - Login, Sign Up, Forgot Password with form validation
- **Course Listing** - Search, filters (category, level, price, rating), grid/list views
- **Course Details** - Curriculum, instructor info, reviews, pricing
- **User Dashboard** - Enrolled courses, progress tracking, notifications, learning goals

### UI Components
- Button (multiple variants: primary, secondary, outline, ghost, danger, success)
- Input (with validation states, password toggle, icons)
- Card (default, elevated, outlined, filled)
- Badge (various colors and sizes)
- Progress Bar (animated, multiple variants)
- Modal (with overlay, close on escape)
- Select dropdown
- Avatar (with status indicators)
- Rating stars
- Spinner/Loader
- Alert (success, error, warning, info)

### Design System
- Comprehensive CSS variables for colors, typography, spacing
- Consistent design tokens throughout
- Utility classes for rapid development
- Smooth animations and transitions

## 🛠️ Tech Stack

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Vite** - Build tool & dev server
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **CSS3** - Custom design system (no CSS framework)

## 📦 Project Structure

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Avatar.jsx
│   │   │   ├── Rating.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── Alert.jsx
│   │   │   └── index.js
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── CourseCard.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Courses.jsx
│   │   ├── CourseDetail.jsx
│   │   └── Dashboard.jsx
│   ├── layouts/
│   │   └── MainLayout.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   ├── services/
│   │   ├── auth.service.js
│   │   └── course.service.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css              # Design system & global styles
├── .env.example
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Update `.env` with your API URL
```
VITE_API_URL=http://localhost:5000/api
```

5. Start development server
```bash
npm run dev
```

6. Open http://localhost:5173 in your browser

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎨 Design System

### Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--primary-600` | #4f46e5 | Primary buttons, links |
| `--secondary-500` | #10b981 | Success states, accents |
| `--gray-900` | #111827 | Primary text |
| `--gray-500` | #6b7280 | Secondary text |
| `--error-500` | #ef4444 | Error states |
| `--warning-500` | #f59e0b | Warning states |

### Typography

- **Font Family**: Inter (Google Fonts)
- **Font Sizes**: xs (12px) to 6xl (60px)
- **Font Weights**: Light (300) to Extra Bold (800)

### Spacing

Uses a consistent 4px base spacing scale:
- `--spacing-1`: 4px
- `--spacing-2`: 8px
- `--spacing-4`: 16px
- `--spacing-8`: 32px
- etc.

### Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

## 📱 Responsive Design

The platform is fully responsive across:
- Desktop (1280px+)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## 🔐 Authentication Flow

1. User visits protected route
2. `ProtectedRoute` component checks authentication
3. If not authenticated, redirect to `/login`
4. After login, user is redirected back to intended page
5. JWT token stored in localStorage

## 📝 API Integration

The frontend expects a REST API with the following endpoints:

### Auth
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Request password reset
- `GET /api/auth/me` - Get current user

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `GET /api/courses/enrolled` - Get enrolled courses
- `POST /api/courses/:id/enroll` - Enroll in course

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own e-learning platform!

## 👥 Target Users

- **Students** - Browse, enroll, and learn from courses
- **Instructors** - Create and manage courses (future phase)
- **Admins** - Platform management (future phase)

## 🔮 Future Enhancements

- Video player integration
- Real-time chat/discussions
- Payment gateway integration
- Instructor dashboard
- Admin panel
- Dark mode
- Multi-language support
- Push notifications
- Certificate generation
