const { Schema, model } = require('mongoose');

const schemaa = new Schema({
    studentID: {
        type: String,
        required: true,
    },
    playedAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = model('gameLog',schemaa);