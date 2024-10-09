import { signInMiddleware, signUpMiddleware } from '../middleware/authMiddleware';
import { Router } from 'express';
import { signIn, signUp } from '../controllers/authController';

const router = Router();

router.post('/sign-up', signUpMiddleware, signUp);
router.post('/sign-in', signInMiddleware, signIn);

export default router;
