import 'dotenv/config'
import express from 'express';
import morgan from 'morgan';
import TasksRouter from './src/routes/tasks.routes.js';
import errorHandler from './src/middlewares/errorHandler.middleware.js';
import bcrypt from 'bcryptjs';
import { User } from './src/models/User.js';
import * as jose from 'jose'

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.use('/tasks', TasksRouter);

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const encriptedPass = hashPassword(password);
    const user = new User({ username, email, password: encriptedPass });
    await user.save()
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  const token = await new jose.SignJWT({
    username: user.username,
    email: user.email,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1m')
    .sign(secret)

  res.json({ message: 'User logged in successfully', token });
})

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
