module.exports = (mongoose) => {
    let schema = mongoose.Schema({
        student: {
            type: mongoose.Schema.ObjectId,
            ref: 'student',
            require: true,
        },
        course: {
            type: mongoose.Schema.ObjectId,
            ref: 'course',
            require: true,
        },
    })
    schema.method('toJSON', function() {
        const { __v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    })
    const ScLink = mongoose.model('sclink', schema)
    return ScLink
}