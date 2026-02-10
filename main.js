import express from 'express';
import morgan from 'morgan';
import TasksRouter from './src/routes/tasks.routes.js';
import errorHandler from './src/middlewares/errorHandler.middleware.js';
import bcrypt from 'bcryptjs';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.use('/tasks', TasksRouter);

app.post('/hash-password', (req, res) => {
  const { password } = req.body;
  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(password, salt);
  res.json({ hash });
})

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
