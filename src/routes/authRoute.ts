import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  verifyToken,
} from "../controllers/authController";

const router = express.Router();

router.route("/users/login").post(loginUser);

router.route("/users/register").post(registerUser);

router.route("/users/logout").post(logoutUser);

router.route("/users/verify-token").post(verifyToken);

export default router;
