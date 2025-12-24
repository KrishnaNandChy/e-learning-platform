# EduLearn Platform - Complete Setup Guide

This guide will help you set up and run the EduLearn E-Learning Platform on your local machine.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Setup](#detailed-setup)
4. [Project Structure](#project-structure)
5. [Development Workflow](#development-workflow)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16.0.0 or higher)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`

- **npm** (comes with Node.js) or **yarn**
  - Verify npm: `npm --version`
  - Or install yarn: `npm install -g yarn`

- **Git** (optional, for cloning)
  - Download from: https://git-scm.com/
  - Verify: `git --version`

- **Code Editor** (recommended: VS Code)
  - Download from: https://code.visualstudio.com/

## Quick Start

```bash
# 1. Navigate to frontend directory
cd /workspace/frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:5173
```

That's it! The application should now be running.

## Detailed Setup

### Step 1: Install Dependencies

```bash
cd /workspace/frontend
npm install
```

This will install:
- React 18.2.0
- Vite 5.1.4
- Tailwind CSS 3.x
- React Router DOM 6.22.3
- Axios 1.6.7
- And other dependencies

### Step 2: Environment Setup (Optional)

Create a `.env` file in the frontend directory if you need environment variables:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=EduLearn
```

### Step 3: Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173`

### Step 4: Build for Production

```bash
npm run build
```

Built files will be in the `dist` directory.

### Step 5: Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # Reusable UI components
│   │   ├── Footer.jsx
│   │   └── Navbar.jsx
│   ├── pages/          # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Courses.jsx
│   │   └── CourseDetail.jsx
│   ├── context/        # React Context
│   ├── routes/         # Route configurations
│   ├── services/       # API services
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Development Workflow

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code (if ESLint is configured)
npm run lint
```

### Making Changes

1. **Components**: Add new components in `src/components/`
2. **Pages**: Add new pages in `src/pages/`
3. **Styles**: Update Tailwind classes or modify `src/index.css`
4. **Routes**: Update `src/App.jsx` to add new routes

### Tailwind CSS

The project uses Tailwind CSS for styling. You can:

- Use utility classes directly in JSX
- Customize theme in `tailwind.config.js`
- Add custom styles in `src/index.css`

Example:
```jsx
<button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700">
  Click Me
</button>
```

## Features Overview

### Implemented Pages

1. **Home Page** (`/`)
   - Hero section with CTA
   - Featured courses grid
   - Categories showcase
   - Testimonials
   - Stats section

2. **Authentication**
   - Login (`/login`)
   - Sign Up (`/signup`)
   - Forgot Password (`/forgot-password`)

3. **Courses**
   - Course Listing (`/courses`)
   - Course Details (`/courses/:id`)

4. **Dashboard**
   - Student Dashboard (`/dashboard`)
   - Instructor Dashboard (`/instructor/dashboard`)

### UI Components

All reusable components are in `src/components/ui/`:

```jsx
import { Button, Card, Input, Badge, Rating } from './components/ui';

// Use them in your components
<Button variant="primary">Click Me</Button>
<Card>
  <Card.Body>
    Content here
  </Card.Body>
</Card>
```

## Troubleshooting

### Issue: Tailwind styles not appearing

**Solution:**
1. Ensure all content paths in `tailwind.config.js` are correct
2. Restart the development server: `Ctrl+C` then `npm run dev`
3. Clear browser cache

### Issue: Port 5173 already in use

**Solution:**
1. Kill the process using port 5173
2. Or change port in `vite.config.js`:
```js
export default {
  server: {
    port: 3000
  }
}
```

### Issue: Module not found errors

**Solution:**
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Vite build fails

**Solution:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## Next Steps

### Connecting to Backend API

1. Update API endpoints in `src/services/`:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
   ```

2. Use axios in services:
   ```javascript
   import axios from 'axios';
   
   export const getCourses = async () => {
     const response = await axios.get(`${API_URL}/courses`);
     return response.data;
   };
   ```

### Adding Authentication

1. Implement auth context in `src/context/AuthContext.jsx`
2. Use protected routes in `src/routes/ProtectedRoute.jsx`
3. Store JWT tokens in localStorage or cookies

### Deployment

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel login
vercel
```

#### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure redirects for SPA

#### Custom Server
```bash
npm run build
# Copy dist folder to your server
# Serve with nginx or Apache
```

## Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)

## Support

If you encounter any issues:

1. Check this guide's troubleshooting section
2. Review the main README.md
3. Check Vite/React/Tailwind documentation
4. Open an issue on GitHub (if applicable)

## Tips for Success

1. **Use the browser's DevTools** to debug React components
2. **Install React DevTools** extension for better debugging
3. **Use Tailwind CSS IntelliSense** extension in VS Code
4. **Enable Hot Module Replacement (HMR)** is enabled by default
5. **Organize your code** - keep components small and focused

---

Happy Coding! 🚀
