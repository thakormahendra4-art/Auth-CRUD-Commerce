import { body, param, query, validationResult } from "express-validator";

export const ALLOWED_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Kitchen",
  "Beauty",
  "Other",
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// Route parameter ID validator (Task 3: route parameter IDs)
export const productIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid product ID format. Must be a valid 24-character hexadecimal ObjectId"),
  handleValidationErrors,
];

// Query parameter validator (Task 3: query parameters)
export const getProductsQueryValidator = [
  query("category")
    .optional()
    .isIn([...ALLOWED_CATEGORIES, "All"])
    .withMessage(`Category must be one of: ${ALLOWED_CATEGORIES.join(", ")}`),
  query("search")
    .optional()
    .isString()
    .trim(),
  handleValidationErrors,
];

// Create Product validator
export const createProductValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 2, max: 200 })
    .withMessage("Title must be between 2 and 200 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 5 })
    .withMessage("Description must be at least 5 characters long"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(ALLOWED_CATEGORIES)
    .withMessage(`Category must be one of: ${ALLOWED_CATEGORIES.join(", ")}`),

  handleValidationErrors,
];

// Update Product validator
export const updateProductValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid product ID format. Must be a valid 24-character hexadecimal ObjectId"),

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ min: 2, max: 200 })
    .withMessage("Title must be between 2 and 200 characters"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty")
    .isLength({ min: 5 })
    .withMessage("Description must be at least 5 characters long"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),

  body("category")
    .optional()
    .isIn(ALLOWED_CATEGORIES)
    .withMessage(`Category must be one of: ${ALLOWED_CATEGORIES.join(", ")}`),

  handleValidationErrors,
];