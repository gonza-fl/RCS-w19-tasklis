import validator from 'validator';

const validateCreateTask = (req, res, next) => {
    const { title, priority, completed, description } = req.body;
    if (!validator.isLength(title, { min: 4, max: 100 })) {
        return res.status(400).json({ error: 'The field `title` must be between 4 and 100 characters' });
    }
    if (!validator.isIn(priority.trim().toLowerCase(), ['high', 'medium', 'low'])) {
        return res.status(400).json({ error: 'The field `priority` must be `high`, `medium` or `low`' });
    }
    if(completed && !validator.isBoolean(completed)) {
        return res.status(400).json({ error: 'The field `completed` must be a boolean' });
    }
    if(description && !validator.isLength(description.trim(), { max: 255 })) {
        return res.status(400).json({ error: 'The field `description` must be less than 255 characters' });
    }
    next();
}

const validateTaskId = (req, res, next) => {
    const { id } = req.params;
    if (!validator.isMongoId(id)) {
        return res.status(400).json({ error: 'The field `id` must be a valid MongoDB ID' });
    }
    next();
}

const validatePatchTask = (req, res, next) => {
    const {
        title,
        priority,
        completed,
        description,
        finishedAt,
        state,
        deletedAt,
        ...rest
    } = req.body;

    if (title && !validator.isLength(title, { min: 4, max: 100 })) {
        return res.status(400).json({ error: 'The field `title` must be between 4 and 100 characters' });
    }
    if (priority && !validator.isIn(priority.trim().toLowerCase(), ['high', 'medium', 'low'])) {
        return res.status(400).json({ error: 'The field `priority` must be `high`, `medium` or `low`' });
    }
    if(completed && !validator.isBoolean(completed)) {
        return res.status(400).json({ error: 'The field `completed` must be a boolean' });
    }
    if(finishedAt && !validator.isDate(finishedAt)) {
        return res.status(400).json({ error: 'The field `finishedAt` must be a date' });
    }
    if(state && !validator.isIn(state.trim().toLowerCase(), ['active', 'deleted', 'completed', 'archived', 'pending', 'in_progress', 'blocked'])) {
        return res.status(400).json({ error: 'The field `state` must be `active`, `deleted`, `completed`, `archived`, `pending`, `in_progress` or `blocked`' });
    }
    if(description && !validator.isLength(description.trim(), { max: 255 })) {
        return res.status(400).json({ error: 'The field `description` must be less than 255 characters' });
    }
    if(deletedAt) {
        return res.status(400).json({ error: 'The field `deletedAt` is not allowed to this request, use a DELETE request instead' });
    }
    if(Object.keys(rest).length > 0) {
        return res.status(400).json({ error: `Some fields are setted but are not allowed to this request` });
    }
    next();
}

const validateUpdateTaskById = [
    validateTaskId,
    validatePatchTask,
]

export {
    validateCreateTask,
    validateTaskId,
    validateUpdateTaskById,
};
