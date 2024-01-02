import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { validateVerifyToken } from "../utils/verifyToken";
import { db } from "../config/database";

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.cookies.verifyToken;

  if (!authToken) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: You must authenticate to access this resource.",
    });
  }

  try {
    const verifiedToken = await validateVerifyToken(authToken);

    if (!verifiedToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid authentication token.",
      });
    }

    const { id } = verifiedToken;
    const user = await db.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error while authenticating user:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid authentication token.",
    });
  }
};
