const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
    // firstName: {
    //     type: String,
    //     lowercase: true,
    //     required: true
    // },
    // lastName: {
    //     type: String,
    //     lowercase: true,
    //     required: true
    // },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        min: 10
    },
    gender: {
        type: String,
        enum: ["male", "female"]
    },
    createdon: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("User", UserSchema)
