import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { env } from './config/env';
import healthRoutes from './routes/healthRoutes';
import importRoutes from './routes/importRoutes';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

const createApp = (): Application => {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS configuration — supports comma-separated origins for production
  const allowedOrigins = env.FRONTEND_URL.split(',').map((origin) => origin.trim());

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(null, false);
      },
      credentials: true,
    })
  );

  // Compression
  app.use(compression());

  // Logging
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });
  app.use(limiter);

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/', healthRoutes);
  app.use('/api', importRoutes);

  // 404 handler
  app.use(notFound);

  // Global error handler
  app.use(errorHandler);

  return app;
};

export default createApp;
