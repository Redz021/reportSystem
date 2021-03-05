const config = require('../config')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const db = {
    mongoose,
    url: config.url,
    students: require('./student.model')(mongoose),
    courses: require('./course.model')(mongoose),
    teachers: require('./teacher.model')(mongoose),
    scLink: require('./scLink.model')(mongoose),
}

module.exports = db