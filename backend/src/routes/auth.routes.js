const express = require('express');
const router = express.Router();
const {
  register,
  login,
  instructorLogin,
  adminLogin,
  logout,
  refreshToken,
  getMe,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
  createInstructor
} = require('../controllers/auth.controller');
const { authenticate, authorize, verifyRefreshToken } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
  updateProfileValidator,
  createInstructorValidator
} = require('../validators/auth.validator');
const { processUpload } = require('../middlewares/upload');

// Public routes
router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/instructor/login', loginValidator, validate, instructorLogin);
router.post('/admin/login', loginValidator, validate, adminLogin);
router.post('/forgot-password', forgotPasswordValidator, validate, forgotPassword);
router.put('/reset-password/:token', resetPasswordValidator, validate, resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/refresh-token', verifyRefreshToken, refreshToken);

// Protected routes
router.use(authenticate);

router.post('/logout', logout);
router.get('/me', getMe);
router.post('/resend-verification', resendVerification);
router.put('/change-password', changePasswordValidator, validate, changePassword);
router.put('/update-profile', updateProfileValidator, validate, updateProfile);
router.put('/update-avatar', processUpload('avatar'), updateProfile);

// Admin only routes
router.post(
  '/create-instructor',
  authorize('admin', 'admin_helper'),
  createInstructorValidator,
  validate,
  createInstructor
);

module.exports = router;
