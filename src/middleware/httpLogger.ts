import { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import logger from '../logger';

const captureResponseBody = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Skip capturing for api-docs
  if (req.path.startsWith('/api-docs')) {
    return next();
  }

  const originalSend = res.send;

  res.send = function (body?: unknown): Response {
    try {
      res.locals.body = typeof body === 'string' ? JSON.parse(body) : body;
    } catch {
      res.locals.body = body;
    }
    return originalSend.call(this, body);
  };

  next();
};

morgan.token('res-body', (_, res: Response) => {
  const body = res.locals.body;
  if (!body) return '';

  // Skip large HTML responses (like Swagger UI)
  if (typeof body === 'string' && body.length > 1000) {
    return '[HTML Content Skipped]';
  }

  return typeof body === 'object'
    ? JSON.stringify(body, null, 2)
    : String(body);
});

// Enhanced skip function
const skipLogging = (req: Request): boolean => {
  const skipPaths = ['/api-docs', '/favicon.ico', '/health', '/metrics'];

  // Skip static files and Swagger endpoints
  return skipPaths.some(
    (path) =>
      req.path.startsWith(path) ||
      req.path.endsWith('.css') ||
      req.path.endsWith('.js') ||
      req.path.endsWith('.png') ||
      req.path.endsWith('.ico'),
  );
};

const httpLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms - :res-body',
  {
    skip: skipLogging,
    stream: {
      write: (message: string) => {
        const match = message.match(/\s(\d{3})\s/);
        const statusCode = match ? parseInt(match[1], 10) : 0;

        const logMethod = statusCode >= 400 ? logger.error : logger.info;
        logMethod(message.trim());
      },
    },
  },
);

export default [captureResponseBody, httpLogger];
