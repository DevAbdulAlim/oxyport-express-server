import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { db } from "../config/database";
import { generateVerifyToken } from "../utils/verifyToken";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { AuthRequest } from "../middleware/authMiddleware";

export const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sortBy, sortOrder, search, page, pageSize } = req.query as {
        sortBy: string;
        sortOrder: string;
        search: string;
        page: string;
        pageSize: string;
      };

      const defaultOptions = {
        sortBy: "createdAt",
        sortOrder: "desc",
        search: "",
        filters: {},
        page: 1,
        pageSize: 5,
      };

      const options = {
        sortBy: sortBy || defaultOptions.sortBy,
        sortOrder: sortOrder || defaultOptions.sortOrder,
        search: search || defaultOptions.search,
        page: parseInt(page, 10) || defaultOptions.page,
        pageSize: parseInt(pageSize, 10) || defaultOptions.pageSize,
      };

      const queryConditions: Prisma.UserWhereInput = options.search
        ? {
            OR: [
              { name: { contains: options.search } },
              { email: { contains: options.search } },
            ],
          }
        : {};

      const [users, totalItems] = await db.$transaction([
        db.user.findMany({
          where: queryConditions,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: {
            [options.sortBy]: options.sortOrder as "asc" | "desc",
          },
          skip: (options.page - 1) * options.pageSize,
          take: options.pageSize,
        }),
        db.user.count({
          where: queryConditions,
        }),
      ]);

      res.status(200).json({
        success: true,
        users,
        totalItems,
      });
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  }
);

export const getUserById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.userId, 10);

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  }
);

// This need to update
export const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.userId, 10);
    const { name, email, password } = req.body;

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        password,
      },
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  }
);

export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.userId, 10);

    const deletedUser = await db.user.delete({
      where: { id: userId },
    });

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  }
);

// Client
export const getUserProfile = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user.id;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        bio: true,
        address: true,
        phone: true,
        birthDate: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  }
);

export const updateUserProfile = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const { name, email, avatar, phone, birthDate, gender, bio } = req.body;

    // Build the update object dynamically, filtering out empty strings and undefined values
    const updateData: Record<string, any> = {};

    if (name && name.trim() !== "") updateData.name = name;
    if (email && email.trim() !== "") updateData.email = email;
    if (avatar && avatar.trim() !== "") updateData.avatar = avatar;
    if (phone && phone.trim() !== "") updateData.phone = phone;
    if (birthDate && birthDate.trim() !== "") updateData.birthDate = birthDate;
    if (gender && gender.trim() !== "") updateData.gender = gender;
    if (bio && bio.trim() !== "") updateData.bio = bio;

    // If no valid fields are provided, return an error
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }

    // Perform the update
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
    });
  }
);
