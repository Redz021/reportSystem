module.exports = (mongoose) => {
    let schema = mongoose.Schema({
        task: { type: mongoose.Schema.ObjectId, ref: 'task', require: true },
        course: { type: mongoose.Schema.ObjectId, ref: 'course', require: true },
        student: { type: mongoose.Schema.ObjectId, ref: 'student', require: true },
        content: String,
        submit: Date,
        isSubmitted: Boolean,
    })
    schema.method('toJSON', function() {
        const { __v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    })

    const Report = mongoose.model('report', schema)
    return Report
}