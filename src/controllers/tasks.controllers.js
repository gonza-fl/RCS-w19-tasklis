import { Task } from "../models/Task.js"

const listAllTasks = async (_req, res) => {
    try {
        const tasks = await Task.find()
        return res.status(200).json(tasks)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).json({ error: 'Task not found' })
        }
        return res.status(200).json(task)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body)
        return res.status(201).json(task)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const patchTaskById = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!task) {
            return res.status(404).json({ error: 'Task not found' })
        }
        return res.status(200).json(task)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const deleteTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).json({ error: 'Task not found' })
        }
        task.deletedAt = new Date()
        await task.save()
        return res.status(200).json({ message: 'Task deleted successfully' })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export {
    listAllTasks,
    createTask,
    getTaskById,
    patchTaskById,
    deleteTaskById,
}
