// Import Express and userController
import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  registerUser
} from '../controllers/userController';
import { authenticateUser } from '../middleware/auth';
import { checkAdminRole } from '../middleware/admin';

// Create an Express router
const router = express.Router();

// Define user routes
router.route('/users')
  .get(authenticateUser, checkAdminRole , getAllUsers);

router.route('/users/:userId')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

router.route('/users/create')
  .post(createUser);

// Authentication routes
router.route('/users/login')
  .post(loginUser);

router.route('/users/register')
  .post(registerUser);

// Export the router
export default router;
