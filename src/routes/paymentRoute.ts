import express from "express";
import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
} from "../controllers/paymentController";
import isAdmin from "../middleware/adminMiddleware";
import isAuthenticated from "../middleware/authMiddleware";
import { paymentRules } from "../utils/validationRules";
import validationError from "../middleware/validationMiddleware";

const router = express.Router();

router
  .route("/payments")
  .get(isAuthenticated, isAdmin, getAllPayments)
  .post(isAuthenticated, isAdmin, paymentRules, validationError, createPayment);

router
  .route("/payments/:paymentId")
  .get(isAuthenticated, isAdmin, getPaymentById)
  .put(isAuthenticated, isAdmin, paymentRules, validationError, updatePayment)
  .delete(isAuthenticated, isAdmin, deletePayment);

export default router;
