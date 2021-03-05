module.exports = (app) => {
    const courses = require('../controllers/course.controller')
    let router = require('express').Router()
    router.post('/', courses.create)
    router.get('/', courses.findAll)
    router.get('/:id', courses.findOne)
    router.put('/:id', courses.update)
    router.delete('/:id', courses.delete)
    app.use('/api/course', router)
}