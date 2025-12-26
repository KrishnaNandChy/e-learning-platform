const express = require('express');
const router = express.Router();
const {
  generateCertificate,
  getMyCertificates,
  getCertificate,
  verifyCertificate,
  downloadCertificate,
  revokeCertificate,
  getAllCertificates
} = require('../controllers/certificate.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateObjectId } = require('../middlewares/validate');

// Public route for verification
router.get('/verify/:certificateId', verifyCertificate);

// Protected routes
router.use(authenticate);

// Student routes
router.get('/', getMyCertificates);
router.post('/generate/:enrollmentId', validateObjectId('enrollmentId'), generateCertificate);
router.get('/:id', validateObjectId('id'), getCertificate);
router.get('/:id/download', validateObjectId('id'), downloadCertificate);

// Admin routes
router.get('/admin/all', authorize('admin', 'admin_helper'), getAllCertificates);
router.put('/:id/revoke', authorize('admin'), validateObjectId('id'), revokeCertificate);

module.exports = router;
