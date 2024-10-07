import { hash } from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import validator from 'validator';
import { sendError } from '../controllers/errorController';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { IUserModel } from '../models/user';
import { checkIfEmailExists } from '../db/user';

const SALT_ROUNDS = {
  ADMIN: 14,
  USER: 10,
};

export async function signUpMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, confirmPassword, role = 1 }: IUserModel = req.body;

    // ! 1. Check if email is valid
    if (!validator.isEmail(email)) return sendError({ message: 'Email is not valid', status: ReasonPhrases.BAD_REQUEST, statusCode: StatusCodes.BAD_REQUEST }, res);

    // ! 2. Check existing user
    const isEmailExist = await checkIfEmailExists(email);

    if (isEmailExist) return sendError({ message: 'Email is already exist', status: ReasonPhrases.CONFLICT, statusCode: StatusCodes.CONFLICT }, res);

    // ! 3. Check if password is strong
    if (!validator.isStrongPassword(password)) return sendError({ message: 'Password is not strong', status: ReasonPhrases.BAD_REQUEST, statusCode: StatusCodes.BAD_REQUEST }, res);

    // ! 4. Check if password is not same with confirmPassword
    if (password !== confirmPassword) return sendError({ message: 'Oops! The passwords you entered do not match. Please try again.', status: ReasonPhrases.BAD_REQUEST, statusCode: StatusCodes.BAD_REQUEST }, res);

    // ! 5. Hash the password
    const saltRounds = role === 2 ? SALT_ROUNDS.ADMIN : SALT_ROUNDS.USER;
    req.body.password = await hash(password, saltRounds);

    // ! 6. Remove confirm password for safety
    req.body.confirmPassword = null;

    return next();
  } catch (error) {
    console.log(error);

    sendError({ message: 'Cant sign up', status: ReasonPhrases.INTERNAL_SERVER_ERROR, statusCode: StatusCodes.INTERNAL_SERVER_ERROR }, res);
  }
}
