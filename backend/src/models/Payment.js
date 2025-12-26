const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    default: () => `ORD-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`
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
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    original: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    final: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  couponCode: {
    type: String
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet', 'emi', 'free'],
    required: true
  },
  paymentGateway: {
    type: String,
    enum: ['stripe', 'razorpay', 'paypal', 'manual', 'free'],
    default: 'stripe'
  },
  gatewayTransactionId: {
    type: String
  },
  gatewayOrderId: {
    type: String
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded', 'cancelled'],
    default: 'pending'
  },
  refund: {
    isRefunded: { type: Boolean, default: false },
    refundedAmount: { type: Number, default: 0 },
    refundReason: String,
    refundedAt: Date,
    refundTransactionId: String,
    refundedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  revenue: {
    platformCommission: {
      type: Number,
      default: 0
    },
    instructorEarnings: {
      type: Number,
      default: 0
    },
    commissionRate: {
      type: Number,
      default: 30 // 30% platform commission
    }
  },
  billing: {
    name: String,
    email: String,
    phone: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    }
  },
  invoice: {
    number: String,
    url: String,
    generatedAt: Date
  },
  paidAt: Date,
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ course: 1 });
paymentSchema.index({ instructor: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ gatewayTransactionId: 1 });

// Generate invoice number
paymentSchema.pre('save', async function(next) {
  if (this.status === 'completed' && !this.invoice.number) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const count = await mongoose.model('Payment').countDocuments({
      status: 'completed',
      createdAt: { $gte: new Date(`${year}-${month}-01`) }
    });
    this.invoice.number = `INV-${year}${month}-${String(count + 1).padStart(5, '0')}`;
    this.invoice.generatedAt = new Date();
  }
  next();
});

// Calculate revenue split
paymentSchema.methods.calculateRevenue = function(commissionRate = 30) {
  const platformCommission = (this.amount.final * commissionRate) / 100;
  const instructorEarnings = this.amount.final - platformCommission;
  
  this.revenue = {
    platformCommission: Math.round(platformCommission * 100) / 100,
    instructorEarnings: Math.round(instructorEarnings * 100) / 100,
    commissionRate
  };
  
  return this.revenue;
};

// Process refund
paymentSchema.methods.processRefund = async function(amount, reason, adminId) {
  if (amount > this.amount.final - this.refund.refundedAmount) {
    throw new Error('Refund amount exceeds remaining payment');
  }
  
  this.refund.refundedAmount += amount;
  this.refund.refundReason = reason;
  this.refund.refundedAt = new Date();
  this.refund.refundedBy = adminId;
  
  if (this.refund.refundedAmount >= this.amount.final) {
    this.refund.isRefunded = true;
    this.status = 'refunded';
  } else {
    this.status = 'partially_refunded';
  }
  
  await this.save();
  return this;
};

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
