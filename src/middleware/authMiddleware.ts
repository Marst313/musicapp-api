import { compareSync, hash } from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { userConnection } from '../database/connection/userConnection';
import { IUserModel } from '../models/userModel';
import { validateEmail, validatePasswordMatch, validatePasswordStrength } from '../utils/validators';
import { AppError } from '../utils/appError';

const SALT_ROUNDS = {
  ADMIN: 14,
  USER: 10,
};

export async function signUpMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, confirmPassword, role = 1 }: IUserModel = req.body;

    // ! 1. Check if email is valid
    if (!validateEmail(email)) {
      return next(new AppError('Email is not valid', StatusCodes.BAD_REQUEST));
    }

    // ! 2. Check existing user
    const isEmailExist = await userConnection.checkIfEmailExists(email);

    if (isEmailExist) {
      return next(new AppError('Email is already exist', StatusCodes.CONFLICT));
    }

    // ! 3. Check if password is strong
    if (!validatePasswordStrength(password)) {
      return next(new AppError('Password is not strong', StatusCodes.BAD_REQUEST));
    }

    // ! 4. Check if password is not same with confirmPassword
    if (!validatePasswordMatch(password, confirmPassword)) {
      return next(new AppError('The passwords you entered do not match. Please try again.', StatusCodes.BAD_REQUEST));
    }

    // ! 5. Hash the password
    const saltRounds = role === 2 ? SALT_ROUNDS.ADMIN : SALT_ROUNDS.USER;
    req.body.password = await hash(password, saltRounds);

    // ! 6. Remove confirm password for safety
    delete req.body.confirmPassword;

    return next();
  } catch (error) {
    console.log(error);

    return next(new AppError('Unable to complete Sign Up.', StatusCodes.INTERNAL_SERVER_ERROR));
  }
}

/**
 * Middleware for user sign in.
 * Validates the user input and checks for email and password correctness.
 */
export async function signInMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password }: IUserModel = req.body;

    // ! 1. Validate email and password
    if (!email || !password) {
      return next(new AppError('Email or password cannot be empty.', StatusCodes.BAD_REQUEST));
    }

    // ! 2. Validate if email valid
    if (!validateEmail(email)) {
      return next(new AppError('Email is not valid.', StatusCodes.BAD_REQUEST));
    }

    // ! 3. Get user data from database
    const user = await userConnection.loginUser(req.body);

    req.body.token = user.token;

    // ! 4. Compare password
    if (!compareSync(password, user.password)) {
      return next(new AppError('Wrong email or password.', StatusCodes.UNAUTHORIZED));
    }

    // ! 5. Proceed to next middleware if successful
    return next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Users is not found') {
        return next(new AppError('Wrong email or password.', StatusCodes.UNAUTHORIZED));
      }
    }

    console.log(error);

    return next(new AppError('Unable to complete sign in.', StatusCodes.UNAUTHORIZED));
  }
}
