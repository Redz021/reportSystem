const { Report } = require('../models')

module.exports = {
    create: (req, res) => {
        let { task, course, student, content, submit, isSubmitted } = req.body
        submit = new Date(submit)

        new Report({ task, course, student, content, submit, isSubmitted })
            .save()
            .then((data) => res.send(data))
            .catch((err) => {
                console.log(err)
                return res.status(500).send(err)
            })
    },
    findByTask: (req, res) => {
        let task = req.params.task

        Report.find({ task })
            .populate({ path: 'student' })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send(err))
    },
    findByStudentAndCourse: (req, res) => {
        let { student, course } = req.query

        Report.findOne({ student, course })
            .populate({ path: 'task' })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send(err))
    },
    findById: (req, res) => {
        let id = req.params.id
        Report.findById(id)
            .populate({ path: 'task' })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send(err))
    },
    modifyContent: (req, res) => {
        const id = req.params.id
        const { content } = req.body
        Report.findOneAndUpdate({ _id: id }, { $set: { content } }, { new: true })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send(err))
    },
    submit: (req, res) => {
        const id = req.params.id

        Report.findOneAndUpdate({ _id: id }, { $set: { isSubmitted: true } }, { new: true })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send(err))
    },
}