const router = require('express').Router()
const express = require('express')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public')
    },
    filename: (req, file, cb) => {
        let extname = path.extname(file.originalname)
        cb(null, `${Date.now()}${extname}`)
    },
})
const upload = multer({ storage })
module.exports = (app) => {
    router.post('/image', upload.single('image'), async(req, res) => {
        console.log(req)
        res.json({
            // errno 即错误代码，0 表示没有错误。
            //       如果有错误，errno != 0，可通过下文中的监听函数 fail 拿到该错误码进行自定义处理
            errno: 0,

            // data 是一个数组，返回图片Object，Object中包含需要包含url、alt和href三个属性,它们分别代表图片地址、图片文字说明和跳转链接,alt和href属性是可选的，可以不设置或设置为空字符串,需要注意的是url是一定要填的。
            data: [`http://localhost:3000/public/${req.file.filename}`],
        })
    })
    app.use('/api/public', router)
    app.use('/public', express.static('./public'))
}