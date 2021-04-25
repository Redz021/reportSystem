const { ScLink } = require('../models')

module.exports = {
    create: async(req, res) => {
        if (!req.body) {
            res.status(400).send({ msg: '内容不能为空' })
            return
        }

        const scdata = req.body
        const result = await ScLink.findOne(scdata)
        if (!result) {
            const scLink = new ScLink({
                student: scdata.student,
                course: scdata.course,
            })
            scLink
                .save(scLink)
                .then((data) => {
                    res.send(data)
                })
                .catch((err) => {
                    res.status(500).send({ msg: '添加失败', err })
                })
        } else {
            res.send({ msg: '已存在该学生' })
        }
    },
    getCourses: (req, res) => {
        const student = req.params.sid
        ScLink.find({ student })
            .populate({ path: 'course' })
            .then((data) => {
                if (!data) {
                    res.status(404).send({
                        message: `未找到student为${student}的对象`,
                    })
                } else {
                    let courses = []
                    data.forEach((element) => {
                        courses.push(element['course'])
                    })
                    res.send(course)
                }
            })
            .catch((err) => {
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
        const { course, students } = req.body
        const insertData = []
        students.forEach((element) => {
            insertData.push({ course, student: element })
        })
        ScLink.insertMany(insertData, { ordered: false })
            .then((data) => {
                console.log(data)
            })
            .catch((err) => {
                console.log(err)
            })

        res.send({ msg: 'tested' })
    },
}