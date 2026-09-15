import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import productsRouter from './backend/routes/products';
import usersRouter from './backend/routes/users';
import ordersRouter from './backend/routes/orders';
import { db } from './backend/models';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Backend API Routes matching structure: backend/routes/
  app.use('/api/products', productsRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/orders', ordersRouter);

  // Admin statistics route
  app.get('/api/stats', (_req, res) => {
    res.json({ success: true, data: db.getStats() });
  });

  // Vite middleware in development vs static file serving in production
  const distPath = path.join(process.cwd(), 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));

  if (process.env.NODE_ENV === 'production' || (!process.env.NODE_ENV && hasDist)) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Market Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
