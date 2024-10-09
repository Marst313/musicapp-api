import { ReasonPhrases, StatusCodes } from 'http-status-codes';

// ! ROUTING
export type ErrorParams = {
  status: ReasonPhrases;
  statusCode: StatusCodes;
  message: string;
};

// ! JWT
export type TOptions = { issuer: string; subject: string; audience: string };
