import { Router } from "express";
import { listAllTasks, createTask, getTaskById, patchTaskById, deleteTaskById } from '../controllers/tasks.controllers.js';
import { validateCreateTask, validateTaskId, validateUpdateTaskById } from '../middlewares/tasks.middleware.js';

const router = Router();

router.get('/', listAllTasks);
router.get('/:id', validateTaskId, getTaskById);
router.patch('/:id', validateUpdateTaskById, patchTaskById);
router.delete('/:id', validateTaskId, deleteTaskById);
router.post('/', validateCreateTask, createTask);

export default router;
