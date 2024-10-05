import { getAllMusic, createNewMusic, deleteSingleMusic, getSingleMusic } from '../controllers/musicController';
import { Router } from 'express';

const router = Router();

router.route('/').get(getAllMusic).post(createNewMusic);

router.route('/:id').get(getSingleMusic).delete(deleteSingleMusic);

export default router;
