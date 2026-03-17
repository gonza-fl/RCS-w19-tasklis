import { Router } from "express";
import {
  listAllTasks,
  createTask,
  getTaskById,
  patchTaskById,
  deleteTaskById,
  restoreTaskById
} from '../controllers/tasks.controllers.js';
import { validateCreateTask, validateTaskId, validateUpdateTaskById } from '../middlewares/tasks.middleware.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', auth, listAllTasks);
router.get('/:id', auth, validateTaskId, getTaskById);
router.patch('/:id', auth, validateUpdateTaskById, patchTaskById);
router.delete('/:id', auth, validateTaskId, deleteTaskById);
router.post('/', auth, validateCreateTask, createTask);
router.patch('/:id/restore', auth, validateTaskId, restoreTaskById);

export default router;
