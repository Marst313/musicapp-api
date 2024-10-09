import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { StatusCodes } from 'http-status-codes';

import music from '../database/connection/musicConnection';
import { IMusicModel } from '../models/musicModel';
import { AppError } from '../utils/appError';

async function getAllMusic(req: Request, res: Response, next: NextFunction) {
  try {
    const musics = await music.selectAll();

    res.status(200).json({
      status: 'success',
      message: 'Success get all musics',
      results: musics.length,
      meta: {
        data: {
          musics,
        },
      },
    });
  } catch (error) {
    console.error('Error type', error);

    return next(new AppError('Cannot get all music', StatusCodes.INTERNAL_SERVER_ERROR));
  }
}

async function createNewMusic(req: Request, res: Response, next: NextFunction) {
  const newMusic: IMusicModel = { ...req.body, id: uuidv4() };
  const { description, file_name, image, name, singer, title } = newMusic;

  if (!description || !file_name || !image || !name || !singer || !title) {
    return next(new AppError('Fields cant be empty', StatusCodes.BAD_REQUEST));
  }

  try {
    await music.createNewMusic({ ...newMusic, id: uuidv4() });

    res.status(201).json({
      status: 'success',
      message: 'New music created',
      data: {
        music: { ...newMusic },
      },
    });
  } catch (error) {
    console.error('Error type', error);

    return next(new AppError('Cant create new music.', StatusCodes.INTERNAL_SERVER_ERROR));
  }
}

async function getSingleMusic(req: Request, res: Response, next: NextFunction) {
  try {
    const musics = await music.getSingleMusic(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Success get single music',
      data: {
        musics,
      },
    });
  } catch (error) {
    console.error('Error type', error);

    return next(new AppError('Unable to get single music.', StatusCodes.INTERNAL_SERVER_ERROR));
  }
}

async function deleteSingleMusic(req: Request, res: Response, next: NextFunction) {
  try {
    const deleted = await music.deleteSingleMusic(req.params.id);

    if (deleted) {
      return next(new AppError(`Music with ${req.params.id} id's not found.`, StatusCodes.NOT_FOUND));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    console.error('Error', error);

    return next(new AppError(`Unable to delete single music.`, StatusCodes.INTERNAL_SERVER_ERROR));
  }
}

export { getAllMusic, createNewMusic, getSingleMusic, deleteSingleMusic };
