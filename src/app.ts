import express, { NextFunction, Request, Response } from 'express';
import musicRouter from '../src/routes/musicRoutes';
import authRouter from '../src/routes/authRoutes';

import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { globalErrorHandler } from './controllers/errorController';

const app = express();

// ! 1. BODY PARSER
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

//? A. Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//? B. Development looging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ! 2. Middleware

// ? A. Set security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'http://127.0.0.0.1:3000'"],
      },
    },
  })
);

// ? B. Set limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100,
  })
);

// ? C. Security for cross site scripting

// ! 3. ROUTES
app.use('/api/v1/musics', musicRouter);
app.use('/auth', authRouter);

// ! 4. Error Routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  (err as any).statusCode = 404; // Menetapkan status kode 404
  next(err); // Panggil next untuk menyerahkan ke error handler
});

// Global error handler middleware
app.use(globalErrorHandler);

// ! 5, Middleware to handle errors
// app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
//   console.error(err.stack);
//   res.status(500).json({
//     status: 'error',
//     message: 'Something broke!',
//   });
// });

export default app;
