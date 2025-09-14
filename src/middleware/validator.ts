import { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject, ZodRawShape } from "zod";

export const validateData = (schema: ZodObject<ZodRawShape>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => ({
          message: ` ${issue.path.join(".")} : ${issue.message}`,
        }));
        res.status(400).json({ details: errorMessages, error: "Invalid data" });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
};
