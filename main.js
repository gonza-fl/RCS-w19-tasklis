import express from 'express';
import morgan from 'morgan';
import TasksRouter from './src/routes/tasks.routes.js';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.use('/tasks', TasksRouter);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
