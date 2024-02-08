const validator = (req, res, next) => {
    const task = req.body
    if(task.hasOwnProperty("title") &&
    task.hasOwnProperty("description") &&
    task.hasOwnProperty("completed")) {
        if (typeof task.title !== 'string' || task.title.trim() === '') {
            return res.status(400).json({message: "invalid input for title"})
        } else if (typeof task.description !== 'string' || task.description.trim() === '') {
            return res.status(400).json({message: "invalid input for description"})
        } else if (typeof task.completed !== 'boolean') {
            return res.status(400).json({message: "invalid input for completed"})
        }
        next()
    } else {
        return res.status(400).json({message: "Missing property! Please check again"})
    }
}

module.exports = validator
