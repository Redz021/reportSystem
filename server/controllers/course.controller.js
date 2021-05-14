const { Course } = require('../models')

module.exports = {
    create: async(req, res) => {
        if (!req.body) {
            res.status(400).send({ msg: '内容不能为空' })
            return
        }
        const { cno, courseName, teacher, courseImage } = req.body
        new Course({ cno, courseName, teacher, courseImage })
            .save()
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send(err))
    },
    findAll: (req, res) => {
        const teacher = req.query.teacher

        Course.find(teacher ? { teacher } : {})
            .populate({ path: 'teacher' })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send(err))
    },
    findOne: (req, res) => {
        const id = req.params.id
        Course.findById(id)
            .populate({ path: 'teacher' })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send(err))
    },
    update: (req, res) => {
        if (!req.body) {
            return res.status(400).send({
                message: '更新的内容不能为空',
            })
        }

        const id = req.params.id
        let newData = {
            cno: req.body.cno,
            courseName: req.body.courseName,
            teacher: req.body.teacher,
            courseImage: req.body.courseImage,
        }
        Course.findOneAndUpdate({ _id: id }, { $set: newData }, { new: true })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send(err))
    },
    delete: (req, res) => {
        const id = req.params.id

        Course.findByIdAndRemove(id, {
                useFindAndModify: false,
            })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send(err))
    },
}