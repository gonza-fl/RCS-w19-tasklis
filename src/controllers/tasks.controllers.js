import { Task } from "../models/Task.js"

const listAllTasks = async (req, res) => {

    const { getRecycleBin } = req.query;

    try {
        if (getRecycleBin === 'true') {
            return recycleBin(req, res)
        }
        const tasks = await Task.find({ deletedAt: null })
        return res.status(200).json(tasks)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task || task.deletedAt === null || task.deletedAt === undefined) {
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
    const softDelete = req.query.softDelete === 'true'
    try {
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
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const restoreTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).json({ error: 'Task not found' })
        }
        task.deletedAt = null
        await task.save()
        return res.status(200).json({ message: 'Task restored successfully' })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const recycleBin = async (_req, res) => {
    try {
        const tasks = await Task.find({ deletedAt: { $ne: null } })
        return res.status(200).json(tasks)
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
    restoreTaskById,
    recycleBin
}
