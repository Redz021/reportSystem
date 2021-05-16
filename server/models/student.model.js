const { mongoose } = require('.')
module.exports = (mongoose) => {
    let schema = mongoose.Schema({
        sno: {
            type: String,
            require: true,
        },
        studentName: String,
        password: { type: String, select: false },
        studentClass: String,
        _lastlogout: Number,
    }, {
        timestamps: true,
    })
    schema.index({ sno: 1 }, { unique: true })
    schema.post('findOneAndRemove', function(doc) {
        console.log(doc)
    })
    schema.method('toJSON', function() {
        const { __v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    })
    const Student = mongoose.model('student', schema)
    return Student
}