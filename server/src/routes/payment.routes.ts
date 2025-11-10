import { Router } from 'express';
import { protect } from '../middleware/auth';

const router = Router();

// Initiate payment
router.post('/initiate', protect, (req, res) => {
  res.json({ message: 'Initiate payment' });
});

// M-Pesa callback
router.post('/mpesa/callback', (req, res) => {
  res.json({ message: 'M-Pesa callback received' });
});

// Intasend webhook
router.post('/intasend/webhook', (req, res) => {
  res.json({ message: 'Intasend webhook received' });
});

// Verify payment
router.get('/verify/:transactionId', protect, (req, res) => {
  res.json({ message: `Verify payment ${req.params.transactionId}` });
});

export default router;
