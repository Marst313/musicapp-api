import music from '../db/music';
import { IMusic } from './../models/music';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { sendError } from './errorController';

export async function getAllMusic(req: Request, res: Response) {
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

    sendError({ message: 'Cannot get all music', status: 'error', statusCode: 500 }, req, res);
  }
}

export async function createNewMusic(req: Request, res: Response, next: NextFunction) {
  const newMusic: IMusic = { ...req.body, id: uuidv4() };
  const { description, file_name, image, name, singer, title } = newMusic;

  if (!description || !file_name || !image || !name || !singer || !title) {
    return sendError({ message: 'Fields cant be empty', status: 'error', statusCode: 400 }, req, res);
  }

  try {
    await music.createNewMusic({ ...newMusic, id: uuidv4() });

    res.status(200).json({
      status: 'success',
      message: 'New music created',
      data: {
        music: { ...newMusic },
      },
    });
  } catch (error) {
    console.error('Error type', error);

    sendError({ message: 'Cant create new music', status: 'error', statusCode: 500 }, req, res);
  }
}

export async function getSingleMusic(req: Request, res: Response) {
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

    return sendError({ message: 'Cant get single music', status: 'error', statusCode: 500 }, req, res);
  }
}

export async function deleteSingleMusic(req: Request, res: Response) {
  try {
    const deleted = await music.deleteSingleMusic(req.params.id);

    if (deleted) {
      return sendError({ message: `Music with ${req.params.id} id's not found`, status: 'error', statusCode: 404 }, req, res);
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    console.error('Error', error);

    return sendError({ message: 'Cant delete single music', status: 'error', statusCode: 500 }, req, res);
  }
}
