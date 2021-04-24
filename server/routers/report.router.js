module.exports = (app) => {
    const Report = require('../controllers/report.controller')
    let router = require('express').Router()
    router.post('/', Report.create)
    router.get('/task/:task', Report.findByTask)
    router.get('/', Report.findByStudentAndCourse)
    app.use('/api/report', router)
}