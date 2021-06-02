const { Student, ScLink } = require('../models')
const bcrypt = require('bcrypt')
const config = require('../config')
module.exports = {
    create: async(req, res) => {
        const { sno, studentName, studentClass } = req.body
        const password = await config.getEncryptedPassword(config.originalPassword)
        const student = new Student({ sno, studentName, studentClass, password })
        student
            .save()
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send(err))
    },
    findAll: (req, res) => {
        const studentClass = req.query.studentClass
        let condition = studentClass ?
            { studentClass: { $regex: new RegExp(studentClass), $options: 'i' } } :
            {}
        Student.find(condition)
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send(err))
    },
    findOne: (req, res) => {
        const id = req.params.id
        Student.findById(id)
            .then((data) =>
                data ?
                res.send(data) :
                res.status(404).send({ message: `未找到id为${id}的对象` })
            )
            .catch((err) => res.status(500).send(err))
    },
    update: (req, res) => {
        const id = req.params.id
        const { sno, studentName, studentClass } = req.body
        Student.findByIdAndUpdate(id, { sno, studentName, studentClass })
            .then((data) =>
                data ?
                res.send(data) :
                res.status(404).send({ message: `无法更新id为${id}的对象` })
            )
            .catch((err) => res.status(500).send(err))
    },
    updatePassword: async(req, res) => {
        const id = req.params.id
        const { password } = req.body
        const pass = await config.getEncryptedPassword(password)
        Student.findOneAndUpdate({ _id: id }, { $set: { password: pass } }, { new: true })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send(err))
    },
    delete: (req, res) => {
        const id = req.params.id
        Student.findByIdAndRemove(id)
            .then((data) =>
                data ?
                res.send(data) :
                res.status(404).send({ message: `无法删除id为${id}的对象` })
            )
            .catch((err) => res.status(500).send(err))
    },
    deleteMany: (req, res) => {
        const { ids } = req.body
        Student.deleteMany({ _id: { $in: ids } })
            .then((data) => {
                console.log(data)
                ScLink.deleteMany({ student: { $in: ids } }).then((data) =>
                    res.send(data)
                )
            })
            .catch((err) => res.status(500).send(err))
    },
    resetPassword: async(req, res) => {
        const id = req.params.id
        const pass = await config.getEncryptedPassword(config.originalPassword)

        Student.findOneAndUpdate({ _id: id }, { $set: { password: pass } }, { new: true })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send(err))
    },
    confirm: async(req, res) => {
        const id = req.params.id
        const { password } = req.body
        const student = await Student.findOne({ _id: id }).select('+password')
        if (await bcrypt.compare(password, student.password)) {
            res.send('success')
        } else {
            res.status(403).send('error')
        }
    },
}