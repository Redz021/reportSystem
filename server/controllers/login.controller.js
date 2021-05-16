const { Student, Teacher } = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config')
const bcrypt = require('bcrypt')
module.exports = {
    login: async(req, res) => {
        //判空

        const { userNum, password } = req.body
        let user = await Student.findOne({ sno: userNum }).select('+password')
        if (user) {
            //按照学生处理
            if (await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ id: user.id, lastlogout: user._lastlogout, admin: false },
                    config.secretKey
                )
                return res.send({ type: 0, user, token })
            } else {
                return res.send({ code: -1, msg: '密码错误' })
            }
        }
        user = await Teacher.findOne({ tno: userNum }).select('+password')
        if (user) {
            //按照教师处理
            if (await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ id: user.id, lastlogout: user._lastlogout, admin: true },
                    config.secretKey
                )
                return res.send({ type: 1, user, token })
            } else {
                return res.send({ code: -1, msg: '密码错误' })
            }
        }
        res.send({ code: -1, msg: '用户不存在' })
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