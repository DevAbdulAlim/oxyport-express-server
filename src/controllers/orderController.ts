import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { db } from "../config/database";
import { Prisma } from "@prisma/client";
import multer from "multer";
import { imageParser } from "../utils/imageParser";

export const getAllOrders = asyncHandler(
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

      const queryConditions: Prisma.OrderWhereInput = options.search
        ? {
            OR: [
              { id: { equals: parseInt(options.search) || undefined } },
              { status: { contains: options.search } },
            ],
          }
        : {};

      const [orders, totalItems] = await db.$transaction([
        db.order.findMany({
          where: queryConditions,
          orderBy: {
            [options.sortBy]: options.sortOrder as "asc" | "desc",
          },
          skip: (options.page - 1) * options.pageSize,
          take: options.pageSize,
          include: { user: true, items: true },
        }),
        db.order.count({
          where: queryConditions,
        }),
      ]);

      res.status(200).json({
        success: true,
        orders,
        totalItems,
      });
    } catch (error) {
      console.error("Error in getAllOrders", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  }
);

export const getOrderById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = parseInt(req.params.orderId, 10);

    const order = await db.order.findUnique({
      where: {
        id: orderId,
      },
      include: { user: true, items: true },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  }
);

export const createOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      userId,
      total,
      status,
      paymentMethod,
      transactionId,
      deliveryDate,
      items,
    } = req.body;

    const createdOrder = await db.order.create({
      data: {
        userId,
        total,
        status,
        paymentMethod,
        transactionId,
        deliveryDate,
        items: { create: items },
      },
      include: { user: true, items: true },
    });

    res.status(201).json({
      success: true,
      order: createdOrder,
    });
  }
);

export const updateOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = parseInt(req.params.orderId, 10);
    const { total, status, paymentMethod, transactionId, deliveryDate, items } =
      req.body;

    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        total,
        status,
        paymentMethod,
        transactionId,
        deliveryDate,
        items: { set: items },
      },
      include: { user: true, items: true },
    });

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order: updatedOrder,
    });
  }
);

export const deleteOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = parseInt(req.params.orderId, 10);

    const deletedOrder = await db.order.delete({
      where: { id: orderId },
      include: { user: true, items: true },
    });

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  }
);
