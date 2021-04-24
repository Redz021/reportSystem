const config = require('../config')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const db = {
    mongoose,
    url: config.url,
    Student: require('./student.model')(mongoose),
    Course: require('./course.model')(mongoose),
    Teacher: require('./teacher.model')(mongoose),
    ScLink: require('./scLink.model')(mongoose),
    Task: require('./task.model')(mongoose),
    Report: require('./report.model')(mongoose),
}

module.exports = db