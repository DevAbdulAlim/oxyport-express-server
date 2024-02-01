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
              { order_status: { contains: options.search } },
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
    const { name, address, city, zip, email, phone, items } = req.body;

    // Extract the product IDs from the items array
    const productIds = items.map((item: any) => item.productId);

    // Fetch all products with the given IDs
    const products = await db.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    // Calculate the total amount based on the fetched products
    let total = 0;
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        total += product.price * item.quantity;
      }
    }

    // Create the order in the database without items
    const createdOrder = await db.order.create({
      data: {
        userId: 1, // Assuming userId is hardcoded for now
        name,
        address,
        city,
        zip,
        email,
        phone,
        order_status: "PENDING",
        total_amount: total,
        paid_amount: 0,
        due_amount: total,
        payment_status: "UNPAID",
      },
      include: { user: true },
    });

    // Now that the order is created, associate the items with the generated orderId
    const orderId = createdOrder.id;
    const orderItems = items.map((item: any) => ({
      orderId,
      productId: item.productId,
      quantity: item.quantity,
    }));

    // Create each order item individually
    for (const item of orderItems) {
      await db.orderItem.create({
        data: item,
      });
    }

    // Fetch the created order with associated items
    const finalOrder = await db.order.findUnique({
      where: { id: orderId },
      include: { user: true, items: true },
    });

    res.status(201).json({
      success: true,
      order: finalOrder,
    });
  }
);

export const updateOrder = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = parseInt(req.params.orderId, 10);
    const { order_status } = req.body;

    // Ensure that the order exists before attempting to update it
    const existingOrder = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update the order status in the database
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        order_status,
      },
    });

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
