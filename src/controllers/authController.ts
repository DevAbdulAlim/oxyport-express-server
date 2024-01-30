import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { db } from "../config/database";
import { generateVerifyToken, validateVerifyToken } from "../utils/verifyToken";
import bcrypt from "bcrypt";

export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const idPasswordValid = await bcrypt.compare(password, user.password);

    if (!idPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const authToken = await generateVerifyToken(user.id, user.role, res);

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      authToken,
    });
  }
);

export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and password are required fields.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      success: true,
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt,
      },
    });
  }
);

export const logoutUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("verifyToken");
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      next(error);
    }
  }
);

export const verifyToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.cookies.verifyToken;
    console.log(authToken);

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
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: User not found.",
        });
      }

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.error("Error while authenticating user:", error);
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid authentication token.",
      });
    }
  }
);
