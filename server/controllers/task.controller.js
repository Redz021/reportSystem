const { Task } = require('../models')

module.exports = {
    create: (req, res) => {
        if (!req.body) {
            res.status(400).send({ msg: '内容不能为空' })
            return
        }
        let { course, title, format, comment, released, deadline } = req.body
        released = new Date(released)
        deadline = new Date(deadline)
        console.log({ course, title, format, comment, released, deadline })
        new Task({ course, title, format, comment, released, deadline })
            .save()
            .then((data) => res.send({ message: 'success', data }))
            .catch((err) => res.status(500).send({ message: 'error', err }))
    },
    findByCourse: (req, res) => {
        const course = req.query.course
            // console.log(course)
        Task.findOne({ course })
            .then((data) => {
                return res.send({ message: 'success', data })
            })
            .catch((err) => res.status(404).send({ message: 'error', err }))
    },
    update: (req, res) => {
        const id = req.params.id

        let { course, title, format, comment, released, deadline } = req.body
        released = new Date(released)
        deadline = new Date(deadline)

        Task.findOneAndUpdate({ _id: id }, { $set: { course, title, format, comment, released, deadline } }, { new: true })
            .then((data) => res.send({ message: 'success', data }))
            .catch((err) => res.send({ message: 'error', err }))
    },
    deleteById: (req, res) => {
        const id = req.params.id
        Task.findByIdAndRemove(id)
            .then((data) => res.send({ message: 'success', data }))
            .catch((err) => res.send({ message: 'error', err }))
    },
}