import { Router } from 'express';

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/products.controller.js';
import {
  createProductValidator,
  updateProductValidator,
} from '../validators/product.validator.js';
import { authenticate, isSeller } from '../middleware.js/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Seller only routes
router.post('/', authenticate, isSeller, createProductValidator, createProduct);
router.put('/:id', authenticate, isSeller, updateProductValidator, updateProduct);
router.delete('/:id', authenticate, isSeller, deleteProduct);

export default router;