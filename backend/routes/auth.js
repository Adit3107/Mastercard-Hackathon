import express from 'express';
import {
  handleSignup,
  handleSignin,
  getProfile,
  updateProfile,
  updateEmailVerification,
  handleWebhook,
  deleteAccount
} from '../controllers/authController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', handleSignup);
router.post('/signin', handleSignin);
router.post('/webhook', handleWebhook);

// Protected routes
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.put('/verify-email', verifyToken, updateEmailVerification);
router.delete('/account', verifyToken, deleteAccount);

export default router;
