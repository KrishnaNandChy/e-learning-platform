const crypto = require('crypto');
const User = require('../models/User');
const InstructorProfile = require('../models/InstructorProfile');
const AuditLog = require('../models/AuditLog');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { asyncHandler } = require('../middlewares/errorHandler');
const { sendEmail, emailTemplates } = require('../config/email');
const { generateTempPassword } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * @desc    Register a new student
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, gender, parentName } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(ApiError.conflict('User with this email already exists'));
  }
  
  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
    gender,
    parentName,
    role: 'student'
  });
  
  // Generate email verification token
  const verificationToken = user.generateEmailVerificationToken();
  await user.save({ validateBeforeSave: false });
  
  // Send verification email
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
  const emailContent = emailTemplates.verification(name, verificationUrl);
  
  try {
    await sendEmail({
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    });
  } catch (error) {
    logger.error('Email send failed:', error);
    // Don't fail registration if email fails
  }
  
  // Log audit
  await AuditLog.log({
    userId: user._id,
    action: 'user_registered',
    category: 'auth',
    description: `New student registered: ${email}`,
    resourceType: 'user',
    resourceId: user._id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });
  
  // Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  await user.save({ validateBeforeSave: false });
  
  // Set cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  };
  
  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, cookieOptions);
  
  // Remove sensitive data
  user.password = undefined;
  user.refreshToken = undefined;
  
  return ApiResponse.created(res, {
    user,
    accessToken,
    refreshToken
  }, 'Registration successful. Please verify your email.');
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  
  // Find user
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    return next(ApiError.unauthorized('Invalid credentials'));
  }
  
  // Check if account is locked
  if (user.isLocked()) {
    return next(ApiError.forbidden('Account is temporarily locked. Please try again later.'));
  }
  
  // Check if account is active
  if (!user.isActive) {
    return next(ApiError.forbidden('Your account has been deactivated'));
  }
  
  // Verify password
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    await user.incrementLoginAttempts();
    return next(ApiError.unauthorized('Invalid credentials'));
  }
  
  // Reset login attempts
  await user.resetLoginAttempts();
  
  // Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  await user.save({ validateBeforeSave: false });
  
  // Set cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
  
  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, cookieOptions);
  
  // Log audit
  await AuditLog.log({
    userId: user._id,
    action: 'user_logged_in',
    category: 'auth',
    description: `User logged in: ${email}`,
    resourceType: 'user',
    resourceId: user._id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });
  
  // Remove sensitive data
  user.password = undefined;
  user.refreshToken = undefined;
  
  return ApiResponse.success(res, {
    user,
    accessToken,
    refreshToken
  }, 'Login successful');
});

/**
 * @desc    Instructor login
 * @route   POST /api/v1/auth/instructor/login
 * @access  Public
 */
const instructorLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  
  // Find instructor
  const user = await User.findOne({ email, role: 'instructor' }).select('+password');
  
  if (!user) {
    return next(ApiError.unauthorized('Invalid credentials or not an instructor account'));
  }
  
  // Check if approved
  if (!user.isApproved) {
    return next(ApiError.forbidden('Your instructor account is pending approval'));
  }
  
  // Check if active
  if (!user.isActive) {
    return next(ApiError.forbidden('Your account has been deactivated'));
  }
  
  // Check if locked
  if (user.isLocked()) {
    return next(ApiError.forbidden('Account is temporarily locked'));
  }
  
  // Verify password
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    await user.incrementLoginAttempts();
    return next(ApiError.unauthorized('Invalid credentials'));
  }
  
  await user.resetLoginAttempts();
  
  // Get instructor profile
  const instructorProfile = await InstructorProfile.findOne({ user: user._id });
  
  // Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  await user.save({ validateBeforeSave: false });
  
  // Set cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
  
  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, cookieOptions);
  
  // Log audit
  await AuditLog.log({
    userId: user._id,
    action: 'user_logged_in',
    category: 'auth',
    description: `Instructor logged in: ${email}`,
    resourceType: 'user',
    resourceId: user._id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });
  
  user.password = undefined;
  user.refreshToken = undefined;
  
  return ApiResponse.success(res, {
    user,
    instructorProfile,
    accessToken,
    refreshToken
  }, 'Login successful');
});

