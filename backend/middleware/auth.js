import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verify Clerk JWT token
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!process.env.CLERK_SECRET_KEY) {
      return res.status(500).json({ 
        success: false, 
        message: 'Server configuration error' 
      });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.CLERK_SECRET_KEY, {
      algorithms: ['HS256']
    });

    // Extract user ID from the token
    const clerkId = decoded.sub || decoded.user_id;
    
    if (!clerkId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token format' 
      });
    }

    // Find user in database
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
        message: 'User account is deactivated' 
      });
    }

    // Attach user to request object
    req.user = user;
    req.clerkId = clerkId;
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication error' 
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without authentication
    }

    const token = authHeader.substring(7);
    
    if (!process.env.CLERK_SECRET_KEY) {
      return next(); // Continue without authentication
    }

    const decoded = jwt.verify(token, process.env.CLERK_SECRET_KEY, {
      algorithms: ['HS256']
    });

    const clerkId = decoded.sub || decoded.user_id;
    
    if (clerkId) {
      const user = await User.findByClerkId(clerkId);
      if (user && user.isActive) {
        req.user = user;
        req.clerkId = clerkId;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication on error
    next();
  }
};

// Role-based authorization middleware
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.userType)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};

// Require NGO role
export const requireNGO = requireRole(['ngo']);

// Require Donor role
export const requireDonor = requireRole(['donor']);

// Require verified NGO
export const requireVerifiedNGO = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }

  if (req.user.userType !== 'ngo') {
    return res.status(403).json({ 
      success: false, 
      message: 'NGO access required' 
    });
  }

  if (!req.user.ngoDetails?.verified) {
    return res.status(403).json({ 
      success: false, 
      message: 'NGO verification required' 
    });
  }

  next();
};

export default {
  verifyToken,
  optionalAuth,
  requireRole,
  requireNGO,
  requireDonor,
  requireVerifiedNGO
};
