const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  confirmPayment,
  getMyOrders,
  getOrder,
  requestRefund,
  processRefund,
  getInstructorEarnings,
  getAllPayments,
  getRevenueAnalytics,
  handleWebhook
} = require('../controllers/payment.controller');
const { authenticate, authorize } = require('../middlewares/auth');

// Webhook route (must be before authentication middleware)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes
router.use(authenticate);

// Student routes
router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.get('/my-orders', getMyOrders);
router.get('/order/:orderId', getOrder);
router.post('/:orderId/refund-request', requestRefund);

// Instructor routes
router.get('/instructor/earnings', authorize('instructor'), getInstructorEarnings);

// Admin routes
router.get('/admin/all', authorize('admin', 'admin_helper'), getAllPayments);
router.get('/admin/analytics', authorize('admin', 'admin_helper'), getRevenueAnalytics);
router.put('/:orderId/process-refund', authorize('admin'), processRefund);

module.exports = router;
