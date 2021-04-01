// const assert = require('http-assert')
const config = require('../config')
const { Student, Teacher } = require('../models')
const jwt = require('jsonwebtoken')
module.exports.authMiddleware = async(req, res, next) => {
    const token = String(req.headers.authorization || '')
        .split(' ')
        .pop()
    if (!token) {
        return res.send({ code: -1, msg: '需要token' })
    }
    const { id, lastlogout } = jwt.verify(token, config.secretKey)
    if (!id) {
        return res.send({ code: -1, msg: 'token无效' })
    }
    req.user = await Student.findById(id)
    if (!req.user) {
        req.user = await Teacher.findById(id)
    }
    if (req.user._lastlogout !== lastlogout) {
        return res.send({ code: -1, msg: 'token无效' }) //用户已注销
    }
    if (!req.user) {
        return res.send({ code: -1, msg: '请登录' })
    }
    await next()
}