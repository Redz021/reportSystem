const { mongoose } = require('.')
module.exports = (mongoose) => {
    let schema = mongoose.Schema({
        cno: {
            type: String,
            require: true,
        },
        courseName: String,
        year: String,
        teacher: {
            type: mongoose.Schema.ObjectId,
            ref: 'teacher',
            require: true,
        },
    })
    schema.index({ cno: 1 }, { unique: true })
    schema.method('toJSON', function() {
        const { __v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    })
    const Course = mongoose.model('course', schema)
    return Course
}