import express from "express";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController";
import isAuthenticated from "../middleware/authMiddleware";
import isAdmin from "../middleware/adminMiddleware";
import { orderRules } from "../utils/validationRules";
import validationError from "../middleware/validationMiddleware";

const router = express.Router();

router
  .route("/orders")
  .get(getAllOrders)
  .post(isAuthenticated, orderRules, validationError, createOrder)
  .put(isAuthenticated, isAdmin, orderRules, validationError, updateOrder)
  .delete(isAuthenticated, isAdmin, deleteOrder);

router.route("/orders/:orderId").get(getOrderById);

export default router;
