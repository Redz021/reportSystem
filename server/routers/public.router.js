const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (fs.existsSync(`./public/${req.user._id}`)) {
            cb(null, `./public/${req.user._id}`)
        } else {
            fs.mkdirSync(`./public/${req.user._id}`)
            cb(null, `./public/${req.user._id}`)
        }
    },
    filename: (req, file, cb) => {
        let extname = path.extname(file.originalname)
        cb(null, `${Date.now()}${extname}`)
    },
})
const upload = multer({ storage })
module.exports = (app) => {
    router.post('/image', upload.single('image'), (req, res) => {
        res.json({
            // errno 即错误代码，0 表示没有错误。
            //       如果有错误，errno != 0，可通过下文中的监听函数 fail 拿到该错误码进行自定义处理
            errno: 0,

            // data 是一个数组，返回图片Object，Object中包含需要包含url、alt和href三个属性,它们分别代表图片地址、图片文字说明和跳转链接,alt和href属性是可选的，可以不设置或设置为空字符串,需要注意的是url是一定要填的。
            data: [
                `http://localhost:3000/public/${req.user._id}/${req.file.filename}`,
            ],
        })
    })
    router.delete('/image/:file', (req, res) => {
        const file = req.params.file
        fs.unlinkSync(`./public/${req.user._id}/${file}`)
        res.send('success')
    })
    router.post('/pdf', upload.single('pdf'), (req, res) => {
        res.send(
            `http://localhost:3000/public/${req.user._id}/${req.file.filename}`
        )
    })
    router.delete('/pdf/:file', (req, res) => {
        const file = req.params.file
        fs.unlinkSync(`./public/${req.user._id}/${file}`)
        res.send('success')
    })
    app.use('/api/public', router)
    app.use('/public', express.static('./public'))
}