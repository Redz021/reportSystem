const { Report } = require('../models')

module.exports = {
    create: (req, res) => {
        let { task, course, student } = req.body

        new Report({ task, course, student })
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
    findByStudentAndTask: (req, res) => {
        const { student, task } = req.query
        Report.findOne({ student, task })
            .populate({ path: 'task' })
            .then((data) => res.send(data))
            .catch((err) => {
                console.log(err)
                res.status(500).send(err)
            })
    },
    findById: (req, res) => {
        let id = req.params.id
        Report.findById(id)
            .populate({ path: 'task' })
            .populate({ path: 'student' })
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
        const submit = Date.now()
        Report.findOneAndUpdate({ _id: id }, { $set: { submitted: true, submit } }, { new: true })
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send(err))
    },
    evaluate: (req, res) => {
        const id = req.params.id
        let { score } = req.body

        Report.findOneAndUpdate({ _id: id }, { $set: { score, evaluated: true } }, { new: true })
            .then((data) => res.send(data))
            .catch((err) => {
                console.log(err)
                res.status(500).send(err)
            })
    },
    upload: (req, res) => {
        const id = req.params.id
        const { pdf } = req.body
        Report.findOneAndUpdate({ _id: id }, { $set: { pdf } }, { new: true })
            .then((data) => res.send(data))
            .catch((err) => {
                console.error(err)
                res.status(500).send(err)
            })
    },
}