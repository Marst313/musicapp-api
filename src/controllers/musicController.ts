import music from '../db/music';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { sendError } from './errorController';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { IMusicModel } from '../models/music';

async function getAllMusic(req: Request, res: Response) {
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

    sendError({ message: 'Cannot get all music', status: ReasonPhrases.INTERNAL_SERVER_ERROR, statusCode: StatusCodes.INTERNAL_SERVER_ERROR }, res);
  }
}

async function createNewMusic(req: Request, res: Response, next: NextFunction) {
  const newMusic: IMusicModel = { ...req.body, id: uuidv4() };
  const { description, file_name, image, name, singer, title } = newMusic;

  if (!description || !file_name || !image || !name || !singer || !title) {
    return sendError({ message: 'Fields cant be empty', status: ReasonPhrases.BAD_REQUEST, statusCode: StatusCodes.BAD_REQUEST }, res);
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

    sendError({ message: 'Cant create new music', status: ReasonPhrases.INTERNAL_SERVER_ERROR, statusCode: StatusCodes.INTERNAL_SERVER_ERROR }, res);
  }
}

async function getSingleMusic(req: Request, res: Response) {
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

    return sendError({ message: 'Cant get single music', status: ReasonPhrases.INTERNAL_SERVER_ERROR, statusCode: StatusCodes.INTERNAL_SERVER_ERROR }, res);
  }
}

async function deleteSingleMusic(req: Request, res: Response) {
  try {
    const deleted = await music.deleteSingleMusic(req.params.id);

    if (deleted) {
      return sendError({ message: `Music with ${req.params.id} id's not found`, status: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND }, res);
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    console.error('Error', error);

    return sendError({ message: 'Cant delete single music', status: ReasonPhrases.INTERNAL_SERVER_ERROR, statusCode: StatusCodes.INTERNAL_SERVER_ERROR }, res);
  }
}

export { getAllMusic, createNewMusic, getSingleMusic, deleteSingleMusic };
