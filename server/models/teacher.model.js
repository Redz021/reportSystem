module.exports = (mongoose) => {
    let schema = mongoose.Schema({
        tno: {
            type: String,
            require: true,
        },
        teacherName: String,
        password: String,
        _lastlogout: Number,
    }, {
        timestamps: true,
    })
    schema.index({ tno: 1 }, { unique: true })
    schema.method('toJSON', function() {
        const { __v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    })
    const Teacher = mongoose.model('teacher', schema)
    return Teacher
}