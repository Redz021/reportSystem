module.exports = (mongoose) => {
    let schema = mongoose.Schema({
        course: {
            type: mongoose.Schema.ObjectId,
            ref: 'course',
            require: true,
        },
        title: String,
        format: String, //JSON转String
        comment: String,
        released: Date,
        deadline: Date,
    })
    schema.index({ course: 1 }, { unique: true })
    schema.method('toJSON', function() {
        const { __v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    })
    const Task = mongoose.model('task', schema)
    return Task
}