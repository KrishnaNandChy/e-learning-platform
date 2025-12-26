require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const InstructorProfile = require('../models/InstructorProfile');
const logger = require('../utils/logger');

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB for seeding...');

    // Clear existing data (optional - comment out in production)
    // await User.deleteMany({});
    // await Category.deleteMany({});
    // await InstructorProfile.deleteMany({});

    // Create admin user if not exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123456', 12);
      
      const admin = await User.create({
        name: 'Super Admin',
        email: process.env.ADMIN_EMAIL || 'admin@eduplatform.com',
        password: hashedPassword,
        role: 'admin',
        isEmailVerified: true,
        isActive: true,
        isApproved: true
      });
      
      logger.info(`Admin user created: ${admin.email}`);
    } else {
      logger.info('Admin user already exists');
    }

    // Create default categories
    const categories = [
      { name: 'Development', icon: '💻', description: 'Web, Mobile, Software Development' },
      { name: 'Business', icon: '📊', description: 'Business, Finance, Entrepreneurship' },
      { name: 'IT & Software', icon: '🖥️', description: 'IT Certifications, Network, Security' },
      { name: 'Design', icon: '🎨', description: 'Graphic Design, UI/UX, 3D' },
      { name: 'Marketing', icon: '📈', description: 'Digital Marketing, SEO, Social Media' },
      { name: 'Personal Development', icon: '🎯', description: 'Leadership, Career Development' },
      { name: 'Photography & Video', icon: '📷', description: 'Photography, Video Production' },
      { name: 'Music', icon: '🎵', description: 'Music Theory, Instruments' },
      { name: 'Health & Fitness', icon: '💪', description: 'Fitness, Nutrition, Wellness' },
      { name: 'Teaching & Academics', icon: '📚', description: 'Science, Math, Languages' }
    ];

    for (const cat of categories) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        await Category.create(cat);
        logger.info(`Category created: ${cat.name}`);
      }
    }

    // Create subcategories for Development
    const devCategory = await Category.findOne({ name: 'Development' });
    if (devCategory) {
      const subCategories = [
        { name: 'Web Development', parent: devCategory._id, icon: '🌐' },
        { name: 'Mobile Development', parent: devCategory._id, icon: '📱' },
        { name: 'Programming Languages', parent: devCategory._id, icon: '⌨️' },
        { name: 'Game Development', parent: devCategory._id, icon: '🎮' },
        { name: 'Database Design', parent: devCategory._id, icon: '🗄️' },
        { name: 'Software Testing', parent: devCategory._id, icon: '🧪' }
      ];

      for (const subCat of subCategories) {
        const exists = await Category.findOne({ name: subCat.name, parent: subCat.parent });
        if (!exists) {
          await Category.create(subCat);
          logger.info(`Subcategory created: ${subCat.name}`);
        }
      }
    }

    // Create a sample instructor
    const instructorExists = await User.findOne({ email: 'instructor@eduplatform.com' });
    if (!instructorExists) {
      const hashedPassword = await bcrypt.hash('Instructor@123', 12);
      
      const instructor = await User.create({
        name: 'John Instructor',
        email: 'instructor@eduplatform.com',
        password: hashedPassword,
        role: 'instructor',
        isEmailVerified: true,
        isActive: true,
        isApproved: true,
        bio: 'Experienced software developer with 10+ years in the industry.'
      });

      await InstructorProfile.create({
        user: instructor._id,
        headline: 'Senior Software Developer & Educator',
        biography: 'I have been teaching programming for over 5 years and have helped thousands of students launch their careers in tech.',
        expertise: ['JavaScript', 'React', 'Node.js', 'Python', 'Machine Learning'],
        qualifications: [
          { degree: 'MSc Computer Science', institution: 'MIT', year: 2015 }
        ],
        experience: [
          { title: 'Senior Developer', company: 'Tech Corp', duration: '5 years' }
        ]
      });

      logger.info(`Instructor created: ${instructor.email}`);
    }

    // Create a sample student
    const studentExists = await User.findOne({ email: 'student@eduplatform.com' });
    if (!studentExists) {
      const hashedPassword = await bcrypt.hash('Student@123', 12);
      
      const student = await User.create({
        name: 'Jane Student',
        email: 'student@eduplatform.com',
        password: hashedPassword,
        role: 'student',
        isEmailVerified: true,
        isActive: true
      });

      logger.info(`Student created: ${student.email}`);
    }

    logger.info('Database seeding completed successfully!');
    logger.info(`
      ====================================
      Default Credentials:
      ====================================
      Admin:
        Email: ${process.env.ADMIN_EMAIL || 'admin@eduplatform.com'}
        Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}
      
      Instructor:
        Email: instructor@eduplatform.com
        Password: Instructor@123
      
      Student:
        Email: student@eduplatform.com
        Password: Student@123
      ====================================
    `);

    process.exit(0);
  } catch (error) {
    logger.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
