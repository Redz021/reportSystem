const { TaskOption } = require('../models')

module.exports = {
    create: (req, res) => {
        if (!req.body) {
            res.status(400).send({ msg: '内容不能为空' })
            return
        }
        let { course, format, released, deadline } = req.body
        released = new Date()
        deadline = new Date(parseInt(deadline))
            // console.log({ course, format, released, deadline })
        new TaskOption({ course, format, released, deadline })
            .save()
            .then((data) => res.send(data))
            .catch((err) => res.send(err))
            // res.send({ message: 'success' })
    },
    findByCourse: (req, res) => {
        const course = req.query.course
        console.log(course)
        TaskOption.find({ course })
            .then((data) => res.send({ message: 'success', data }))
            .catch((err) => res.send({ message: 'error', err }))
    },
}