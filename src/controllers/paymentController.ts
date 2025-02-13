import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { db } from "../config/database";
import type { Prisma } from "@prisma/client";

export const getAllPayments = asyncHandler(
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
        sortBy: sortBy || "email",
        sortOrder: sortOrder || "desc",
        search: search || "",
        page: Number.parseInt(page, 10) || 1,
        pageSize: Number.parseInt(pageSize, 10) || 10,
      };

      const queryConditions: Prisma.PaymentWhereInput = options.search
        ? {
            OR: [
              { name: { contains: options.search } },
              { email: { contains: options.search } },
              { method: { contains: options.search } },
            ],
          }
        : {};

      const [payments, totalItems] = await db.$transaction([
        db.payment.findMany({
          where: queryConditions,
          orderBy: {
            [options.sortBy]: options.sortOrder as "asc" | "desc",
          },
          skip: (options.page - 1) * options.pageSize,
          take: options.pageSize,
        }),
        db.payment.count({
          where: queryConditions,
        }),
      ]);

      res.status(200).json({
        success: true,
        payments,
        totalItems,
      });
    } catch (error) {
      console.error("Error in getAllPayments", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  }
);

export const getPaymentById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const paymentId = req.params.paymentId;

    const payment = await db.payment.findUnique({
      where: {
        id: paymentId,
      },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  }
);

export const createPayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, phone, method, amount, orderId, transactionId } =
      req.body;

    const createdPayment = await db.payment.create({
      data: {
        name,
        email,
        phone,
        method,
        amount,
        orderId,
        transactionId,
      },
    });

    res.status(201).json({
      success: true,
      payment: createdPayment,
    });
  }
);

export const updatePayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const paymentId = req.params.paymentId;
    const { name, email, phone, method, amount, orderId, transactionId } =
      req.body;

    const existingPayment = await db.payment.findUnique({
      where: { id: paymentId },
    });

    if (!existingPayment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    const updatedPayment = await db.payment.update({
      where: { id: paymentId },
      data: {
        name,
        email,
        phone,
        method,
        amount,
        orderId,
        transactionId,
      },
    });

    res.status(200).json({
      success: true,
      payment: updatedPayment,
    });
  }
);

export const deletePayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const paymentId = req.params.paymentId;

    const deletedPayment = await db.payment.delete({
      where: { id: paymentId },
    });

    if (!deletedPayment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    });
  }
);
