const mongoose = require('mongoose');

const slotSchema = mongoose.Schema({
    doctorId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Doctor'
    },
    weekday: {
        type: Number,
    },
    slote: [{
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        },
    }]
},
    {
        timestamps: true
    })

module.exports = mongoose.model('Slot', slotSchema);