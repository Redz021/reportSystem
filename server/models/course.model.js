module.exports = (mongoose) => {
    let schema = mongoose.Schema({
        cno: {
            type: String,
            require: true,
        }, //课程号
        courseName: String, //课程名
        year: String, //开课学年
        teacher: [{
            type: mongoose.Schema.ObjectId,
            ref: 'teacher',
            require: true,
        }, ], //授课教师
    })
    schema.index({ cno: 1 }, { unique: true }) //为课程号创建索引
    schema.method('toJSON', function() {
        const { __v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    })
    const Course = mongoose.model('course', schema)
    return Course
}