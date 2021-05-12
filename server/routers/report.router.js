module.exports = (app) => {
    const Report = require('../controllers/report.controller')
    let router = require('express').Router()
    router.post('/', Report.create)
    router.get('/task/:task', Report.findByTask)
    router.get('/id/:id', Report.findById)
    router.get('/', Report.findByStudentAndCourse)
    router.get('/student', Report.findByStudentAndTask)
    router.put('/:id', Report.modifyContent)
    router.put('/submit/:id', Report.submit)
    router.use((req, res, next) => {
        if (req.admin) next()
        else res.status(403).send()
    })
    router.put('/evaluate/:id', Report.evaluate)
    app.use('/api/report', router)
}