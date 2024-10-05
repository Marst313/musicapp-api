import express, { NextFunction, Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import musicRouter from '../src/routes/musicRoutes';
import morgan from 'morgan';

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

// ! 3. ROUTES
app.use('/api/v1/musics', musicRouter);

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
