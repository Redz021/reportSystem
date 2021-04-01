const config = require('../config')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.set('useFindAndModify', false)

const db = {
    mongoose,
    url: config.url,
    Student: require('./student.model')(mongoose),
    Course: require('./course.model')(mongoose),
    Teacher: require('./teacher.model')(mongoose),
    ScLink: require('./scLink.model')(mongoose),
}

module.exports = db