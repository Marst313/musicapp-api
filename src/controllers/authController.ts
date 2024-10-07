import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { sendError } from './errorController';
import { createNewUser } from '../db/user';

async function signUp(req: Request, res: Response) {
  try {
    const newUser = await createNewUser(req.body);

    res.status(StatusCodes.CREATED).json({
      status: 'success',
      message: 'Success Sign Up',
      data: newUser,
    });
  } catch (error) {
    console.log(error);

    sendError({ message: 'Unable to complete sign-up', status: ReasonPhrases.INTERNAL_SERVER_ERROR, statusCode: StatusCodes.INTERNAL_SERVER_ERROR }, res);
  }
}

export { signUp };
