const db = require('../models')
const Student = db.students

module.exports = {
    create: async(req, res) => {
        if (!req.body) {
            res.status(400).send({ msg: '内容不能为空' })
            return
        }

        const stuData = req.body
            //判空，暂时省略
        const result = await Student.findOne({ sno: stuData.sno })
        if (!result) {
            const student = new Student({
                sno: stuData.sno,
                studentName: stuData.studentName,
                password: stuData.password,
                studentClass: stuData.studentClass,
            })
            student
                .save(student)
                .then((data) => {
                    res.json(data)
                })
                .catch((err) => {
                    res.status(500).json({ msg: '添加失败', err })
                })
        } else {
            res.json({ msg: '用户已存在' })
        }
    },
    findAll: (req, res) => {
        const studentClass = req.query.studentClass
        let condition = studentClass ?
            {
                studentClass: {
                    $regex: new RegExp(studentClass),
                    $options: 'i',
                },
            } :
            {}
        Student.find(condition)
            .then((data) => {
                res.json(data)
            })
            .catch((err) => {
                res.status(500).json({
                    msg: err || '查找失败',
                })
            })
    },
    findOne: (req, res) => {
        const id = req.params.id
        Student.findById(id)
            .then((data) => {
                if (!data) {
                    res.status(404).json({
                        msg: `未找到id为${id}的对象`,
                    })
                } else {
                    res.send(data)
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `查找id为${id}的对象时出现错误:${err}`,
                })
            })
    },
    update: (req, res) => {
        if (!req.body) {
            return res.status(400).json({
                message: '更新的内容不能为空',
            })
        }

        const id = req.params.id
        Student.findByIdAndUpdate(id, req.body, {
                useFindAndModify: false,
            })
            .then((data) => {
                if (!data) {
                    res.status(404).json({
                        message: `无法更新id为${id}的对象`,
                    })
                } else {
                    res.json({
                        message: '更新成功',
                    })
                }
            })
            .catch((err) => {
                res.status(500).json({
                    message: `更新id为${id}的对象时出错:${err}`,
                })
            })
    },
    delete: (req, res) => {
        const id = req.params.id

        Student.findByIdAndRemove(id, {
                useFindAndModify: false,
            })
            .then((data) => {
                if (!data) {
                    res.status(404).send({
                        message: `无法删除id为${id}的对象`,
                    })
                } else {
                    res.send({
                        message: '删除成功',
                    })
                }
            })
            .catch((err) => {
                res.status(500).send({
                    message: `删除id为${id}的对象时出错:${err}`,
                })
            })
    },
}