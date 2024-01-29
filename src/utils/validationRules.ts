import { body } from "express-validator";

const userRules = [
  body("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
  body("email").trim().isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("role").isIn(["user", "admin"]).withMessage("Invalid user role"),
  body("avatar").optional().trim().isURL().withMessage("Invalid avatar URL"),
  body("bio").optional().trim(),
  body("phone").optional().trim(),
  body("birthDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Invalid date format"),
  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Invalid gender"),
  body("active").optional().isBoolean().withMessage("Active must be a boolean"),
  body("resetToken").optional().trim(),
  body("resetTokenExpires")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Invalid date format"),
  body("verifyToken").optional().trim(),
  body("verifyTokenExpires")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Invalid date format"),
];

const addressRules = [
  body("city").trim().isLength({ min: 1 }).withMessage("City is required"),
  body("state").trim().isLength({ min: 1 }).withMessage("State is required"),
  body("postalCode")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Postal code is required"),
  body("country")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Country is required"),
  body("userId").isInt().withMessage("Invalid user ID"),
];

const categoryRules = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Category name is required"),
  body("description").optional().trim(),
  body("image").optional().trim(),
];

const productRules = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Product name is required"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("discount").isNumeric().withMessage("Stock must be a number"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("categoryId")
    .isInt({ min: 1 })
    .withMessage("Category ID must be a positive integer"),
  body("userId")
    .isInt({ min: 1 })
    .withMessage("User ID must be a positive integer"),
];

const reviewRules = [
  body("text")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Review text is required"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("productId").isInt().withMessage("Invalid product ID"),
];

const cartRules = [body("userId").isInt().withMessage("Invalid user ID")];

const cartItemRules = [
  body("cartId").isInt().withMessage("Invalid cart ID"),
  body("productId").isInt().withMessage("Invalid product ID"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
];

const orderRules = [
  body("userId").isInt().withMessage("Invalid user ID"),
  body("total").isNumeric().withMessage("Total must be a number"),
  body("status")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Order status is required"),
  body("paymentMethod")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Payment method is required"),
  body("transactionId").optional().trim(),
  body("deliveryDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Invalid date format"),
];

const orderItemRules = [
  body("orderId").isInt().withMessage("Invalid order ID"),
  body("productId").isInt().withMessage("Invalid product ID"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
];

export {
  userRules,
  addressRules,
  categoryRules,
  productRules,
  reviewRules,
  cartRules,
  cartItemRules,
  orderRules,
  orderItemRules,
};
