module.exports = (app) => {
    const ScLink = require('../controllers/scLink.controller')
    let router = require('express').Router()
    router.post('/', ScLink.create) //创建学生与课程的联系（需提供学生id、课程id）
    router.get('/student/:cid', ScLink.getStudents) //获取cno课程下的所有学生
    router.get('/course/:sid', ScLink.getCourses) //获取sno学生的所有课程
    router.delete('/student', ScLink.deleteStudent) //把学生从某门课程中移除（提供学生id、课程id）
    router.post('/students', ScLink.addBatchStudents) //批量添加学生（提供课程id、学生id[]）注意：未实现去重，可重复添加
    app.use('/api/scLink', router)
}