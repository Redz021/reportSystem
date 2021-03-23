const assert = require('http-assert')
const config = require('../config')
const { Student, Teacher } = require('../models')
const jwt = require('jsonwebtoken')
module.exports.authMiddleware = async(req, res, next) => {
    const token = String(req.headers.authorization || '')
        .split(' ')
        .pop()
        // assert(token, 401, '需要token')
    if (!token) {
        return res.send({ code: -1, msg: '需要token' })
    }
    const id = jwt.verify(token, config.secretKey).id
    if (!id) {
        return res.send({ code: -1, msg: 'token无效' })
    }
    // assert(id, 401, 'token无效')
    req.user = await Student.findById(id)
    if (!req.user) {
        req.user = await Teacher.findById(id)
    }
    // assert(req.user, 401, '请登录')
    if (!req.user) {
        return res.send({ code: -1, msg: '请登录' })
    }
    await next()
}