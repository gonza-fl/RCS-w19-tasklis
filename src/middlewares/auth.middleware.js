import 'dotenv/config';
import { catchAsync } from '../utils/catchAsync.js';
import * as jwt from 'jose';

const auth = catchAsync(async (req, res, next) => {
  const token = req.headers.Authorization;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const { payload } = await jwt.verify(token, process.env.SECRET_KEY);
  req.user = payload;
  next();
});

export { auth };
