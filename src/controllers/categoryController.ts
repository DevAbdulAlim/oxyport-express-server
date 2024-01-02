import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { db } from '../config/database';

export const getAllCategories = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const categories = await db.category.findMany();

  res.status(200).json({
    success: true,
    categories,
  });
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const categoryId = parseInt(req.params.categoryId, 10);

  const category = await db.category.findUnique({ where: { id: categoryId } });

  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found',
    });
  }

  res.status(200).json({
    success: true,
    category,
  });
});

export const createCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, description } = req.body;

  const createdCategory = await db.category.create({
    data: {
      name,
      description,
    },
  });

  res.status(201).json({
    success: true,
    category: createdCategory,
  });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const categoryId = parseInt(req.params.categoryId, 10);
  const { name, description } = req.body;

  const updatedCategory = await db.category.update({
    where: { id: categoryId },
    data: {
      name,
      description,
    },
  });

  if (!updatedCategory) {
    return res.status(404).json({
      success: false,
      message: 'Category not found',
    });
  }

  res.status(200).json({
    success: true,
    category: updatedCategory,
  });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const categoryId = parseInt(req.params.categoryId, 10);

  const deletedCategory = await db.category.delete({
    where: { id: categoryId },
  });

  if (!deletedCategory) {
    return res.status(404).json({
      success: false,
      message: 'Category not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
  });
});
