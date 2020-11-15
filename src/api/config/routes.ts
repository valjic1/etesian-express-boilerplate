import express from 'express';

import { router as authRouter } from '../routes/auth.route';
import { router as userRouter } from '../routes/user.route';

export const router = express.Router();

router.get('/status', (req, res) => res.send('OK'));

router.use('/auth', authRouter);
router.use('/users', userRouter);
