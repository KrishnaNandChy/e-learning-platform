const mongoose = require('mongoose');

const instructorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  headline: {
    type: String,
    maxlength: [200, 'Headline cannot exceed 200 characters']
  },
  biography: {
    type: String,
    maxlength: [2000, 'Biography cannot exceed 2000 characters']
  },
  expertise: [{
    type: String,
    trim: true
  }],
  qualifications: [{
    degree: String,
    institution: String,
    year: Number
  }],
  experience: [{
    title: String,
    company: String,
    duration: String,
    description: String
  }],
  totalStudents: {
    type: Number,
    default: 0
  },
  totalCourses: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  pendingPayout: {
    type: Number,
    default: 0
  },
  payoutHistory: [{
    amount: Number,
    date: Date,
    method: String,
    transactionId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    }
  }],
  bankDetails: {
    accountHolder: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    upiId: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [{
    type: {
      type: String,
      enum: ['id_proof', 'address_proof', 'qualification']
    },
    url: String,
    public_id: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    uploadedAt: { type: Date, default: Date.now }
  }],
  commissionRate: {
    type: Number,
    default: 30, // 30% platform commission
    min: 0,
    max: 100
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
instructorProfileSchema.index({ user: 1 });
instructorProfileSchema.index({ averageRating: -1 });
instructorProfileSchema.index({ totalStudents: -1 });

// Virtual to populate user details
instructorProfileSchema.virtual('userDetails', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true
});

// Calculate instructor revenue
instructorProfileSchema.methods.calculateRevenue = function(amount) {
  const platformCommission = (amount * this.commissionRate) / 100;
  const instructorEarnings = amount - platformCommission;
  return {
    total: amount,
    platformCommission,
    instructorEarnings
  };
};

const InstructorProfile = mongoose.model('InstructorProfile', instructorProfileSchema);

module.exports = InstructorProfile;
