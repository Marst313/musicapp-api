import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// Error handling middleware implementation
export function globalErrorHandler(
  err: any, // Gunakan any jika Anda tidak yakin dengan tipe error
  req: Request,
  res: Response | any,
  next: NextFunction
) {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message;

  console.error('Error:', err); // Log error untuk debugging

  // Cek apakah header sudah dikirim
  return res.status(statusCode).json({ status: 'error', message });
}
