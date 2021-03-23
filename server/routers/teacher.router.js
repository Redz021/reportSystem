module.exports = (app) => {
    const Teahcer = require('../controllers/teacher.controller')
    let router = require('express').Router()
    router.post('/', Teahcer.create) //创建教师（tno教师工号，teacherName教师名称，password密码）
        // router.get('/', Teahcer.findAll)
    router.get('/:id', Teahcer.findOne) //按教师id查找教师
    router.put('/:id', Teahcer.update) //更新id代表的教师，参数同创建教师
    router.delete('/:id', Teahcer.delete) //按id删除教师
    app.use('/api/teacher', router)
}