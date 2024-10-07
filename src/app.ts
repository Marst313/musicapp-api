import express, { NextFunction, Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import musicRouter from '../src/routes/musicRoutes';
import authRouter from '../src/routes/authRoutes';

import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';

const app = express();

// ! 1. BODY PARSER
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//? A. Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//? B. Development looging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ! 2. Middleware

// ? A. Set security headers
app.use(helmet());

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
app.all('*', function (req: Request, res: Response, next: NextFunction) {
  const err = new Error(`Cant find ${req.originalUrl} on this server`);

  res.status(404).json({
    status: 'error',
    message: err.message,
  });
});

// ! 5, Middleware to handle errors
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something broke!',
  });
});

export default app;
