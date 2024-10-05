import { Request, Response } from 'express';
import { ErrorParams } from '../utils/type';

export function sendError(err: ErrorParams, req: Request, res: Response) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
}
