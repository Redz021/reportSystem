const { mongoose } = require('.')
module.exports = (mongoose) => {
    let schema = mongoose.Schema({
        sno: {
            type: String,
            require: true,
        },
        studentName: String,
        password: String,
        studentClass: String,
    }, {
        timestamps: true,
    })
    schema.method('toJSON', function() {
        const { __v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    })
    const Student = mongoose.model('student', schema)
    return Student
}