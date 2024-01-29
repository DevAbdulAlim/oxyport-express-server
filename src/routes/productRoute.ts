import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import isAuthenticated from "../middleware/authMiddleware";
import isAdmin from "../middleware/adminMiddleware";
import validationError from "../middleware/validationMiddleware";
import { productRules } from "../utils/validationRules";

const router = express.Router();

router
  .route("/products")
  .get(getAllProducts)
  .post(isAuthenticated, isAdmin, productRules, validationError, createProduct);
// .post(isAuthenticated, isAdmin, createProduct);

router
  .route("/products/:productId")
  .get(getProductById)
  .put(isAuthenticated, isAdmin, productRules, validationError, updateProduct)
  .delete(isAuthenticated, isAdmin, deleteProduct);

export default router;
