import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { db } from "../config/database";
import { Prisma } from "@prisma/client";

export const getAllProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.cookies.verifyToken;
    console.log(authToken);
    const { sortBy, sortOrder, search, filters, page, pageSize } =
      req.query as {
        sortBy: string;
        sortOrder: string;
        search: string;
        filters: Record<string, any>; // Adjust this based on your actual filter types
        page: string;
        pageSize: string;
      };

    const defaultOptions = {
      sortBy: "createdAt",
      sortOrder: "desc",
      search: "",
      filters: {},
      page: 1,
      pageSize: 1,
    };

    const options = {
      sortBy: sortBy || defaultOptions.sortBy,
      sortOrder: sortOrder || defaultOptions.sortOrder,
      search: search || defaultOptions.search,
      filters: filters || defaultOptions.filters,
      page: parseInt(page, 10) || defaultOptions.page,
      pageSize: parseInt(pageSize, 10) || defaultOptions.pageSize,
    };

    const queryConditions: Prisma.ProductWhereInput = options.search
      ? {
          OR: [
            {
              name: {
                contains: options.search,
                mode: "insensitive",
              } as Prisma.StringFilter,
            },
          ],
        }
      : {};

    const [products, totalItems] = await db.$transaction([
      db.product.findMany({
        where: queryConditions,
        orderBy: {
          [options.sortBy]: options.sortOrder as "asc" | "desc",
        },
        skip: (options.page - 1) * options.pageSize,
        take: options.pageSize,
      }),
      db.product.count({
        where: queryConditions,
      }),
    ]);

    res.status(200).json({
      success: true,
      products,
      totalItems,
    });
  }
);

export const getProductById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const productId = parseInt(req.params.productId, 10);

    const product = await db.product.findUnique({ where: { id: productId } });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  }
);

export const createProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, price, image, stock, categoryId, userId } =
      req.body;

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
  }
);

export const updateProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product: updatedProduct,
    });
  }
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const productId = parseInt(req.params.productId, 10);

    const deletedProduct = await db.product.delete({
      where: { id: productId },
    });

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  }
);
