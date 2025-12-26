const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    unique: true,
    default: () => `CERT-${Date.now().toString(36).toUpperCase()}-${uuidv4().slice(0, 8).toUpperCase()}`
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrollment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  instructorName: {
    type: String,
    required: true
  },
  completionDate: {
    type: Date,
    default: Date.now
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  completionPercentage: {
    type: Number,
    required: true
  },
  totalHours: {
    type: Number,
    default: 0
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'Pass', 'N/A'],
    default: 'N/A'
  },
  testScore: {
    percentage: Number,
    passed: Boolean
  },
  skills: [{
    type: String
  }],
  template: {
    type: String,
    enum: ['default', 'professional', 'modern', 'classic', 'minimal'],
    default: 'default'
  },
  file: {
    public_id: String,
    url: String
  },
  verificationUrl: {
    type: String
  },
  qrCode: {
    type: String // Base64 encoded QR code
  },
  isValid: {
    type: Boolean,
    default: true
  },
  revokedAt: Date,
  revokedReason: String,
  revokedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  lastDownloadedAt: Date,
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
certificateSchema.index({ certificateId: 1 });
certificateSchema.index({ user: 1 });
certificateSchema.index({ course: 1 });
certificateSchema.index({ enrollment: 1 }, { unique: true });
certificateSchema.index({ isValid: 1 });
certificateSchema.index({ issueDate: -1 });

// Generate verification URL
certificateSchema.pre('save', function(next) {
  if (!this.verificationUrl) {
    this.verificationUrl = `${process.env.CERTIFICATE_VERIFY_URL}/${this.certificateId}`;
  }
  next();
});

// Calculate grade based on test score
certificateSchema.methods.calculateGrade = function() {
  if (!this.testScore || !this.testScore.percentage) {
    this.grade = 'Pass';
    return this.grade;
  }
  
  const percentage = this.testScore.percentage;
  
  if (percentage >= 90) this.grade = 'A+';
  else if (percentage >= 80) this.grade = 'A';
  else if (percentage >= 70) this.grade = 'B+';
  else if (percentage >= 60) this.grade = 'B';
  else if (percentage >= 50) this.grade = 'C+';
  else if (percentage >= 40) this.grade = 'C';
  else this.grade = 'Pass';
  
  return this.grade;
};

// Revoke certificate
certificateSchema.methods.revoke = async function(reason, adminId) {
  this.isValid = false;
  this.revokedAt = new Date();
  this.revokedReason = reason;
  this.revokedBy = adminId;
  await this.save();
  return this;
};

// Increment download count
certificateSchema.methods.incrementDownload = async function() {
  this.downloadCount += 1;
  this.lastDownloadedAt = new Date();
  await this.save();
  return this;
};

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;
