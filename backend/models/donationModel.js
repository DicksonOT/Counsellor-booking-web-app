import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  // Basic donation info
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  donationType: {
    type: String,
    enum: ['one-time', 'monthly'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },

  // Donor information
  donorName: {
    type: String,
    required: true
  },
  donorEmail: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Null for anonymous donations
  },

  // Stripe information
  stripeSessionId: {
    type: String,
    default: null
  },
  paymentIntentId: {
    type: String,
    default: null
  },
  stripeSubscriptionId: {
    type: String,
    default: null // Only for monthly donations
  },

  // Recurring donation info
  isRecurring: {
    type: Boolean,
    default: false
  },
  parentDonationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
    default: null // Links recurring payments to original donation
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },

  // Additional metadata
  currency: {
    type: String,
    default: 'USD'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for better query performance
donationSchema.index({ donorEmail: 1 });
donationSchema.index({ userId: 1 });
donationSchema.index({ status: 1 });
donationSchema.index({ donationType: 1 });
donationSchema.index({ stripeSubscriptionId: 1 });
donationSchema.index({ createdAt: -1 });

// Virtual for total monthly revenue
donationSchema.virtual('monthlyRevenue').get(function() {
  if (this.donationType === 'monthly' && this.status === 'completed') {
    return this.amount;
  }
  return 0;
});

// Static method to get donation statistics
donationSchema.statics.getDonationStats = async function() {
  const stats = await this.aggregate([
    {
      $match: { status: 'completed' }
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        totalDonations: { $sum: 1 },
        oneTimeDonations: {
          $sum: { $cond: [{ $eq: ['$donationType', 'one-time'] }, 1, 0] }
        },
        monthlyDonations: {
          $sum: { $cond: [{ $eq: ['$donationType', 'monthly'] }, 1, 0] }
        },
        monthlyRevenue: {
          $sum: { 
            $cond: [
              { $eq: ['$donationType', 'monthly'] }, 
              '$amount', 
              0
            ] 
          }
        }
      }
    }
  ]);

  return stats[0] || {
    totalAmount: 0,
    totalDonations: 0,
    oneTimeDonations: 0,
    monthlyDonations: 0,
    monthlyRevenue: 0
  };
};

// Static method to get top donors
donationSchema.statics.getTopDonors = async function(limit = 10) {
  return await this.aggregate([
    {
      $match: { status: 'completed' }
    },
    {
      $group: {
        _id: '$donorEmail',
        donorName: { $first: '$donorName' },
        totalAmount: { $sum: '$amount' },
        donationCount: { $sum: 1 },
        lastDonation: { $max: '$completedAt' }
      }
    },
    {
      $sort: { totalAmount: -1 }
    },
    {
      $limit: limit
    }
  ]);
};

const donationModel = mongoose.model('Donation', donationSchema);

export default donationModel;