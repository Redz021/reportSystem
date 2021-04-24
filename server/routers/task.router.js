module.exports = (app) => {
    const router = require('express').Router()
    const Task = require('../controllers/task.controller')
    router.post('/', Task.create)
    router.get('/', Task.findByCourse)
    router.put('/:id', Task.update)
    router.delete('/:id', Task.deleteById)
    app.use('/api/task', router)
}