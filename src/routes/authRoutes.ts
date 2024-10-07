import { signUpMiddleware } from '../middleware/authMiddleware';
import { Router } from 'express';
import { signUp } from '../controllers/authController';

const router = Router();

router.route('/sign-up').post(signUpMiddleware, signUp);

export default router;
