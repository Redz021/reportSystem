module.exports = (app) => {
    const Course = require('../controllers/course.controller')
    let router = require('express').Router()
    router.use((req, res, next) => {
        if (req.admin) next()
        else res.status(403)
    })
    router.post('/', Course.create) //创建课程（课程号cno、课程名courseName、学年year、授课教师teacher的id）
    router.get('/', Course.findAll) //无参数默认查找所有课程，若有参数?teacher=xxx则查找teacher的所有课程
    router.get('/:id', Course.findOne) //按课程id查找某一课程
    router.put('/:id', Course.update) //按id对某一课程信息进行更新，参数同创建课程
    router.delete('/:id', Course.delete) //删除id课程
    app.use('/api/course', router)
}