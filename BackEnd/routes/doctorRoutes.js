const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Doctor = require('../Models/doctorModel');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const protect = require('../MiddeleWare/authMiddeleware');
const parser = require('../MiddeleWare/fileUpload');
const { single } = require('../MiddeleWare/fileUpload');


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' })
}

//Login
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please add all details.');
    }

    const doctor = await Doctor.findOne({ email });
    if (doctor && await bcrypt.compare(password, doctor.password)) {
        const data = {
            name: doctor.name,
            email: doctor.email,
            phoneno: doctor.phoneno,
            _id: doctor._id,
            token: generateToken(doctor.id)
        }
        res.status(200).json({ status: "200", data });
    }
    else {
        res.status(400);
        throw new Error('Invalid Credentials!');
    }
})
)

//Register Doctor
router.post('/register', (async (req, res) => {
    const { name, email, phoneno, gender, dob, password, file, cloud_id } = req.body;
    // console.log(req.body)
    // const name=JSON.parse(JSON.stringify( req.body.name));
    // const email=JSON.parse(JSON.stringify( req.body.email));
    // const phoneno=JSON.parse(JSON.stringify( req.body.phoneno));
    // const gender=JSON.parse(JSON.stringify( req.body.gender));
    // const dob=JSON.parse(JSON.stringify( req.body.dob));
    // const password=JSON.parse(JSON.stringify( req.body.password));

    console.log(name)
    const doctorExist = await Doctor.findOne({ email });
    if (doctorExist) {
        res.status(400);
        throw new Error('Doctor already Exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpwd = await bcrypt.hash(password, salt);

    const doctor = await Doctor.create({
        name,
        email,
        phoneno,
        gender,
        dob,
        file,
        cloud_id,
        password: hashedpwd,
        education: [],
        experience: [],
        awards: [],
        biography: "",
        contact: {
            address: "",
            city: "",
            state: "",
            country: "",
        },
        service: {
            service: "",
            spec: ""
        },

    });

    if (doctor) {
        res.status(201).json({
            id: doctor.id,
            name: doctor.name,
            token: generateToken(doctor.id),
            file: doctor.file
        })
    }
    else {
        res.status(400);
        throw new Error('Invalid data');
    }
})
)

router.get('/getDoctor/:id', protect, asyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id).select('-password');

    if (doctor) {
        res.status(200);
        res.json(doctor);
    }
    else {
        res.status(400);
        throw new Error('Data not available.');
    }
})
)

router.get('/getAllDoctors', asyncHandler(async (req, res) => {
    const doctor = await Doctor.find({}).select('-password');

    res.status(200);
    res.json({ data: doctor });
})
)

router.put('/updateDoctor/:id', asyncHandler(async (req, res) => {
    const { name, email, phoneno, gender, dob, education, experience, awards, service, contact, biography } = req.body;

    const result = await Doctor.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            name: name,
            email: email,
            phoneno: phoneno,
            gender: gender,
            dob: dob,
            education: education,
            experience: experience,
            awards: awards,
            service: service,
            contact: contact,
            biography: biography,
        }
    }, {
        useFindAndModify: false,
    });

    res.status(200);
    res.json(result);
})
)

router.delete('/deleteDoctor/:id', protect, asyncHandler(async (req, res) => {

    await Doctor.findOneAndRemove({ _id: req.params.id })
    res.status(200);
    res.json({
        message: 'sucess'
    });
})
)

router.post('/upload', parser.single('file'), (req, res) => {
    const data = {
        file: req.file.path,
        cloud_id: req.file.filename,
    };
    res.status(201).json(data);
})

module.exports = router;