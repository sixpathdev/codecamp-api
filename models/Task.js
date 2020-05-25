const mongoose = require("mongoose")

const TaskSchema = mongoose.Schema({
    taskname: {
        type: String,
        required: true,
    },
    timeframe: {
        type: String,
        required: true
    },
    due: {
        type: Boolean,
        required: true,
        default: false
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    createdby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdon: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Task", TaskSchema)
