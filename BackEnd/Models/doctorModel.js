const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add Name']
    },
    email: {
        type: String,
        required: [true, 'Please add Email'],
        unique: true
    },
    phoneno: {
        type: String,
        required: [true, 'Please add Phone No.']
    },
    gender: {
        type: String,
        required: [true, 'Please Select Gender']
    },
    dob: {
        type: String,
        required: [true, 'Please enter Berth Date']
    },
    file: {
        type: String,
        required: true
    },
    cloud_id: {
        type: String
    },
    education: {
        degree: { type: String },
        institute: { type: String },
        year: { type: String },
    },
    experience: {
        hospital: { type: String },
        from: { type: String },
        to: { type: String },
    },
    awards: {
        awardname: { type: String },
        awardyear: { type: String },
        awarddesc: { type: String },
    },
    biography: { type: String },
    contact: {
        city: { type: String },
        country: { type: String },
        address: { type: String },
        state: { type: String }
    },
    service: {
        service: { type: String },
        spec: { type: String },
    },
    password: {
        type: String,
        required: [true, 'Please add Password']
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model('Doctor', doctorSchema);