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
  body("name").notEmpty().withMessage("Name is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("zip").notEmpty().withMessage("Zip code is required"),
  body("zip")
    .isLength({ min: 5, max: 10 })
    .withMessage("Zip code must be between 5 and 10 characters"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
  body("phone").notEmpty().withMessage("Phone number is required"),
  body("phone")
    .matches(/^\d{10}$/)
    .withMessage(
      "Phone number must be exactly 11 digits and contain only numbers"
    ),
  body("items").isArray().withMessage("Items must be an array"),
  body("items.*.productId").isInt({ min: 1 }).withMessage("Invalid product ID"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
];

const orderItemRules = [
  body("orderId").isInt().withMessage("Invalid order ID"),
  body("productId").isInt().withMessage("Invalid product ID"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
];

const validStatusValues = ["PENDING", "PROCESSING", "DELIVERED", "CANCELED"];
const orderStatusRules = body("order_status")
  .isIn(validStatusValues)
  .withMessage(`order_status must be one of: ${validStatusValues.join(", ")}`);

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
  orderStatusRules,
};
