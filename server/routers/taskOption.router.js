module.exports = (app) => {
    const router = require('express').Router()
    const TaskOption = require('../controllers/taskOption.controller')
    router.post('/', TaskOption.create)
    router.get('/', TaskOption.findByCourse)
    app.use('/api/taskOption', router)
}