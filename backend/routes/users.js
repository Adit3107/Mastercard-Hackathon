import express from 'express';
import {
  getAllUsers,
  getAllNGOs,
  getVerifiedNGOs,
  getNGOById,
  getUserById,
  verifyNGO,
  updateUserStatus,
  searchUsers,
  getUserStats
} from '../controllers/userController.js';
import { verifyToken, requireRole, requireVerifiedNGO } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/ngos', getAllNGOs);
router.get('/ngos/verified', getVerifiedNGOs);
router.get('/ngos/:id', getNGOById);
router.get('/search', searchUsers);

// Protected routes
router.get('/:id', verifyToken, getUserById);

// Admin routes
router.get('/', verifyToken, requireRole(['admin']), getAllUsers);
router.get('/stats', verifyToken, requireRole(['admin']), getUserStats);
router.put('/ngos/:id/verify', verifyToken, requireRole(['admin']), verifyNGO);
router.put('/:id/status', verifyToken, requireRole(['admin']), updateUserStatus);

export default router;
