import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Release escrow funds (buyer confirms delivery)
router.post('/:orderId/release', protect, authorize('buyer'), (req, res) => {
  res.json({ message: `Release escrow for order ${req.params.orderId}` });
});

// Dispute escrow
router.post('/:orderId/dispute', protect, (req, res) => {
  res.json({ message: `Dispute escrow for order ${req.params.orderId}` });
});

// Get escrow status
router.get('/:orderId', protect, (req, res) => {
  res.json({ message: `Get escrow status for order ${req.params.orderId}` });
});

export default router;
