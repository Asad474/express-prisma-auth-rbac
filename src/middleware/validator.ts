/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodType } from 'zod';
import { httpStatusCode } from '../constants/httpStatusCode.constants';
import { sendResponse } from '../utils/sendResponse';

const validateBody = (schema: ZodType<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const firstError = err.issues[0];
        const path = firstError.path
          .filter((p) => p !== 'body' && p !== 'query' && p !== 'params')
          .join('.');

        const message = path
          ? `${path} - ${firstError.message}`
          : firstError.message;

        sendResponse(res, {
          data: err.issues,
          message,
          statusCode: httpStatusCode.BAD_REQUEST,
          success: false,
        });
        return;
      }

      next(err);
      return;
    }
  };
};

export default validateBody;
