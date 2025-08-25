import User from '../models/User.js';
import { extractUserData } from '../config/clerk.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Handle user signup from Clerk webhook
// @route   POST /api/auth/signup
// @access  Public
export const handleSignup = asyncHandler(async (req, res) => {
  const { clerkId, firstName, lastName, email, userType } = req.body;

  // Check if user already exists
  const existingUser = await User.findByClerkId(clerkId);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists'
    });
  }

  // Check if email already exists
  const existingEmail = await User.findByEmail(email);
  if (existingEmail) {
    return res.status(400).json({
      success: false,
      message: 'Email already registered'
    });
  }

  // Create new user
  const user = await User.create({
    clerkId,
    firstName,
    lastName,
    email,
    userType,
    emailVerified: false
  });

  // Update last activity
  await user.updateLastActivity();

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: {
      id: user._id,
      clerkId: user.clerkId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      emailVerified: user.emailVerified
    }
  });
});

// @desc    Handle user signin
// @route   POST /api/auth/signin
// @access  Public
export const handleSignin = asyncHandler(async (req, res) => {
  const { clerkId } = req.body;

  // Find user by Clerk ID
  const user = await User.findByClerkId(clerkId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Account is deactivated'
    });
  }

  // Update last login and activity
  user.lastLogin = new Date();
  await user.updateLastActivity();

  res.status(200).json({
    success: true,
    message: 'Sign in successful',
    data: {
      id: user._id,
      clerkId: user.clerkId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      emailVerified: user.emailVerified,
      profile: user.profile,
      ngoDetails: user.userType === 'ngo' ? user.ngoDetails : undefined,
      donorDetails: user.userType === 'donor' ? user.donorDetails : undefined
    }
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      clerkId: user.clerkId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      emailVerified: user.emailVerified,
      profile: user.profile,
      ngoDetails: user.userType === 'ngo' ? user.ngoDetails : undefined,
      donorDetails: user.userType === 'donor' ? user.donorDetails : undefined,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    }
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, profile, ngoDetails, donorDetails } = req.body;
  const user = req.user;

  // Update basic information
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (profile) user.profile = { ...user.profile, ...profile };

  // Update role-specific details
  if (user.userType === 'ngo' && ngoDetails) {
    user.ngoDetails = { ...user.ngoDetails, ...ngoDetails };
  }

  if (user.userType === 'donor' && donorDetails) {
    user.donorDetails = { ...user.donorDetails, ...donorDetails };
  }

  await user.save();
  await user.updateLastActivity();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      profile: user.profile,
      ngoDetails: user.userType === 'ngo' ? user.ngoDetails : undefined,
      donorDetails: user.userType === 'donor' ? user.donorDetails : undefined
    }
  });
});

// @desc    Handle email verification update
// @route   PUT /api/auth/verify-email
// @access  Private
export const updateEmailVerification = asyncHandler(async (req, res) => {
  const { emailVerified } = req.body;
  const user = req.user;

  user.emailVerified = emailVerified;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Email verification status updated',
    data: {
      emailVerified: user.emailVerified
    }
  });
});

// @desc    Handle Clerk webhook
// @route   POST /api/auth/webhook
// @access  Public
export const handleWebhook = asyncHandler(async (req, res) => {
  const { type, data } = req.body;

  switch (type) {
    case 'user.created':
      // Handle user creation
      const userData = extractUserData(req.body);
      if (userData) {
        // Check if user already exists
        const existingUser = await User.findByClerkId(userData.clerkId);
        if (!existingUser) {
          await User.create({
            ...userData,
            userType: 'donor' // Default user type
          });
        }
      }
      break;

    case 'user.updated':
      // Handle user updates
      const updatedUserData = extractUserData(req.body);
      if (updatedUserData) {
        const user = await User.findByClerkId(updatedUserData.clerkId);
        if (user) {
          user.email = updatedUserData.email;
          user.firstName = updatedUserData.firstName;
          user.lastName = updatedUserData.lastName;
          user.emailVerified = updatedUserData.emailVerified;
          await user.save();
        }
      }
      break;

    case 'user.deleted':
      // Handle user deletion
      const deletedUserData = extractUserData(req.body);
      if (deletedUserData) {
        const user = await User.findByClerkId(deletedUserData.clerkId);
        if (user) {
          user.isActive = false;
          await user.save();
        }
      }
      break;

    default:
      console.log('Unhandled webhook type:', type);
  }

  res.status(200).json({ success: true });
});

// @desc    Delete user account
// @route   DELETE /api/auth/account
// @access  Private
export const deleteAccount = asyncHandler(async (req, res) => {
  const user = req.user;

  // Soft delete - mark as inactive
  user.isActive = false;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully'
  });
});

export default {
  handleSignup,
  handleSignin,
  getProfile,
  updateProfile,
  updateEmailVerification,
  handleWebhook,
  deleteAccount
};
