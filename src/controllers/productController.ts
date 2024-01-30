import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { db } from "../config/database";
import { Prisma } from "@prisma/client";

export const getAllProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sortBy, sortOrder, search, filters, page, pageSize } =
        req.query as {
          sortBy: string;
          sortOrder: string;
          search: string;
          filters: Record<string, any>; // filter options for products filter page
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
        filters: filters || defaultOptions.filters,
        page: parseInt(page, 10) || defaultOptions.page,
        pageSize: parseInt(pageSize, 10) || defaultOptions.pageSize,
      };

      const queryConditions: Prisma.ProductWhereInput = options.search
        ? {
            name: {
              contains: options.search,
            },
          }
        : {};

      const [products, totalItems] = await db.$transaction([
        db.product.findMany({
          where: queryConditions,
          include: {
            category: {
              select: {
                name: true,
              },
            },
            user: {
              select: {
                name: true,
              },
            },
          },
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
    } catch (error) {
      console.error("Error in getAllProducts:", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  }
);

export const getProductById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const productId = parseInt(req.params.productId, 10);

    const product = await db.product.findUnique({
      where: { id: productId },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });

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
    const { name, description, price, discount, stock, categoryId, userId } =
      req.body;

    const MAX_FILE_SIZE_MB = 20; // Maximum file size limit in megabytes

    // parse images
    const images: string = Array.isArray(req.files)
      ? req.files
          .filter((file: Express.Multer.File) => file.fieldname === "images[]")
          .map((file: Express.Multer.File) => {
            // Check image mimetype
            if (!file.mimetype.startsWith("image/")) {
              throw new Error("Only image files are allowed");
            }
            // Check image size
            const fileSizeInMb = file.size / (1024 * 1024); // Convert file size to MB
            if (fileSizeInMb > MAX_FILE_SIZE_MB) {
              throw new Error(
                `File size exceeds the maximum limit of ${MAX_FILE_SIZE_MB} MB`
              );
            }
            return file.filename;
          })
          .join(",")
      : "";

    const parsedPrice: number = parseFloat(price);
    const parsedDiscount: number = parseFloat(discount);
    const parsedStock: number = parseInt(stock, 10);
    const parsedCategoryId: number = parseInt(categoryId, 10);
    const parsedUserId: number = parseInt(userId, 10);

    const createdProduct = await db.product.create({
      data: {
        name,
        description,
        price: parsedPrice,
        discount: parsedDiscount,
        images,
        stock: parsedStock,
        categoryId: parsedCategoryId,
        userId: parsedUserId,
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
    const { name, description, price, discount, images, stock, categoryId } =
      req.body;

    const updatedProduct = await db.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price,
        discount,
        images,
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
