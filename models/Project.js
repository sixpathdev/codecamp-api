const mongoose = require("mongoose")

const ProjectSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    ui: {
        type: String,
        required: true
    },
    githublink: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true,
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

module.exports = mongoose.model("Project", ProjectSchema)
