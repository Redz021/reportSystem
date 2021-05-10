const { Teacher } = require('../models')
const config = require('../config')
module.exports = {
    create: async(req, res) => {
        if (!req.body) {
            return res.status(400).send({ message: '内容不能为空' })
        }
        const { tno, teacherName } = req.body
        const password = await config.getEncryptedPassword(config.originalPassword)
        const teacher = new Teacher({ tno, teacherName, password })
        teacher
            .save(teacher)
            .then((data) => res.send(data))
            .catch((err) => res.status(400).send(err))
    },
    findAll: (req, res) => {
        const tno = req.query.tno
        let condition = tno ?
            { tno: { $regex: new RegExp(tno), $options: 'i' } } :
            {}
        Teacher.find(condition)
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send(err))
    },
    findOne: (req, res) => {
        const id = req.params.id
        Teacher.findById(id)
            .then((data) =>
                data ?
                res.send(data) :
                res.status(404).send({ message: `未找到id为${id}的对象` })
            )
            .catch((err) => res.status(500).send(err))
    },
    update: (req, res) => {
        if (!req.body) {
            return res.status(400).send({ message: '更新的内容不能为空' })
        }
        const id = req.params.id
        const { tno, teacherName } = req.body
        Teacher.findByIdAndUpdate(id, { tno, teacherName }, { new: true })
            .then((data) =>
                data ?
                res.send(data) :
                res.status(404).send({ message: `未找到id为${id}的对象` })
            )
            .catch((err) => res.status(500).send(err))
    },
    delete: (req, res) => {
        const id = req.params.id
        Teacher.findByIdAndRemove(id)
            .then((data) =>
                data ?
                res.send(data) :
                res.status(404).send({
                    message: `无法删除id为${id}的对象`,
                })
            )
            .catch((err) => res.status(500).send(err))
    },
    updatePassword: async(req, res) => {
        const id = req.params.id
        const { password } = req.body
        const pass = await config.getEncryptedPassword(password)
        Teacher.findOneAndUpdate({ _id: id }, { $set: { password: pass } }, { new: true })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send(err))
    },
    resetPassword: async(req, res) => {
        const id = req.params.id
        const password = await config.getEncryptedPassword(config.originalPassword)

        Teacher.findOneAndUpdate({ _id: id }, { $set: { password } }, { new: true })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send(err))
    },
}