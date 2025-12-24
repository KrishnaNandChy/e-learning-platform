# EduLearn - Modern E-Learning Platform

A modern, scalable, and professional E-Learning platform built with React, Vite, and Tailwind CSS. Inspired by platforms like Udemy, Coursera, and Skillshare.

![EduLearn Platform](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=400&fit=crop)

## 🚀 Features

### For Students
- **Browse & Search Courses**: Advanced filtering by category, level, price, and rating
- **User Dashboard**: Track learning progress, view enrolled courses, and access certificates
- **Course Details**: Comprehensive course pages with curriculum, reviews, and instructor information
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Progress Tracking**: Visual progress bars and completion tracking
- **Wishlist**: Save courses for later

### For Instructors
- **Instructor Dashboard**: Manage courses and view student analytics
- **Course Creation**: Create and publish courses with detailed curriculum
- **Student Engagement**: Monitor student progress and provide support

### Design Features
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Professional Design System**: Consistent colors, typography, and spacing
- **Accessible**: WCAG compliant with proper semantic HTML
- **Fast Performance**: Optimized with lazy loading and code splitting

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.2.0
- **Build Tool**: Vite 5.1.4
- **Styling**: Tailwind CSS 3.x
- **Routing**: React Router DOM 6.22.3
- **HTTP Client**: Axios 1.6.7
- **Icons**: SVG icons (inline)
- **Fonts**: Inter & Poppins (Google Fonts)

## 📁 Project Structure

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Avatar.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── Rating.jsx
│   │   │   └── index.js
│   │   ├── Footer.jsx
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Courses.jsx
│   │   ├── CourseDetail.jsx
│   │   └── InstructorDashboard.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── course.service.js
│   │   └── user.service.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎨 Design System

### Color Palette

#### Primary Colors
- Primary: Blue shades (#0ea5e9 - #0c4a6e)
- Secondary: Purple/Pink shades (#d946ef - #701a75)

#### Semantic Colors
- Success: Green (#22c55e)
- Warning: Yellow/Orange (#f59e0b)
- Danger: Red (#ef4444)

### Typography

- **Headings**: Poppins (Semi-bold, Bold)
- **Body Text**: Inter (Regular, Medium)
- **Font Sizes**: Responsive with mobile-first approach

### Spacing

- Container: Max-width 1280px with responsive padding
- Sections: 64px - 96px vertical padding
- Cards: 24px padding with 12px rounded corners

### Components

All reusable components are located in `src/components/ui/`:

- **Button**: Multiple variants (primary, secondary, outline, ghost) and sizes
- **Card**: Flexible card component with Header, Body, and Footer
- **Input**: Form input with label, error states, and icons
- **Badge**: Status indicators with color variants
- **ProgressBar**: Visual progress tracking
- **Avatar**: User avatars with fallback support
- **Rating**: Star rating display
- **Modal**: Overlay modal dialogs

## 📄 Pages

### Public Pages

1. **Home** (`/`)
   - Hero section with CTA
   - Featured courses
   - Categories showcase
   - Testimonials
   - Statistics

2. **Login** (`/login`)
   - Email/password authentication
   - Social login options
   - Remember me functionality
   - Forgot password link

3. **Sign Up** (`/signup`)
   - User registration form
   - Role selection (Student/Instructor)
   - Terms acceptance
   - Social signup options

4. **Forgot Password** (`/forgot-password`)
   - Email submission
   - Success state with instructions

5. **Courses** (`/courses`)
   - Course listing with grid layout
   - Advanced filters (category, level, price, rating)
   - Search functionality
   - Sort options

6. **Course Details** (`/courses/:id`)
   - Course overview
   - Curriculum with expandable sections
   - Instructor information
   - Student reviews
   - Sticky enrollment card

### Protected Pages

1. **Dashboard** (`/dashboard`)
   - Learning progress overview
   - Continue learning section
   - Completed courses
   - Wishlist
   - Statistics cards

2. **Instructor Dashboard** (`/instructor/dashboard`)
   - Course management
   - Student analytics
   - Revenue tracking

## 🔐 Authentication

The platform includes a complete authentication flow:

- Login with email/password
- Social authentication (Google, Facebook, GitHub)
- Registration with role selection
- Password reset functionality
- Protected routes with role-based access

## 📱 Responsive Design

The platform is fully responsive with breakpoints:

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile Features
- Collapsible navigation menu
- Touch-friendly buttons and cards
- Optimized layouts for small screens
- Bottom sticky bars for CTAs

## 🎯 Best Practices

### Code Quality
- Component-based architecture
- Reusable UI components
- Consistent naming conventions
- Clean and readable code

### Performance
- Lazy loading for images
- Optimized bundle size
- Minimal re-renders
- Code splitting (ready for implementation)

### Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance

## 🔄 API Integration

Services are ready in `src/services/`:

- **auth.service.js**: Authentication endpoints
- **course.service.js**: Course CRUD operations
- **user.service.js**: User profile management

Example usage:
```javascript
import { getCourses, getCourseById } from './services/course.service';

// Fetch all courses
const courses = await getCourses();

// Fetch specific course
const course = await getCourseById(courseId);
```

## 🎨 Customization

### Tailwind Configuration

Edit `tailwind.config.js` to customize:
- Colors
- Fonts
- Spacing
- Breakpoints
- Animations

### CSS Variables

Global styles in `src/index.css` include:
- Custom color schemes
- Animation keyframes
- Reusable component classes

## 🐛 Troubleshooting

### Common Issues

1. **Tailwind styles not working**
   - Ensure `tailwind.config.js` includes correct content paths
   - Restart dev server after config changes

2. **Build errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Clear Vite cache: `rm -rf .vite`

3. **Port already in use**
   - Change port in `vite.config.js`
   - Or kill process using the port

## 🚀 Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy dist folder to Netlify
```

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## 📈 Future Enhancements

- [ ] Real-time notifications
- [ ] Video player integration
- [ ] Payment gateway integration
- [ ] Advanced search with filters
- [ ] Course recommendations AI
- [ ] Live chat support
- [ ] Mobile app (React Native)
- [ ] Internationalization (i18n)
- [ ] Dark mode theme
- [ ] Analytics dashboard

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- Design inspiration from Udemy, Coursera, and Skillshare
- Icons from Heroicons
- Images from Unsplash
- Fonts from Google Fonts

## 📞 Support

For support, email support@edulearn.com or join our Discord channel.

## 🔗 Links

- [Live Demo](https://edulearn-demo.vercel.app)
- [Documentation](https://docs.edulearn.com)
- [API Documentation](https://api.edulearn.com/docs)

---

Made with ❤️ by the EduLearn Team