/**
 * @desc    Admin login
 * @route   POST /api/v1/auth/admin/login
 * @access  Public
 */
const adminLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  
  // Find admin
  const user = await User.findOne({ 
    email, 
    role: { $in: ['admin', 'admin_helper'] } 
  }).select('+password');
  
  if (!user) {
    return next(ApiError.unauthorized('Invalid credentials or not an admin account'));
  }
  
  if (!user.isActive) {
    return next(ApiError.forbidden('Your account has been deactivated'));
  }
  
  if (user.isLocked()) {
    return next(ApiError.forbidden('Account is temporarily locked'));
  }
  
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    await user.incrementLoginAttempts();
    return next(ApiError.unauthorized('Invalid credentials'));
  }
  
  await user.resetLoginAttempts();
  
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  await user.save({ validateBeforeSave: false });
  
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
  
  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, cookieOptions);
  
  await AuditLog.log({
    userId: user._id,
    action: 'user_logged_in',
    category: 'auth',
    description: `Admin logged in: ${email}`,
    resourceType: 'user',
    resourceId: user._id,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });
  
  user.password = undefined;
  user.refreshToken = undefined;
  
  return ApiResponse.success(res, {
    user,
    accessToken,
    refreshToken
  }, 'Login successful');
});

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res, next) => {
  // Clear refresh token
  await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  
  // Clear cookies
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  
  await AuditLog.log({
    userId: req.user._id,
    action: 'user_logged_out',
    category: 'auth',
    description: `User logged out: ${req.user.email}`,
    resourceType: 'user',
    resourceId: req.user._id,
    ipAddress: req.ip
  });
  
  return ApiResponse.success(res, null, 'Logged out successfully');
});

/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh-token
 * @access  Public
 */
const refreshToken = asyncHandler(async (req, res, next) => {
  const accessToken = req.user.generateAccessToken();
  
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000
  };
  
  res.cookie('accessToken', accessToken, cookieOptions);
  
  return ApiResponse.success(res, { accessToken }, 'Token refreshed');
});

/**
 * @desc    Get current user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  
  let additionalData = {};
  
  if (user.role === 'instructor') {
    additionalData.instructorProfile = await InstructorProfile.findOne({ user: user._id });
  }
  
  return ApiResponse.success(res, { user, ...additionalData });
});

/**
 * @desc    Verify email
 * @route   GET /api/v1/auth/verify-email/:token
 * @access  Public
 */
const verifyEmail = asyncHandler(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpire: { $gt: Date.now() }
  });
  
  if (!user) {
    return next(ApiError.badRequest('Invalid or expired verification token'));
  }
  
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  await user.save();
  
  await AuditLog.log({
    userId: user._id,
    action: 'email_verified',
    category: 'auth',
    description: `Email verified: ${user.email}`,
    resourceType: 'user',
    resourceId: user._id,
    ipAddress: req.ip
  });
  
  return ApiResponse.success(res, null, 'Email verified successfully');
});

/**
 * @desc    Resend verification email
 * @route   POST /api/v1/auth/resend-verification
 * @access  Private
 */
const resendVerification = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  
  if (user.isEmailVerified) {
    return next(ApiError.badRequest('Email is already verified'));
  }
  
  const verificationToken = user.generateEmailVerificationToken();
  await user.save({ validateBeforeSave: false });
  
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
  const emailContent = emailTemplates.verification(user.name, verificationUrl);
  
  await sendEmail({
    to: user.email,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text
  });
  
  return ApiResponse.success(res, null, 'Verification email sent');
});

