// middleware/error.ts
import { NextFunction, Request, Response } from 'express';
import { commonMessages } from '../constants/commonMessages.constants';
import { httpStatusCode } from '../constants/httpStatusCode.constants';
import logger from '../logger';
import { AppError } from '../utils/AppError';
import { sendResponse } from '../utils/sendResponse';

export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  logger.warn('Route not found', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  const error = new AppError(httpStatusCode.NOT_FOUND, 'Route not found');
  next(error);
};

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let statusCode = httpStatusCode.INTERNAL_SERVER_ERROR;
  let message = commonMessages.SOMETHING_WENT_WRONG as string;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  logger.error('API Error', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    statusCode,
  });

  sendResponse(res, {
    success: false,
    statusCode,
    message,
  });
};
