// Import Express and userController
import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
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

router.route("/users/create").post(createUser);

// Export the router
export default router;