/**
 * @desc    Forgot password
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  
  if (!user) {
    return next(ApiError.notFound('No user found with this email'));
  }
  
  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });
  
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const emailContent = emailTemplates.passwordReset(user.name, resetUrl);
  
  try {
    await sendEmail({
      to: user.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    });
    
    await AuditLog.log({
      userId: user._id,
      action: 'password_reset_requested',
      category: 'auth',
      description: `Password reset requested: ${user.email}`,
      resourceType: 'user',
      resourceId: user._id,
      ipAddress: req.ip
    });
    
    return ApiResponse.success(res, null, 'Password reset email sent');
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save({ validateBeforeSave: false });
    
    return next(ApiError.internal('Email could not be sent'));
  }
});

/**
 * @desc    Reset password
 * @route   PUT /api/v1/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now() }
  });
  
  if (!user) {
    return next(ApiError.badRequest('Invalid or expired reset token'));
  }
  
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  user.refreshToken = null;
  await user.save();
  
  await AuditLog.log({
    userId: user._id,
    action: 'password_reset_completed',
    category: 'auth',
    description: `Password reset completed: ${user.email}`,
    resourceType: 'user',
    resourceId: user._id,
    ipAddress: req.ip
  });
  
  return ApiResponse.success(res, null, 'Password reset successful');
});

/**
 * @desc    Change password
 * @route   PUT /api/v1/auth/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');
  
  const isMatch = await user.comparePassword(req.body.currentPassword);
  
  if (!isMatch) {
    return next(ApiError.unauthorized('Current password is incorrect'));
  }
  
  user.password = req.body.newPassword;
  user.refreshToken = null;
  await user.save();
  
  // Generate new tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  await user.save({ validateBeforeSave: false });
  
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
  
  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, cookieOptions);
  
  await AuditLog.log({
    userId: user._id,
    action: 'password_changed',
    category: 'auth',
    description: `Password changed: ${user.email}`,
    resourceType: 'user',
    resourceId: user._id,
    ipAddress: req.ip
  });
  
  return ApiResponse.success(res, { accessToken, refreshToken }, 'Password changed successfully');
});

/**
 * @desc    Update profile
 * @route   PUT /api/v1/auth/update-profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res, next) => {
  const allowedFields = ['name', 'phone', 'gender', 'bio', 'parentName', 'socialLinks', 'preferences'];
  const updates = {};
  
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });
  
  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  );
  
  await AuditLog.log({
    userId: user._id,
    action: 'user_updated',
    category: 'user',
    description: `Profile updated: ${user.email}`,
    resourceType: 'user',
    resourceId: user._id,
    ipAddress: req.ip
  });
  
  return ApiResponse.success(res, { user }, 'Profile updated successfully');
});

/**
 * @desc    Create instructor account (Admin only)
 * @route   POST /api/v1/auth/create-instructor
 * @access  Private/Admin
 */
const createInstructor = asyncHandler(async (req, res, next) => {
  const { name, email, phone, headline, biography, expertise } = req.body;
  
  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(ApiError.conflict('User with this email already exists'));
  }
  
  // Generate temporary password
  const tempPassword = generateTempPassword();
  
  // Create user
  const user = await User.create({
    name,
    email,
    password: tempPassword,
    phone,
    role: 'instructor',
    isEmailVerified: true,
    isApproved: true
  });
  
  // Create instructor profile
  const instructorProfile = await InstructorProfile.create({
    user: user._id,
    headline,
    biography,
    expertise
  });
  
  // Send email with credentials
  const emailContent = emailTemplates.instructorAccountCreated(name, email, tempPassword);
  
  try {
    await sendEmail({
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    });
  } catch (error) {
    logger.error('Failed to send instructor credentials email:', error);
  }
  
  await AuditLog.log({
    userId: req.user._id,
    action: 'instructor_created',
    category: 'admin',
    description: `Instructor account created: ${email} by ${req.user.email}`,
    resourceType: 'user',
    resourceId: user._id,
    ipAddress: req.ip
  });
  
  return ApiResponse.created(res, {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    instructorProfile
  }, 'Instructor account created successfully');
});

module.exports = {
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
};
