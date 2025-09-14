import { NextFunction, Request, Response } from "express";

import { AppError } from "../utils/AppError";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(404, "Not Found");
  next(error);
};

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    console.error(err); // Log the error for debugging
  }

  res.status(statusCode).json({
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    message,
    success: false,
  });
};
