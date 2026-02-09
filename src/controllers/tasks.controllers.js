import { NotFoundError } from '../errors/customError.js';
import { Task } from "../models/Task.js"
import { catchAsync } from '../utils.js';

const listAllTasks = catchAsync(async (req, res) => {
    const { getRecycleBin } = req.query;
    if (getRecycleBin === 'true') {
        return recycleBin(req, res)
    }
    const tasks = await Task.find({ deletedAt: null })
    return res.status(200).json(tasks)
})

const getTaskById = catchAsync(async (req, res, next) => {
    const task = await Task.findById(req.params.id)
    if (!task || task.deletedAt === null || task.deletedAt === undefined) {
        next(new NotFoundError('Task not found'))
    }
    return res.status(200).json(task)
})

const createTask = catchAsync(async (req, res) => {
    const task = await Task.create(req.body)
    return res.status(201).json(task)
})

const patchTaskById = catchAsync(async (req, res, next) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!task) next(new NotFoundError('Task not found'))
    return res.status(200).json(task)
})

const deleteTaskById = catchAsync(async (req, res) => {
    const softDelete = req.query.softDelete === 'true'
    if (softDelete) {
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).json({ error: 'Task not found' })
        }
        task.deletedAt = new Date()
        await task.save()
        return res.status(200).json({ message: 'Task deleted successfully' })
    } else {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            return res.status(404).json({ error: 'Task not found' })
        }
        return res.status(200).json({ message: 'Task deleted successfully' })
    }
})

const restoreTaskById = catchAsync(async (req, res) => {
    const task = await Task.findById(req.params.id)
    if (!task) {
        return res.status(404).json({ error: 'Task not found' })
    }
    task.deletedAt = null
    await task.save()
    return res.status(200).json({ message: 'Task restored successfully' })
})

const recycleBin = catchAsync(async (_req, res) => {
    const tasks = await Task.find({ deletedAt: { $ne: null } })
    return res.status(200).json(tasks)
})

export {
    listAllTasks,
    createTask,
    getTaskById,
    patchTaskById,
    deleteTaskById,
    restoreTaskById,
    recycleBin
}
