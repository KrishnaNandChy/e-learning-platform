const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { asyncHandler } = require('../middlewares/errorHandler');
const { sendEmail, emailTemplates } = require('../config/email');
const { buildPaginationInfo } = require('../utils/helpers');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const { uploadToCloudinary } = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Generate certificate
 * @route   POST /api/v1/certificates/generate/:enrollmentId
 * @access  Private
 */
const generateCertificate = asyncHandler(async (req, res, next) => {
  const enrollment = await Enrollment.findById(req.params.enrollmentId)
    .populate('course', 'title certificateEnabled certificateCompletionThreshold instructor')
    .populate('user', 'name email');

  if (!enrollment) {
    return next(ApiError.notFound('Enrollment not found'));
  }

  // Check ownership
  if (enrollment.user._id.toString() !== req.user._id.toString() &&
      !['admin', 'admin_helper'].includes(req.user.role)) {
    return next(ApiError.forbidden('Not authorized'));
  }

  // Check if certificate already exists
  const existingCertificate = await Certificate.findOne({
    enrollment: enrollment._id
  });

  if (existingCertificate) {
    return ApiResponse.success(res, { certificate: existingCertificate }, 'Certificate already exists');
  }

  // Check if course has certificate enabled
  if (!enrollment.course.certificateEnabled) {
    return next(ApiError.badRequest('Certificates are not enabled for this course'));
  }

  // Check completion threshold
  if (enrollment.progress.percentComplete < enrollment.course.certificateCompletionThreshold) {
    return next(ApiError.badRequest(
      `Complete at least ${enrollment.course.certificateCompletionThreshold}% of the course to earn a certificate`
    ));
  }

  // Get instructor details
  const instructor = await User.findById(enrollment.course.instructor).select('name');

  // Generate QR code
  const verificationUrl = `${process.env.CERTIFICATE_VERIFY_URL}`;
  
  // Create certificate record first to get the ID
  const certificate = await Certificate.create({
    user: enrollment.user._id,
    course: enrollment.course._id,
    enrollment: enrollment._id,
    instructor: enrollment.course.instructor,
    studentName: enrollment.user.name,
    courseName: enrollment.course.title,
    instructorName: instructor.name,
    completionDate: enrollment.completedAt || new Date(),
    completionPercentage: enrollment.progress.percentComplete,
    totalHours: Math.round(enrollment.progress.totalWatchTime / 3600)
  });

  // Generate QR code with certificate ID
  const qrCodeData = await QRCode.toDataURL(
    `${verificationUrl}/${certificate.certificateId}`
  );
  certificate.qrCode = qrCodeData;

  // Generate PDF
  const pdfBuffer = await generateCertificatePDF(certificate);

  // Upload to cloudinary
  const uploadResult = await uploadToCloudinary(
    `data:application/pdf;base64,${pdfBuffer.toString('base64')}`,
    'certificates',
    'raw'
  );

  certificate.file = {
    public_id: uploadResult.public_id,
    url: uploadResult.url
  };

  await certificate.save();

  // Update enrollment
  enrollment.certificate = certificate._id;
  await enrollment.save();

  // Send notification
  await Notification.createNotification(
    enrollment.user._id,
    'certificate_ready',
    '🏆 Certificate Earned!',
    `Congratulations! Your certificate for "${enrollment.course.title}" is ready!`,
    { 
      certificateId: certificate._id, 
      courseId: enrollment.course._id,
      link: `/certificates/${certificate._id}` 
    }
  );

  // Send email
  const emailContent = emailTemplates.certificateReady(
    enrollment.user.name,
    enrollment.course.title,
    `${process.env.FRONTEND_URL}/certificates/${certificate._id}`
  );

  await sendEmail({
    to: enrollment.user.email,
    subject: emailContent.subject,
    html: emailContent.html
  });

  await AuditLog.log({
    userId: req.user._id,
    action: 'certificate_generated',
    category: 'course',
    description: `Certificate generated for ${enrollment.user.name} - ${enrollment.course.title}`,
    resourceType: 'certificate',
    resourceId: certificate._id,
    ipAddress: req.ip
  });

  return ApiResponse.created(res, { certificate }, 'Certificate generated successfully');
});

