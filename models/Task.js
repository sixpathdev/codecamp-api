const mongoose = require("mongoose")

const TaskSchema = mongoose.Schema({
    taskname: {
        type: String,
        required: true,
    },
    timeframe: {
        type: Number,
        required: true
    },
    due: {
        type: Boolean,
        default: false
    },
    ongoing: {
        type: Boolean,
        default: false
    },
    completed: {
        type: Boolean,
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
