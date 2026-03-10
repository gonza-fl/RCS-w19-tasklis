import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import TasksRouter from './src/routes/tasks.routes.js';
import AuthRouter from './src/routes/auth.routes.js';
import errorHandler from './src/middlewares/errorHandler.middleware.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.use('/tasks', TasksRouter);

app.use('/auth', AuthRouter)

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
