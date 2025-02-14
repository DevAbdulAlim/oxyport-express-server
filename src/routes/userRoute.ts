// Import Express and userController
import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController";
import isAuthenticated from "../middleware/authMiddleware";
import isAdmin from "../middleware/adminMiddleware";

// Create an Express router
const router = express.Router();

// Define user routes
router.route("/users").get(isAuthenticated, isAdmin, getAllUsers);

router
  .route("/users/:userId")
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

router
  .route("/user/profile")
  .get(isAuthenticated, getUserProfile)
  .put(isAuthenticated, updateUserProfile);

// Export the router
export default router;
