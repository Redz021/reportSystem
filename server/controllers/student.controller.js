const { Student, ScLink } = require('../models')

module.exports = {
    create: (req, res) => {
        const { sno, studentName, studentClass, password } = req.body
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
        const { sno, studentName, studentClass, password } = req.body
        Student.findByIdAndUpdate(id, { sno, studentName, studentClass, password })
            .then((data) =>
                data ?
                res.send(data) :
                res.status(404).send({ message: `无法更新id为${id}的对象` })
            )
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
            .catch((err) => res.status(500).senda(err))
    },
}