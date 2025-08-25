import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, userType, verified } = req.query;

  const query = { isActive: true };
  
  if (userType) {
    query.userType = userType;
  }
  
  if (verified !== undefined && userType === 'ngo') {
    query['ngoDetails.verified'] = verified === 'true';
  }

  const users = await User.find(query)
    .select('-clerkId')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1
    }
  });
});

// @desc    Get all NGOs
// @route   GET /api/users/ngos
// @access  Public
export const getAllNGOs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, verified } = req.query;

  const query = { 
    userType: 'ngo', 
    isActive: true 
  };

  if (category) {
    query['ngoDetails.category'] = category;
  }

  if (verified !== undefined) {
    query['ngoDetails.verified'] = verified === 'true';
  }

  const ngos = await User.find(query)
    .select('-clerkId -email -lastLogin -lastActivity')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    data: ngos,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalNGOs: total,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1
    }
  });
});

// @desc    Get verified NGOs only
// @route   GET /api/users/ngos/verified
// @access  Public
export const getVerifiedNGOs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category } = req.query;

  const query = { 
    userType: 'ngo', 
    'ngoDetails.verified': true,
    isActive: true 
  };

  if (category) {
    query['ngoDetails.category'] = category;
  }

  const ngos = await User.find(query)
    .select('-clerkId -email -lastLogin -lastActivity')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    data: ngos,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalNGOs: total,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1
    }
  });
});

// @desc    Get single NGO by ID
// @route   GET /api/users/ngos/:id
// @access  Public
export const getNGOById = asyncHandler(async (req, res) => {
  const ngo = await User.findOne({
    _id: req.params.id,
    userType: 'ngo',
    isActive: true
  }).select('-clerkId -email -lastLogin -lastActivity');

  if (!ngo) {
    return res.status(404).json({
      success: false,
      message: 'NGO not found'
    });
  }

  res.status(200).json({
    success: true,
    data: ngo
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-clerkId -email -lastLogin -lastActivity');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  if (!user.isActive) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update NGO verification status (admin only)
// @route   PUT /api/users/ngos/:id/verify
// @access  Private/Admin
export const verifyNGO = asyncHandler(async (req, res) => {
  const { verified } = req.body;

  const ngo = await User.findOne({
    _id: req.params.id,
    userType: 'ngo'
  });

  if (!ngo) {
    return res.status(404).json({
      success: false,
      message: 'NGO not found'
    });
  }

  ngo.ngoDetails.verified = verified;
  await ngo.save();

  res.status(200).json({
    success: true,
    message: `NGO ${verified ? 'verified' : 'unverified'} successfully`,
    data: {
      id: ngo._id,
      organizationName: ngo.ngoDetails.organizationName,
      verified: ngo.ngoDetails.verified
    }
  });
});

// @desc    Update user status (admin only)
// @route   PUT /api/users/:id/status
// @access  Private/Admin
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  user.isActive = isActive;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
    data: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive
    }
  });
});

// @desc    Search users
// @route   GET /api/users/search
// @access  Public
export const searchUsers = asyncHandler(async (req, res) => {
  const { q, userType, page = 1, limit = 10 } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const query = {
    isActive: true,
    $or: [
      { firstName: { $regex: q, $options: 'i' } },
      { lastName: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } }
    ]
  };

  if (userType === 'ngo') {
    query.userType = 'ngo';
    query.$or.push({
      'ngoDetails.organizationName': { $regex: q, $options: 'i' }
    });
    query.$or.push({
      'ngoDetails.mission': { $regex: q, $options: 'i' }
    });
  }

  const users = await User.find(query)
    .select('-clerkId -email -lastLogin -lastActivity')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1
    }
  });
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private/Admin
export const getUserStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ isActive: true });
  const totalDonors = await User.countDocuments({ userType: 'donor', isActive: true });
  const totalNGOs = await User.countDocuments({ userType: 'ngo', isActive: true });
  const verifiedNGOs = await User.countDocuments({ 
    userType: 'ngo', 
    'ngoDetails.verified': true, 
    isActive: true 
  });
  const unverifiedNGOs = totalNGOs - verifiedNGOs;

  // Get recent signups (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentSignups = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
    isActive: true
  });

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalDonors,
      totalNGOs,
      verifiedNGOs,
      unverifiedNGOs,
      recentSignups,
      verificationRate: totalNGOs > 0 ? (verifiedNGOs / totalNGOs * 100).toFixed(1) : 0
    }
  });
});

export default {
  getAllUsers,
  getAllNGOs,
  getVerifiedNGOs,
  getNGOById,
  getUserById,
  verifyNGO,
  updateUserStatus,
  searchUsers,
  getUserStats
};
