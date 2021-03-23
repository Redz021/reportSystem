const { Student, Teacher } = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config')

module.exports = {
    login: async(req, res) => {
        //判空

        const { userNum, password } = req.body
        let user = await Student.findOne({ sno: userNum, password })
        if (user) {
            //按照学生处理
            const token = jwt.sign({ id: user.id }, config.secretKey)
            return res.send({ type: 0, user, token })
        }
        user = await Teacher.findOne({ tno: userNum, password })
        if (user) {
            //按照教师处理
            const token = jwt.sign({ id: user.id }, config.secretKey)
            return res.send({ type: 1, user, token })
        }
        res.send({ code: -1, msg: '用户不存在' })
    },
}