import { Router } from "express";
import { listAllTasks, createTask, getTaskById, patchTaskById, deleteTaskById, restoreTaskById, recycleBin } from '../controllers/tasks.controllers.js';
import { validateCreateTask, validateTaskId, validateUpdateTaskById } from '../middlewares/tasks.middleware.js';
// import { auth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', listAllTasks);
router.get('/:id', validateTaskId, getTaskById);
router.patch('/:id', validateUpdateTaskById, patchTaskById);
router.delete('/:id', validateTaskId, deleteTaskById);
router.post('/', validateCreateTask, createTask);
router.patch('/:id/restore', validateTaskId, restoreTaskById);

export default router;

// TODO: AGREGAR AUTHENTICATION & AUTHORIZATION
// Autenticacion vs Autorizacion
// Autenticacion: Quien sos? (Login, JWT, Tokens)
// Autorizacion: Que podes hacer? (Roles, Permisos)
