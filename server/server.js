import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { pathToFileURL } from 'node:url';
import translateRouter from './routes/translate.js';

dotenv.config();

export function createApp() {
  const app = express();
  const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

  app.use(
    cors({
      origin: clientOrigin,
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type']
    })
  );
  app.use(express.json({ limit: '32kb' }));

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/translate', translateRouter);

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'The requested API endpoint was not found.'
    });
  });

  app.use((err, req, res, next) => {
    if (err?.type === 'entity.too.large') {
      return res.status(413).json({
        success: false,
        message: 'The request is too large. Please shorten the text and try again.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Something went wrong on the server. Please try again.'
    });
  });

  return app;
}

const port = process.env.PORT || 5000;
const isDirectRun = import.meta.url === pathToFileURL(process.argv[1] || '').href;

if (isDirectRun) {
  createApp().listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}
