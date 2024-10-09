import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { userConnection } from '../database/connection/userConnection';
import { AppError } from '../utils/appError';

async function signUp(req: Request, res: Response, next: NextFunction) {
  try {
    const newUser = await userConnection.createNewUser(req.body);

    res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'Success Sign Up',
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    return next(new AppError('Unable to complete Sign Up', StatusCodes.INTERNAL_SERVER_ERROR));
  }
}

async function signIn(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Success Sign In',
      token: req.body.token,
    });
  } catch (error) {
    console.log(error);

    return next(new AppError('Unable to complate Sign In', StatusCodes.INTERNAL_SERVER_ERROR));
  }
}

export { signUp, signIn };
