const { Teacher } = require('../models')

module.exports = {
    create: (req, res) => {
        if (!req.body) {
            return res.status(400).send({ message: '内容不能为空' })
        }
        const { tno, teacherName, password } = req.body
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
        const { tno, teacherName, password } = req.body
        Teacher.findByIdAndUpdate(id, { tno, teacherName, password }, { new: true })
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
}