const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const courseRoutes = require('./course.routes');
const lessonRoutes = require('./lesson.routes');
const enrollmentRoutes = require('./enrollment.routes');
const doubtRoutes = require('./doubt.routes');
const noteRoutes = require('./note.routes');
const testRoutes = require('./test.routes');
const certificateRoutes = require('./certificate.routes');
const paymentRoutes = require('./payment.routes');
const notificationRoutes = require('./notification.routes');
const categoryRoutes = require('./category.routes');
const adminRoutes = require('./admin.routes');
const reviewRoutes = require('./review.routes');

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/lessons', lessonRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/doubts', doubtRoutes);
router.use('/notes', noteRoutes);
router.use('/tests', testRoutes);
router.use('/certificates', certificateRoutes);
router.use('/payments', paymentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/categories', categoryRoutes);
router.use('/admin', adminRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router;
