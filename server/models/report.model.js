module.exports = (mongoose) => {
    let schema = mongoose.Schema({
        task: { type: mongoose.Schema.ObjectId, ref: 'task', require: true },
        course: { type: mongoose.Schema.ObjectId, ref: 'course', require: true },
        student: { type: mongoose.Schema.ObjectId, ref: 'student', require: true },
        content: { type: String, default: '{}' },
        score: { type: String, default: '{}' },
        comment: { type: String, default: '{}' },
        submit: { type: Date, default: Date.now },
        submitted: { type: Boolean, default: false },
        evaluated: { type: Boolean, default: false },
        pdf: { type: String, default: '' },
    })
    schema.index({ task: 1, student: 1 }, { unique: true })
    schema.method('toJSON', function() {
        const { __v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    })

    const Report = mongoose.model('report', schema)
    return Report
}