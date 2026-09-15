import { Router, Request, Response } from 'express';
import { db } from '../models';

const router = Router();

// GET /api/orders
router.get('/', (_req: Request, res: Response) => {
  const orders = db.getOrders();
  res.json({ success: true, count: orders.length, data: orders });
});

// GET /api/orders/:id
router.get('/:id', (req: Request, res: Response) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Buyurtma topilmadi' });
  }
  res.json({ success: true, data: order });
});

// POST /api/orders
router.post('/', (req: Request, res: Response) => {
  try {
    const newOrder = db.createOrder(req.body);
    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Buyurtma yaratishda xatolik yuz berdi' });
  }
});

// PATCH /api/orders/:id/status
router.patch('/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  const updated = db.updateOrderStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Buyurtma topilmadi' });
  }
  res.json({ success: true, data: updated });
});

export default router;
