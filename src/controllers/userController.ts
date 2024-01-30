import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { db } from "../config/database";
import { generateVerifyToken } from "../utils/verifyToken";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

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