/**
 * @desc    Get user's certificates
 * @route   GET /api/v1/certificates
 * @access  Private
 */
const getMyCertificates = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [certificates, total] = await Promise.all([
    Certificate.find({ user: req.user._id, isValid: true })
      .populate('course', 'title slug thumbnail')
      .sort({ issueDate: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Certificate.countDocuments({ user: req.user._id, isValid: true })
  ]);

  const pagination = buildPaginationInfo(page, limit, total);

  return ApiResponse.paginated(res, certificates, pagination);
});

/**
 * @desc    Get single certificate
 * @route   GET /api/v1/certificates/:id
 * @access  Private
 */
const getCertificate = asyncHandler(async (req, res, next) => {
  const certificate = await Certificate.findById(req.params.id)
    .populate('course', 'title slug thumbnail')
    .populate('user', 'name')
    .populate('instructor', 'name');

  if (!certificate) {
    return next(ApiError.notFound('Certificate not found'));
  }

  return ApiResponse.success(res, { certificate });
});

/**
 * @desc    Verify certificate (Public)
 * @route   GET /api/v1/certificates/verify/:certificateId
 * @access  Public
 */
const verifyCertificate = asyncHandler(async (req, res, next) => {
  const certificate = await Certificate.findOne({
    certificateId: req.params.certificateId
  })
    .populate('course', 'title')
    .populate('user', 'name')
    .populate('instructor', 'name');

  if (!certificate) {
    return next(ApiError.notFound('Certificate not found'));
  }

  return ApiResponse.success(res, {
    isValid: certificate.isValid,
    certificate: {
      certificateId: certificate.certificateId,
      studentName: certificate.studentName,
      courseName: certificate.courseName,
      instructorName: certificate.instructorName,
      completionDate: certificate.completionDate,
      issueDate: certificate.issueDate,
      grade: certificate.grade,
      isValid: certificate.isValid,
      revokedAt: certificate.revokedAt,
      revokedReason: certificate.revokedReason
    }
  });
});

/**
 * @desc    Download certificate
 * @route   GET /api/v1/certificates/:id/download
 * @access  Private
 */
const downloadCertificate = asyncHandler(async (req, res, next) => {
  const certificate = await Certificate.findById(req.params.id);

  if (!certificate) {
    return next(ApiError.notFound('Certificate not found'));
  }

  // Check ownership or admin
  if (certificate.user.toString() !== req.user._id.toString() &&
      !['admin', 'admin_helper'].includes(req.user.role)) {
    return next(ApiError.forbidden('Not authorized'));
  }

  if (!certificate.isValid) {
    return next(ApiError.badRequest('This certificate has been revoked'));
  }

  // Increment download count
  await certificate.incrementDownload();

  await AuditLog.log({
    userId: req.user._id,
    action: 'certificate_downloaded',
    category: 'course',
    description: `Certificate downloaded: ${certificate.certificateId}`,
    resourceType: 'certificate',
    resourceId: certificate._id,
    ipAddress: req.ip
  });

  // Redirect to file URL
  return ApiResponse.success(res, { downloadUrl: certificate.file.url });
});

/**
 * @desc    Revoke certificate (Admin)
 * @route   PUT /api/v1/certificates/:id/revoke
 * @access  Private/Admin
 */
const revokeCertificate = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;

  const certificate = await Certificate.findById(req.params.id)
    .populate('user', 'name email');

  if (!certificate) {
    return next(ApiError.notFound('Certificate not found'));
  }

  await certificate.revoke(reason, req.user._id);

  // Notify user
  await Notification.createNotification(
    certificate.user._id,
    'system',
    'Certificate Revoked',
    `Your certificate for "${certificate.courseName}" has been revoked. Reason: ${reason}`,
    { link: '/my-certificates' }
  );

  await AuditLog.log({
    userId: req.user._id,
    action: 'certificate_revoked',
    category: 'admin',
    description: `Certificate revoked: ${certificate.certificateId} - ${reason}`,
    resourceType: 'certificate',
    resourceId: certificate._id,
    ipAddress: req.ip
  });

  return ApiResponse.success(res, { certificate }, 'Certificate revoked');
});

