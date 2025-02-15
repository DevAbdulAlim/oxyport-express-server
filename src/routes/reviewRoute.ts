import express from "express";
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController";
import isAuthenticated from "../middleware/authMiddleware";
import { reviewRules } from "../utils/validationRules";
import validationError from "../middleware/validationMiddleware";

const router = express.Router();

router
  .route("/reviews")
  .get(getAllReviews)
  .post(isAuthenticated, reviewRules, validationError, createReview);

router
  .route("/reviews/:reviewId")
  .get(getReviewById)
  .put(isAuthenticated, reviewRules, validationError, updateReview)
  .delete(isAuthenticated, deleteReview);

export default router;
