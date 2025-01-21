import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { db } from "../config/database";
import { Prisma } from "@prisma/client";
import multer from "multer";
import { imageParser } from "../utils/imageParser";

export const getAllCategories = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sortBy, sortOrder, search, page, pageSize } = req.query as {
        sortBy: string;
        sortOrder: string;
        search: string;
        page: string;
        pageSize: string;
      };

      const options = {
        sortBy: sortBy || "createdAt",
        sortOrder: sortOrder || "desc",
        search: search || "",
        page: parseInt(page, 10) || 1,
        pageSize: parseInt(pageSize, 10) || 5,
      };

      const queryConditions: Prisma.CategoryWhereInput = options.search
        ? {
            name: {
              contains: options.search,
            },
          }
        : {};

      const [categories, totalItems] = await db.$transaction([
        db.category.findMany({
          where: queryConditions,
          orderBy: {
            [options.sortBy]: options.sortOrder as "asc" | "desc",
          },
          skip: (options.page - 1) * options.pageSize,
          take: options.pageSize,
        }),
        db.category.count({
          where: queryConditions,
        }),
      ]);

      res.status(200).json({
        success: true,
        categories,
        totalItems,
      });
    } catch (error) {
      console.error("Error in getAllCategories", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  }
);

export const getCategoryById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = parseInt(req.params.categoryId, 10);

    const category = await db.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      category,
    });
  }
);

export const createCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;

    const image: string = imageParser(req);

    const createdCategory = await db.category.create({
      data: {
        name,
        description,
        image,
      },
    });

    res.status(201).json({
      success: true,
      category: createdCategory,
    });
  }
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = parseInt(req.params.categoryId, 10);
    const { name, description, image } = req.body;

    const updatedCategory = await db.category.update({
      where: { id: categoryId },
      data: {
        name,
        description,
        image,
      },
    });

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      category: updatedCategory,
    });
  }
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = parseInt(req.params.categoryId, 10);

    const deletedCategory = await db.category.delete({
      where: { id: categoryId },
    });

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  }
);
