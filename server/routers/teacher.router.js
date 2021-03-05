module.exports = (app) => {
    const teachers = require('../controllers/teacher.controller')
    let router = require('express').Router()
    router.post('/', teachers.create)
        // router.get('/', teachers.findAll)
    router.get('/:id', teachers.findOne)
    router.put('/:id', teachers.update)
    router.delete('/:id', teachers.delete)
    app.use('/api/teacher', router)
}