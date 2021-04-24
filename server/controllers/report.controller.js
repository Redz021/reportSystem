const { Report } = require('../models')

module.exports = {
    create: (req, res) => {
        let { task, course, student, content, submit, isSubmitted } = req.body
        submit = new Date(submit)

        new Report({ task, course, student, content, submit, isSubmitted })
            .save()
            .then((data) => res.send({ message: 'success', data }))
            .catch((err) => res.status(500).send({ message: 'error', err }))
    },
    findByTask: (req, res) => {
        let task = req.params.task

        Report.find({ task })
            .populate({ path: 'student' })
            .then((data) => res.send({ message: 'success', data }))
            .catch((err) => res.status(500).send({ message: 'error', err }))
    },
    findByStudentAndCourse: (req, res) => {
        let { student, course } = req.query

        Report.findOne({ student, course })
            .populate({ path: 'task' })
            .then((data) => res.send({ message: 'success', data }))
            .catch((err) => res.status(500).send({ message: 'error', err }))
    },
}