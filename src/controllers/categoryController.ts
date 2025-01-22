import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { db } from "../config/database";
import { Prisma } from "@prisma/client";
import { imageParser } from "../utils/imageParser";
import { deleteFile } from "../utils/file";

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

    // get uploaded image names from multer
    const uploadedImages = req.files as Express.Multer.File[];
    const newImages = uploadedImages.map((file) => file.filename);

    const createdCategory = await db.category.create({
      data: {
        name,
        description,
        image: newImages.join(","),
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
    const categoryId = Number.parseInt(req.params.categoryId, 10);
    const { name, description } = req.body;

    const existingCategory = await db.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const currentDatabaseImages = existingCategory?.image?.split(",") || [];

    // get all existing images that user didn't modify
    const existingImages = req.body.existingImages
      ? Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : req.body.existingImages.split(",")
      : [];

    // get uploaded image names from multer
    const uploadedImages = req.files as Express.Multer.File[];

    const newImages = uploadedImages.map((file) => file.filename);
    const updatedImages = [...existingImages, ...newImages];

    for (const image of currentDatabaseImages) {
      if (!updatedImages.includes(image)) {
        await deleteFile(`public/images/${image}`);
      }
    }

    // Update the category with the existing and new images
    const updatedCategory = await db.category.update({
      where: { id: categoryId },
      data: {
        name,
        description,
        image: updatedImages.join(","),
      },
    });

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

    const currentDatabaseImages = deletedCategory?.image?.split(",") || [];
    if (currentDatabaseImages) {
      for (const image of currentDatabaseImages) {
        await deleteFile(`public/images/${image}`);
      }
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  }
);
