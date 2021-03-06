const mongoose = require("mongoose")

const ProjectStatusSchema = mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    ongoing: {
        type: Boolean,
        default: false
    },
    completed: {
        type: Boolean,
        default: false
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

module.exports = mongoose.model("ProjectStatus", ProjectStatusSchema)
