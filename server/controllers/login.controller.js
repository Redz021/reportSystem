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
            const token = jwt.sign({ id: user.id, lastlogout: user._lastlogout },
                config.secretKey
            )
            return res.send({ type: 0, user, token })
        }
        user = await Teacher.findOne({ tno: userNum, password })
        if (user) {
            //按照教师处理
            const token = jwt.sign({ id: user.id, lastlogout: user._lastlogout },
                config.secretKey
            )
            return res.send({ type: 1, user, token })
        }
        res.send({ code: -1, msg: '用户不存在或密码错误' })
    },
    logout: async(req, res) => {
        const { id, type } = req.body
        if (type == 0) {
            let result = await Student.findOneAndUpdate({ _id: id }, { $set: { _lastlogout: new Date().getTime() } }, { new: true })
            return res.send({ code: 1, result })
        } else {
            let result = await Teacher.findOneAndUpdate({ _id: id }, { $set: { _lastlogout: new Date().getTime() } }, { new: true })
            return res.send({ code: 1, result })
        }
    },
}