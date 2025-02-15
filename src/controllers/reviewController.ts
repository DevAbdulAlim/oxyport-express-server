import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { db } from "../config/database";
import type { Prisma } from "@prisma/client";

export const getAllReviews = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sortBy, sortOrder, search, page, pageSize, productId } =
        req.query as {
          sortBy: string;
          sortOrder: string;
          search: string;
          page: string;
          pageSize: string;
          productId: string;
        };

      const options = {
        sortBy: sortBy || "createdAt",
        sortOrder: sortOrder || "desc",
        search: search || "",
        page: Number.parseInt(page, 10) || 1,
        pageSize: Number.parseInt(pageSize, 10) || 10,
        productId: productId ? Number.parseInt(productId, 10) : undefined,
      };

      const queryConditions: Prisma.ReviewWhereInput = {
        ...(options.search && {
          text: {
            contains: options.search,
          },
        }),
        ...(options.productId && {
          productId: options.productId,
        }),
      };

      const [reviews, totalItems] = await db.$transaction([
        db.review.findMany({
          where: queryConditions,
          orderBy: {
            [options.sortBy]: options.sortOrder as "asc" | "desc",
          },
          skip: (options.page - 1) * options.pageSize,
          take: options.pageSize,
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        }),
        db.review.count({
          where: queryConditions,
        }),
      ]);

      res.status(200).json({
        success: true,
        reviews,
        totalItems,
        currentPage: options.page,
        totalPages: Math.ceil(totalItems / options.pageSize),
      });
    } catch (error) {
      console.error("Error in getAllReviews", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  }
);

export const getReviewById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const reviewId = Number.parseInt(req.params.reviewId, 10);

    const review = await db.review.findUnique({
      where: {
        id: reviewId,
      },
      include: {
        product: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      review,
    });
  }
);

export const createReview = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { text, rating, productId } = req.body;

    const createdReview = await db.review.create({
      data: {
        text,
        rating: Number.parseInt(rating, 10),
        productId: Number.parseInt(productId, 10),
      },
    });

    res.status(201).json({
      success: true,
      review: createdReview,
    });
  }
);

export const updateReview = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const reviewId = Number.parseInt(req.params.reviewId, 10);
    const { text, rating } = req.body;

    const existingReview = await db.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const updatedReview = await db.review.update({
      where: { id: reviewId },
      data: {
        text,
        rating: Number.parseInt(rating, 10),
      },
    });

    res.status(200).json({
      success: true,
      review: updatedReview,
    });
  }
);

export const deleteReview = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const reviewId = Number.parseInt(req.params.reviewId, 10);

    const deletedReview = await db.review.delete({
      where: { id: reviewId },
    });

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  }
);
