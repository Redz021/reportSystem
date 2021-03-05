const { getStudents, getCourses } = require('../controllers/scLink.controller')

module.exports = (app) => {
    const sclink = require('../controllers/scLink.controller')
    let router = require('express').Router()
    router.post('/', sclink.create)
    router.get('/getStudents/:cno', getStudents)
    router.get('/getCourses/:sno', getCourses)
    router.delete('/deleteStudent', sclink.deleteStudent)
    router.post('/addBatchStudents', sclink.addBatchStudents)
    app.use('/api/scLink', router)
}