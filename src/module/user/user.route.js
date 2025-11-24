import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from './user.controller.js';
import { authMiddleware, adminMiddleware } from '../../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private - Admin only
 */
router.get('/', authMiddleware, adminMiddleware, getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private - Authenticated users
 */
router.get('/:id', authMiddleware, getUserById);

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Private - Admin only
 */
router.post('/', authMiddleware, adminMiddleware, createUser);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private - Authenticated users (own profile or admin)
 */
router.put('/:id', authMiddleware, updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private - Admin only
 */
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);

export default router;