/**
 * @desc    Get all certificates (Admin)
 * @route   GET /api/v1/certificates/admin/all
 * @access  Private/Admin
 */
const getAllCertificates = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, search, courseId, isValid } = req.query;

  const query = {};
  if (courseId) query.course = courseId;
  if (isValid !== undefined) query.isValid = isValid === 'true';

  if (search) {
    query.$or = [
      { certificateId: { $regex: search, $options: 'i' } },
      { studentName: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [certificates, total] = await Promise.all([
    Certificate.find(query)
      .populate('course', 'title')
      .populate('user', 'name email')
      .sort({ issueDate: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Certificate.countDocuments(query)
  ]);

  const pagination = buildPaginationInfo(page, limit, total);

  return ApiResponse.paginated(res, certificates, pagination);
});

// Helper function to generate certificate PDF
async function generateCertificatePDF(certificate) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // Background
    doc.rect(0, 0, doc.page.width, doc.page.height)
       .fill('#FAFAFA');

    // Border
    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
       .lineWidth(3)
       .stroke('#667eea');

    // Inner border
    doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80)
       .lineWidth(1)
       .stroke('#764ba2');

    // Header
    doc.fontSize(16)
       .fillColor('#667eea')
       .text('EDUPLATFORM', 0, 70, { align: 'center' });

    // Title
    doc.fontSize(42)
       .fillColor('#333333')
       .text('Certificate of Completion', 0, 120, { align: 'center' });

    // Decorative line
    doc.moveTo(200, 175)
       .lineTo(doc.page.width - 200, 175)
       .lineWidth(2)
       .stroke('#667eea');

    // Presented to
    doc.fontSize(14)
       .fillColor('#666666')
       .text('This is to certify that', 0, 200, { align: 'center' });

    // Student name
    doc.fontSize(32)
       .fillColor('#333333')
       .text(certificate.studentName, 0, 230, { align: 'center' });

    // Course completion text
    doc.fontSize(14)
       .fillColor('#666666')
       .text('has successfully completed the course', 0, 280, { align: 'center' });

    // Course name
    doc.fontSize(24)
       .fillColor('#667eea')
       .text(certificate.courseName, 0, 310, { align: 'center' });

    // Details
    doc.fontSize(12)
       .fillColor('#666666')
       .text(`Completed on: ${certificate.completionDate.toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'long',
         day: 'numeric'
       })}`, 0, 360, { align: 'center' });

    if (certificate.grade && certificate.grade !== 'N/A') {
      doc.text(`Grade: ${certificate.grade}`, 0, 380, { align: 'center' });
    }

    // Instructor signature
    doc.fontSize(14)
       .fillColor('#333333')
       .text(certificate.instructorName, 150, 430, { align: 'left' });
    
    doc.fontSize(10)
       .fillColor('#666666')
       .text('Instructor', 150, 448, { align: 'left' });

    // Certificate ID
    doc.fontSize(10)
       .fillColor('#999999')
       .text(`Certificate ID: ${certificate.certificateId}`, 0, 480, { align: 'center' });

    // QR Code (if available)
    if (certificate.qrCode) {
      // Convert base64 to buffer and add as image
      const qrBuffer = Buffer.from(certificate.qrCode.split(',')[1], 'base64');
      doc.image(qrBuffer, doc.page.width - 150, 380, { width: 80 });
    }

    // Verification URL
    doc.fontSize(8)
       .fillColor('#999999')
       .text(`Verify at: ${certificate.verificationUrl}`, 0, 500, { align: 'center' });

    doc.end();
  });
}

module.exports = {
  generateCertificate,
  getMyCertificates,
  getCertificate,
  verifyCertificate,
  downloadCertificate,
  revokeCertificate,
  getAllCertificates
};
