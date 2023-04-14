const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
    roomName: {
        type: String
    },
    status: {
        type: Number
    },
    doctorId: {
        type: mongoose.Types.ObjectId,
        ref: 'Doctor'
    },
},
    {
        timestamps: true
    })

module.exports = mongoose.model('Video', videoSchema);