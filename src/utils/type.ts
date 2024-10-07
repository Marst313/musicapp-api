import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { IMusicModel } from '../models/music';

// ! ROUTING
export type ErrorParams = {
  status: ReasonPhrases;
  statusCode: StatusCodes;
  message: string;
};
