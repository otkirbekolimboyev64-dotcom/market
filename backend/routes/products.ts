import { Router, Request, Response } from 'express';
import { db } from '../models';

const router = Router();

// GET /api/products
router.get('/', (req: Request, res: Response) => {
  const { category, search, minPrice, maxPrice, sort } = req.query;
  const products = db.getProducts({
    category: typeof category === 'string' ? category : undefined,
    search: typeof search === 'string' ? search : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort: typeof sort === 'string' ? sort : undefined,
  });
  res.json({ success: true, count: products.length, data: products });
});

// GET /api/products/categories
router.get('/categories', (_req: Request, res: Response) => {
  const categories = db.getCategories();
  res.json({ success: true, data: categories });
});

// GET /api/products/:id
router.get('/:id', (req: Request, res: Response) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
  }
  res.json({ success: true, data: product });
});

// POST /api/products
router.post('/', (req: Request, res: Response) => {
  try {
    const product = db.addProduct(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Xatolik yuz berdi' });
  }
});

// PUT /api/products/:id
router.put('/:id', (req: Request, res: Response) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
  }
  res.json({ success: true, data: updated });
});

// DELETE /api/products/:id
router.delete('/:id', (req: Request, res: Response) => {
  const deleted = db.deleteProduct(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
  }
  res.json({ success: true, message: 'Mahsulot muvaffaqiyatli o\'chirildi' });
});

export default router;
