module.exports = (mongoose) => {
    let schema = mongoose.Schema({
        course: {
            type: mongoose.Schema.ObjectId,
            ref: 'course',
            require: true,
        },
        format: String, //JSON转String
        released: { type: Date, default: Date.now },
        deadline: Date,
    })
    schema.method('toJSON', function() {
        const { __v, _id, ...object } = this.toObject()
        object.id = _id
        return object
    })
    const TaskOption = mongoose.model('taskOption', schema)
    return TaskOption
}