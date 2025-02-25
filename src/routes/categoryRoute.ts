import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import isAdmin from "../middleware/adminMiddleware";
import isAuthenticated from "../middleware/authMiddleware";
import { categoryRules } from "../utils/validationRules";
import validationError from "../middleware/validationMiddleware";

const router = express.Router();

router
  .route("/categories")
  .get(getAllCategories)
  .post(
    isAuthenticated,
    isAdmin,
    categoryRules,
    validationError,
    createCategory
  );

router
  .route("/categories/:categoryId")
  .get(getCategoryById)
  .put(isAuthenticated, isAdmin, categoryRules, validationError, updateCategory)
  .delete(isAuthenticated, isAdmin, deleteCategory);

export default router;
