const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const xlsx = require('node-xlsx')
const fs = require('fs')
const { Student } = require('../models')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './static/upload')
    },
    filename: (req, file, cb) => {
        let extname = path.extname(file.originalname)
        cb(null, Date.now() + extname)
    },
})
const upload = multer({ storage })

module.exports = (app) => {
    router.post('/students', upload.single('file'), (req, res) => {
        const list = xlsx.parse(req.file.path)[0].data
        let students = []
        let props = list.shift()
        let standard = ['sno', 'studentName', 'studentClass', 'password']
        if (props.length !== standard.length)
            return res.status(400).send({ message: '模板格式错误' })
        for (let item of standard) {
            if (!props.includes(item))
                return res.status(400).send({ message: '模板格式错误' })
        }
        for (let i = 0; i < list.length; i++) {
            let temp = {}
            for (let j = 0; j < props.length; j++) {
                temp[props[j]] = list[i][j]
            }
            students.push(temp)
        }

        Student.insertMany(students, { ordered: false })
            .then((data) => {
                fs.unlinkSync(req.file.path)
                res.send({ message: '创建成功' })
            })
            .catch((err) => {
                res.status(500).send({ message: `创建失败:${err}` })
            })
    })
    app.use('/api/upload', router)
}