module.exports = (app) => {
    const Student = require('../controllers/student.controller')
    let router = require('express').Router()
    router.put('/password/:id', Student.updatePassword)
    router.post('/confirm/:id', Student.confirm)
    router.use((req, res, next) => {
        if (req.admin) next()
        else res.status(403).send('error')
    })
    router.post('/', Student.create) //创建学生（sno学号，studentName学生名，password密码，studentClass所在班级）
    router.get('/', Student.findAll) //默认查找所有学生，附加?studentClass=xxx可查找一个班级内的所有学生
    router.get('/:id', Student.findOne) //按id查找学生
    router.put('/:id', Student.update) //更新id为id的学生信息，参数同创建学生
    router.put('/reset/:id', Student.resetPassword)
    router.delete('/:id', Student.delete) //删除id学生
    router.delete('/', Student.deleteMany)
    app.use('/api/student', router)
}