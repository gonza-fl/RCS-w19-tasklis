import { Router } from 'express';
import { login, register, confirmEmail } from '../controllers/auth.controllers.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/confirm-email', auth, confirmEmail);

export default router;
