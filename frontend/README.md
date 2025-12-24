# EduLearn Frontend

React-based frontend for the EduLearn E-Learning Platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Structure

```
src/
├── components/      # Reusable UI components
│   ├── ui/          # Base components (Button, Card, Input...)
│   ├── Navbar.jsx   # Navigation bar
│   ├── Footer.jsx   # Footer component
│   └── CourseCard.jsx
├── pages/           # Page components
│   ├── dashboards/  # Role-specific dashboards
│   │   ├── StudentDashboard.jsx
│   │   ├── InstructorDashboard.jsx
│   │   └── AdminDashboard.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Courses.jsx
│   └── CourseDetail.jsx
├── layouts/         # Layout components
├── context/         # React Context
├── services/        # API services
├── routes/          # Route protection
├── App.jsx          # Main component
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## 🎨 UI Components

All components are in `src/components/ui/`:

- **Button** - Primary, secondary, outline, ghost variants
- **Input** - Text fields with validation
- **Card** - Container component
- **Badge** - Labels and tags
- **ProgressBar** - Progress indicators
- **Modal** - Dialog windows
- **Select** - Dropdown menus
- **Avatar** - User avatars
- **Rating** - Star ratings
- **Spinner** - Loading indicators
- **Alert** - Notifications

## 🌐 Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=EduLearn
```

## 📱 Responsive

- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+

## 🔑 Authentication

Uses JWT tokens stored in localStorage. The AuthContext provides:

```javascript
const { user, login, logout, isAuthenticated } = useAuth();
```

## 📜 Available Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview build
npm run lint     # Run linter
```
