import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  mergeCart,
} from '../controllers/cart.controller';

const router = Router();

// All cart routes require authentication
router.use(protect);

// GET /api/cart - get current user's cart
router.get('/', getCart);

// POST /api/cart - add an item or increment
router.post('/', addItem);

// PUT /api/cart/:itemId - update item quantity
router.put('/:itemId', updateItem);

// DELETE /api/cart/:itemId - remove item
router.delete('/:itemId', removeItem);

// POST /api/cart/merge - merge guest cart into user's cart
router.post('/merge', mergeCart);

export default router;
