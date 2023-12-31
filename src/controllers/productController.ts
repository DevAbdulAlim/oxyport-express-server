import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { db } from '../config/database';

export const getAllProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const products = await db.product.findMany();

  res.status(200).json({
    success: true,
    products,
  });
});

export const getProductById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const productId = parseInt(req.params.productId, 10);

  const product = await db.product.findUnique({ where: { id: productId } });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  res.status(200).json({
    success: true,
    product,
  });
});

export const createProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, price, image, stock, categoryId, userId } = req.body;

  const createdProduct = await db.product.create({
    data: {
      name,
      description,
      price,
      image,
      stock,
      categoryId,
      userId,
    },
  });

  res.status(201).json({
    success: true,
    product: createdProduct,
  });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const productId = parseInt(req.params.productId, 10);
  const { name, description, price, image, stock, categoryId } = req.body;

  const updatedProduct = await db.product.update({
    where: { id: productId },
    data: {
      name,
      description,
      price,
      image,
      stock,
      categoryId,
    },
  });

  if (!updatedProduct) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  res.status(200).json({
    success: true,
    product: updatedProduct,
  });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const productId = parseInt(req.params.productId, 10);

  const deletedProduct = await db.product.delete({
    where: { id: productId },
  });

  if (!deletedProduct) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
  });
});
