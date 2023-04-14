const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name : {
        type: String,
        required: [true, 'Please add Name']
    },
    email : {
        type: String,
        required: [true, 'Please add Email'],
        unique: true
    },
    dob : {
        type : String,
        required: [true, 'Please add Birth Date.']
    },
    phoneno : {
        type: String,
        required: [true, 'Please add Phone No.']
    },
    password : {
        type: String,
        required: [true, 'Please add Password']
    }
},
{ 
    timestamps: true
})

module.exports = mongoose.model('User',userSchema);