import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Clerk authentication details
  clerkId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Basic user information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  // User type (donor or ngo)
  userType: {
    type: String,
    enum: ['donor', 'ngo'],
    required: true
  },
  
  // Email verification status
  emailVerified: {
    type: Boolean,
    default: false
  },
  
  // Profile information
  profile: {
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    avatar: String,
    bio: String
  },
  
  // NGO specific fields (only for NGO users)
  ngoDetails: {
    organizationName: String,
    registrationNumber: String,
    website: String,
    mission: String,
    foundedYear: Number,
    category: {
      type: String,
      enum: ['education', 'healthcare', 'environment', 'poverty', 'human-rights', 'animals', 'other']
    },
    verified: {
      type: Boolean,
      default: false
    },
    documents: [{
      name: String,
      url: String,
      uploadedAt: Date
    }]
  },
  
  // Donor specific fields (only for donor users)
  donorDetails: {
    preferredCategories: [{
      type: String,
      enum: ['education', 'healthcare', 'environment', 'poverty', 'human-rights', 'animals', 'other']
    }],
    totalDonations: {
      type: Number,
      default: 0
    },
    anonymousDonations: {
      type: Boolean,
      default: false
    }
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Timestamps
  lastLogin: Date,
  lastActivity: Date
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1, userType: 1 });
userSchema.index({ 'ngoDetails.verified': 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

// Virtual for display name
userSchema.virtual('displayName').get(function() {
  if (this.userType === 'ngo' && this.ngoDetails?.organizationName) {
    return this.ngoDetails.organizationName;
  }
  return this.fullName;
});

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  
  // Remove sensitive fields
  delete userObject.clerkId;
  delete userObject.email;
  delete userObject.lastLogin;
  delete userObject.lastActivity;
  
  return userObject;
};

// Method to update last activity
userSchema.methods.updateLastActivity = function() {
  this.lastActivity = new Date();
  return this.save();
};

// Static method to find by clerk ID
userSchema.statics.findByClerkId = function(clerkId) {
  return this.findOne({ clerkId });
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find verified NGOs
userSchema.statics.findVerifiedNGOs = function() {
  return this.find({
    userType: 'ngo',
    'ngoDetails.verified': true,
    isActive: true
  });
};

// Static method to find donors
userSchema.statics.findDonors = function() {
  return this.find({
    userType: 'donor',
    isActive: true
  });
};

const User = mongoose.model('User', userSchema);

export default User;
