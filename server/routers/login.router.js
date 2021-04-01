module.exports = (app) => {
    const loginController = require('../controllers/login.controller')
    const db = require(`../models/`)
    let router = require('express').Router()
    router.post('/login', loginController.login)
    router.post('/logout', loginController.logout)
    app.use('/', router)
    app.use(
        '/api/:resource',
        require('./tokenAuth').authMiddleware,
        async(req, res, next) => {
            // inflection是一个类似babel的模块，.classify可以将复数单词转为单数
            //详见https://www.helplib.com/GitHub/article_94504
            const modelName = require('inflection').classify(req.params.resource)
                // console.log(modelName)
            req.model = db[`${modelName}`]
                // console.log(req.model)
            next()
        },
        router
    )
}