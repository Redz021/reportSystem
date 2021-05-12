const { ScLink } = require('../models')

module.exports = {
    create: async(req, res) => {
        if (!req.body) {
            res.status(400).send({ msg: '内容不能为空' })
            return
        }

        const { course, student, term } = req.body
        new ScLink({ course, student, term })
            .save()
            .then((data) => res.send(data))
            .catch((err) => {
                console.log(err)
                res.status(500).send(err)
            })
    },
    getCourses: (req, res) => {
        const student = req.params.sid
        ScLink.find({ student })
            .populate({ path: 'course' })
            .then((data) => {
                // if (!data) {
                //     res.status(404).send({
                //         message: `未找到student为${student}的对象`,
                //     })
                // } else {
                //     let courses = []
                //     data.forEach((element) => {
                //         courses.push(element['course'])
                //     })
                //     res.send(courses)
                // }
                res.send(
                    data.map((item) => {
                        return { course: item.course, term: item.term }
                    })
                )
            })
            .catch((err) => {
                console.error(err)
                res.status(500).send({
                    message: `查找student为${student}的对象时出现错误:${err}`,
                })
            })
    },
    getStudents: (req, res) => {
        const course = req.params.cid
        ScLink.find({ course })
            .populate({ path: 'student' })
            .then((data) => {
                if (!data) {
                    res.status(404).send({
                        message: `未找到course为${course}的对象`,
                    })
                } else {
                    let students = []
                    data.forEach((element) => {
                        students.push(element['student'])
                    })
                    res.send(students)
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `查找course为${course}的对象时出现错误:${err}`,
                })
            })
    },
    getStudentsByCourseAndTerm: (req, res) => {
        if (!req.body) {
            res.status(400).send({
                msg: '删除的内容不能为空',
            })
            return
        }
        const course = req.query.course
        const term = req.query.term

        ScLink.find({ course, term })
            .populate({ path: 'student' })
            .then((data) => {
                res.send(data.map((item) => item.student))
            })
            .catch((err) => res.status(500).send(err))
    },
    deleteStudent: (req, res) => {
        if (!req.body) {
            res.status(400).send({
                msg: '删除的内容不能为空',
            })
            return
        }
        if (!req.body.student) {
            res.send({ msg: '学生不能为空' })
            return
        } else if (!req.body.course) {
            res.send({ msg: '课程不能为空' })
            return
        } else {
            ScLink.findOneAndRemove({
                    student: req.body.student,
                    course: req.body.course,
                }, { useFindAndModify: false })
                .then((data) => {
                    if (!data) {
                        res.status(404).send({
                            message: `无法删除对象`,
                        })
                    } else {
                        res.send({
                            message: '删除成功',
                        })
                    }
                })
                .catch((err) => {
                    res.status(500).send({
                        message: `删除对象时出错:${err}`,
                    })
                })
        }
    },
    deleteManyStudents: (req, res) => {
        if (!req.body) {
            res.status(400).send({ msg: '内容不能为空' })
            return
        }
        const { course, students } = req.body
        ScLink.deleteMany({ course, student: { $in: students } })
            .then((data) => res.send({ message: '删除成功' }))
            .catch((err) => res.status(400).send({ message: '删除失败', err }))
    },
    addManyStudents: (req, res) => {
        if (!req.body) {
            res.status(400).send({ msg: '内容不能为空' })
            return
        }
        const { course, students, term } = req.body
        const insertData = []
        students.forEach((element) => {
            insertData.push({ course, student: element, term })
        })
        ScLink.insertMany(insertData, { ordered: false })
            .then((data) => {
                console.log(data)
                res.send(data)
            })
            .catch((err) => {
                console.log(err)
                res.status(500).send(err)
            })
    },
}