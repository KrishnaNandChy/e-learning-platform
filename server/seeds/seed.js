require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User.model');
const Course = require('../models/Course.model');
const Lesson = require('../models/Lesson.model');
const Review = require('../models/Review.model');
const Notification = require('../models/Notification.model');

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Review.deleteMany({});
    await Notification.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@edulearn.com',
      password: adminPassword,
      role: 'admin',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    });
    console.log('Created admin user');

    // Create instructors
    const instructorPassword = await bcrypt.hash('instructor123', 10);
    const instructors = await User.create([
      {
        name: 'Dr. Angela Yu',
        email: 'angela@edulearn.com',
        password: instructorPassword,
        role: 'instructor',
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
        bio: 'Lead instructor with 10+ years of experience in web development.',
        expertise: ['Web Development', 'JavaScript', 'React', 'Python'],
      },
      {
        name: 'Jonas Schmedtmann',
        email: 'jonas@edulearn.com',
        password: instructorPassword,
        role: 'instructor',
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200',
        bio: 'Professional JavaScript developer and educator.',
        expertise: ['JavaScript', 'Node.js', 'CSS'],
      },
      {
        name: 'Maximilian Schwarzmüller',
        email: 'max@edulearn.com',
        password: instructorPassword,
        role: 'instructor',
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200',
        bio: 'Full-stack web developer and best-selling instructor.',
        expertise: ['React', 'Angular', 'Vue.js', 'Node.js'],
      },
    ]);
    console.log('Created instructors');

    // Create students
    const studentPassword = await bcrypt.hash('student123', 10);
    const students = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: studentPassword,
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: studentPassword,
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: studentPassword,
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
      },
    ]);
    console.log('Created students');

    // Create courses
    const courses = await Course.create([
      {
        title: 'Complete Web Development Bootcamp 2024',
        subtitle: 'Become a full-stack web developer with just one course.',
        description: 'This is the most comprehensive web development course. Learn HTML, CSS, JavaScript, React, Node.js, MongoDB, and more!',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600',
        instructor: instructors[0]._id,
        price: 499,
        originalPrice: 3999,
        category: 'Web Development',
        level: 'All Levels',
        language: 'English',
        duration: '65h 30m',
        totalLessons: 478,
        requirements: [
          'No programming experience needed',
          'A computer with internet access',
          'Desire to learn',
        ],
        whatYouWillLearn: [
          'Build 16 web development projects',
          'Learn HTML, CSS, JavaScript, React, Node.js',
          'Master frontend and backend development',
          'Work as a freelance web developer',
        ],
        isPublished: true,
        isFeatured: true,
        isBestseller: true,
        rating: 4.8,
        totalReviews: 245000,
        totalStudents: 750000,
      },
      {
        title: 'React - The Complete Guide 2024',
        subtitle: 'Dive in and learn React.js from scratch!',
        description: 'Learn React from the ground up. This course includes hooks, Redux, React Router, and Next.js.',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600',
        instructor: instructors[2]._id,
        price: 599,
        originalPrice: 3999,
        category: 'Web Development',
        level: 'Intermediate',
        language: 'English',
        duration: '48h',
        totalLessons: 320,
        requirements: [
          'JavaScript basics required',
          'HTML & CSS knowledge',
        ],
        whatYouWillLearn: [
          'Build powerful React applications',
          'Learn React Hooks',
          'Master Redux for state management',
          'Build with Next.js',
        ],
        isPublished: true,
        isFeatured: true,
        isBestseller: true,
        rating: 4.7,
        totalReviews: 195000,
        totalStudents: 680000,
      },
      {
        title: 'JavaScript - The Complete Guide',
        subtitle: 'Modern JavaScript from the beginning - all the way up to JS expert level!',
        description: 'The most comprehensive JavaScript course. Learn everything from basics to advanced concepts.',
        thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600',
        instructor: instructors[1]._id,
        price: 549,
        originalPrice: 2999,
        category: 'Web Development',
        level: 'All Levels',
        language: 'English',
        duration: '52h 30m',
        totalLessons: 410,
        requirements: [
          'No prior knowledge required',
          'Basic computer skills',
        ],
        whatYouWillLearn: [
          'JavaScript from scratch to expert',
          'Async programming',
          'ES6+ features',
          'Build real projects',
        ],
        isPublished: true,
        isFeatured: true,
        rating: 4.7,
        totalReviews: 120000,
        totalStudents: 450000,
      },
      {
        title: 'Machine Learning A-Z',
        subtitle: 'Master Machine Learning on Python & R',
        description: 'Learn to create Machine Learning Algorithms in Python and R from two Data Science experts.',
        thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600',
        instructor: instructors[0]._id,
        price: 649,
        originalPrice: 4999,
        category: 'Data Science',
        level: 'Intermediate',
        language: 'English',
        duration: '44h 15m',
        totalLessons: 280,
        requirements: [
          'Basic Python knowledge',
          'High school mathematics',
        ],
        whatYouWillLearn: [
          'Machine Learning algorithms',
          'Build ML models',
          'Deep Learning basics',
          'Real-world applications',
        ],
        isPublished: true,
        isFeatured: true,
        isBestseller: true,
        rating: 4.6,
        totalReviews: 180000,
        totalStudents: 890000,
      },
      {
        title: 'UI/UX Design Masterclass',
        subtitle: 'Learn UI/UX design from scratch with Figma',
        description: 'Complete guide to becoming a UI/UX designer. Learn design principles, Figma, and create stunning interfaces.',
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600',
        instructor: instructors[1]._id,
        price: 449,
        originalPrice: 2499,
        category: 'Design',
        level: 'Beginner',
        language: 'English',
        duration: '32h 20m',
        totalLessons: 180,
        requirements: [
          'No prior design experience needed',
          'Creative mindset',
        ],
        whatYouWillLearn: [
          'UI/UX design fundamentals',
          'Master Figma',
          'Design systems',
          'User research',
        ],
        isPublished: true,
        isNewCourse: true,
        rating: 4.7,
        totalReviews: 42000,
        totalStudents: 150000,
      },
      {
        title: 'Digital Marketing Complete Guide',
        subtitle: 'Master SEO, Social Media, Content Marketing & More',
        description: 'Complete digital marketing course covering all aspects of online marketing.',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
        instructor: instructors[2]._id,
        price: 399,
        originalPrice: 2999,
        category: 'Marketing',
        level: 'Beginner',
        language: 'English',
        duration: '23h 45m',
        totalLessons: 150,
        requirements: [
          'No marketing experience needed',
          'Computer with internet',
        ],
        whatYouWillLearn: [
          'SEO optimization',
          'Social media marketing',
          'Email marketing',
          'Google Ads & Analytics',
        ],
        isPublished: true,
        isNewCourse: true,
        rating: 4.5,
        totalReviews: 95000,
        totalStudents: 320000,
      },
    ]);
    console.log('Created courses');

    // Update instructor stats
    for (const instructor of instructors) {
      const instructorCourses = courses.filter(
        (c) => c.instructor.toString() === instructor._id.toString()
      );
      const totalStudents = instructorCourses.reduce((sum, c) => sum + c.totalStudents, 0);
      
      await User.findByIdAndUpdate(instructor._id, {
        totalCourses: instructorCourses.length,
        totalStudents,
        rating: 4.7,
      });
    }

    // Enroll students in courses
    for (const student of students) {
      const randomCourses = courses.slice(0, Math.floor(Math.random() * 3) + 1);
      for (const course of randomCourses) {
        student.enrolledCourses.push({
          course: course._id,
          enrolledAt: new Date(),
          progress: Math.floor(Math.random() * 100),
          completedLessons: [],
        });
      }
      await student.save();
    }
    console.log('Enrolled students in courses');

    // Create sample reviews
    const reviewData = [
      {
        user: students[0]._id,
        course: courses[0]._id,
        rating: 5,
        title: 'Best course ever!',
        comment: 'This course completely changed my career. Angela explains everything so clearly!',
        helpful: 234,
      },
      {
        user: students[1]._id,
        course: courses[0]._id,
        rating: 5,
        title: 'Highly recommended',
        comment: 'Comprehensive and well-structured. Perfect for beginners.',
        helpful: 156,
      },
      {
        user: students[2]._id,
        course: courses[1]._id,
        rating: 4,
        title: 'Great React course',
        comment: 'Very detailed explanations. Some sections could be updated.',
        helpful: 89,
      },
    ];
    await Review.create(reviewData);
    console.log('Created reviews');

    // Create notifications for students
    for (const student of students) {
      await Notification.create({
        user: student._id,
        type: 'system',
        title: 'Welcome to EduLearn!',
        message: 'Start your learning journey today. Browse our courses and begin learning!',
      });
    }
    console.log('Created notifications');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📧 Test Accounts:');
    console.log('Admin: admin@edulearn.com / admin123');
    console.log('Instructor: angela@edulearn.com / instructor123');
    console.log('Student: john@example.com / student123\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
