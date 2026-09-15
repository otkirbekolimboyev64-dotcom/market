import { Router, Request, Response } from 'express';
import { db } from '../models';

const router = Router();

// GET /api/users/profile
router.get('/profile', (_req: Request, res: Response) => {
  const user = db.getUser();
  res.json({ success: true, data: user });
});

// PUT /api/users/profile
router.put('/profile', (req: Request, res: Response) => {
  const updated = db.updateUser(req.body);
  res.json({ success: true, data: updated });
});

// POST /api/users/wishlist/:productId
router.post('/wishlist/:productId', (req: Request, res: Response) => {
  const wishlist = db.toggleWishlist(req.params.productId);
  res.json({ success: true, data: wishlist });
});

export default router;
