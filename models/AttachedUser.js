const mongoose = require("mongoose")

const AttachedUserSchema = mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdon: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("AttachedUser", AttachedUserSchema)
