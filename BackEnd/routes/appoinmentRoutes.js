const express = require('express');
const router = express.Router();
const Slote = require('../Models/appoinmentModel');
const Slot1 = require('../Models/slotModel');
const sgMail = require('@sendgrid/mail')
const User = require('../Models/userModel');
const asyncHandler = require('express-async-handler');
const protect = require('../MiddeleWare/authMiddeleware');
var moment = require('moment'); // require

router.post('/newSlote', asyncHandler(async (req, res) => {
    const { date, startTime, endTime, doctorId, userId } = req.body;
    const { email } = await User.findById(req.body.userId).select('-password');
    try {
        if (!date || !startTime || !endTime) {
            res.status(400);
            throw new Error('Please add all details.');
        }

        const time = await Slot1.find({ doctorId: doctorId, weekday: new Date(date).getDay() })
        // const doctorId = req.id;
        if (time.length > 0) {
            const timeSlots = time[0].slote
            console.log(time[0].slote)
            const appointments = await Slote.find({});
            function getDailyAppointments(requestedDate) {
                // Filter the appointments array to include only appointments for the requested date
                const dailyAppointments = appointments.filter(appointment => {
                    const appointmentDate = moment(appointment.date, 'YYYY-MM-DD');
                    return appointmentDate.isSame(requestedDate, 'day');
                });

                return dailyAppointments;
            }

            function getAvailableTimeSlots(appointments) {
                // Create a set of all the time slots that are already taken by an appointment
                const takenTimeSlots = new Set(appointments.map(a => a.startTime));
                console.log("sd", takenTimeSlots)
                // Filter the time slots array to remove any taken time slots
                const availableTimeSlots = timeSlots.filter(slot => !takenTimeSlots.has(slot.startTime));
                console.log("SD", availableTimeSlots)
                return availableTimeSlots;
            }



            console.log(appointments)
            const appointments1 = getDailyAppointments(moment(date, 'YYYY-MM-DD'));

            // Get the available time slots for the requested date
            const availableTimeSlots = getAvailableTimeSlots(appointments1);
            const fd = availableTimeSlots.filter((e) => e.startTime === startTime);
            console.log(fd)
            if (fd.length > 0) {

                console.log("s", req.body)
                var code = generateCode(10);
                const slote = await Slote.create({
                    date,
                    startTime,
                    endTime,
                    doctorId,
                    userId,
                    code
                });

                const data1 = {
                    id: slote.id,
                    date: slote.date,
                    startTime: slote.startTime,
                    endTime: slote.endTime,
                    doctorId: slote.doctorId
                }

                sgMail.setApiKey("");
                function generateCode(length) {
                    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    var code = '';
                    for (var i = 0; i < length; i++) {
                        var randomIndex = Math.floor(Math.random() * characters.length);
                        code += characters.charAt(randomIndex);
                    }
                    return code;
                }

                // Usage example
                console.log(code);
                const msg =
                {
                    "from": "patelprince2181@gmail.com",
                    "template_id": "d-053c444d91a44d92b28459f4759ca30f",
                    "personalizations": [
                        {
                            "to": [
                                {
                                    "email": email
                                }
                            ],

                        },
                    ],
                    "dynamic_template_data": {
                        "code": code
                    }
                }
                sgMail
                    .send(msg)
                    .then(() => {
                        console.log('Email sent');
                        res.status(200);
                        res.json({ data: "MAil is Send", data1 });
                    })
                    .catch((error) => {
                        console.error(error)
                    })
                // if (slote) {
                //     res.status(201);
                //     res.json({
                //         data
                //     })
                // }
            } else {
                res.status(201);
                res.json({
                    message: "Slot is not Available"
                })
            }
        }
        else {
            res.status(201);
            res.json({
                message: "doctor not have this time slot"
            })
        }
    } catch (err) {
        console.log(err)
    }

})
)


// router.post('/bookSlote', protect, asyncHandler(async (req, res) => {
//     const { date, startTime, endTime, doctorId } = req.body;

//     if (!date || !startTime || !endTime) {
//         res.status(400);
//         throw new Error('Please add all details.');
//     }

//     const result = await Slote.find({
//         date: date,
//         startTime: startTime,
//         endTime: endTime,
//         doctorId: doctorId
//     });

//     var slote = JSON.stringify(result);
//     slote = JSON.parse(slote);
//     console.log(slote);

//     if (slote.userId) {
//         res.status(400);
//         throw new Error('Slote is Already Booked.')
//     } else {
//         // const userId = req.id;
//         // const result = await Slote.findByIdAndUpdate({_id : slote.id} , {
//         //     $set : {
//         //         userId: userId
//         //     }
//         // } , {
//         //     useFindAndModify : false,
//         // });
//         res.status(201);
//         res.json({
//             message: 'Slote Booked Successfully.'
//         })
//     }
// })
// )

router.post('/date', (async (req, res) => {
    const { date, doctorId } = req.body;
    const time = await Slot1.find({ doctorId: doctorId, weekday: new Date(date).getDay() });

    if (time.length > 0) {
        const timeSlots = time[0].slote
        // const timeSlots = [
        //     { start: '09:00', end: '09:30' },
        //     { start: '09:30', end: '10:00' },
        //     { start: '10:00', end: '10:30' },
        //     { start: '10:30', end: '11:00' },
        //     { start: '11:00', end: '11:30' },
        //     { start: '11:30', end: '12:00' },
        //     { start: '13:00', end: '13:30' },
        //     { start: '13:30', end: '14:00' },
        //     { start: '14:00', end: '14:30' },
        //     { start: '14:30', end: '15:00' },
        //     { start: '15:00', end: '15:30' },
        //     { start: '15:30', end: '16:00' },
        // ];

        console.log("req.body", timeSlots)
        try {


            const appointments = await Slote.find({ doctorId: doctorId });
            function getDailyAppointments(requestedDate) {
                // Filter the appointments array to include only appointments for the requested date
                const dailyAppointments = appointments.filter(appointment => {
                    const appointmentDate = moment(appointment.date, 'YYYY-MM-DD');
                    return appointmentDate.isSame(requestedDate, 'day');
                });

                return dailyAppointments;
            }

            function getAvailableTimeSlots(appointments) {
                // Create a set of all the time slots that are already taken by an appointment
                const takenTimeSlots = new Set(appointments.map(a => a.startTime));
                console.log("sd", takenTimeSlots)
                // Filter the time slots array to remove any taken time slots
                const availableTimeSlots = timeSlots.filter(slot => !takenTimeSlots.has(slot.startTime));

                return availableTimeSlots;
            }

            function getNextAvailableTimeSlot(availableTimeSlots) {
                // Sort the available time slots by start time
                console.log(availableTimeSlots)
                if (availableTimeSlots !== undefined && availableTimeSlots.length > 0) {

                    availableTimeSlots.sort((a, b) => {
                        if (a.startTime < b.startTime) return -1;
                        if (a.startTime > b.startTime) return 1;
                        return 0;
                    });
                    return availableTimeSlots[0].startTime
                } else {
                    return "slot is not available"
                }

                // Return the start time of the first time slot

            }


            console.log(appointments)
            const appointments1 = getDailyAppointments(moment(date, 'YYYY-MM-DD'));

            // Get the available time slots for the requested date
            const availableTimeSlots = getAvailableTimeSlots(appointments1);

            // Find the next available time slot
            const nextTime = getNextAvailableTimeSlot(availableTimeSlots);
            res.status(200).json({ status: "200", data: nextTime, available: availableTimeSlots });

            console.log("appoim", appointments1, availableTimeSlots, nextTime)
        } catch (err) {
            console.log(err);
        }
    } else {
        res.status(200).json({ status: "200", data: '', available: [] });

    }
}
)
)


router.post('/apt', async (req, res) => {
    try {
        if (!req.body.doctorId) {
            let apt = await Slote.find({ userId: req.body.userId });
            console.log("DS", apt);
            if (apt !== null) {

                apt = apt.map(e => {
                    return {
                        ...e._doc, date: e.date.slice(0, 10)
                    }
                });
                console.log("e", apt);
                apt = apt.filter(e => e.date === new Date().toISOString().slice(0, 10));
                const currentTime = moment(new Date().toISOString()).format('hh:mm');
                console.log(currentTime, apt)
                apt = apt.filter(e => e.startTime <= currentTime && e.endTime >= currentTime);
                console.log(apt, "dfff")
                if (apt.length === 0) {
                    res.status(201);
                    res.json({
                        data: 0
                    })
                } else {
                    if (apt[0].code === req.body.code) {
                        res.status(201);
                        res.json({
                            data: 1
                        })
                    } else {
                        res.status(201);
                        res.json({
                            data: 0
                        })
                    }
                }
            }
        }
        else {
            let apt = await Slote.find({ doctorId: req.body.doctorId });
            console.log("DS", apt);
            if (apt !== null) {

                apt = apt.map(e => {
                    return {
                        ...e._doc, date: e.date.slice(0, 10)
                    }
                });
                console.log("e", apt);
                apt = apt.filter(e => e.date === new Date().toISOString().slice(0, 10));
                const currentTime = moment(new Date().toISOString()).format('hh:mm');
                console.log(currentTime, apt)
                apt = apt.filter(e => e.startTime <= currentTime && e.endTime >= currentTime);
                console.log(apt, "dfff")
                if (apt.length === 0) {
                    res.status(201);
                    res.json({
                        data: 0
                    })
                } else {
                    if (apt[0].code === req.body.code) {
                        res.status(201);
                        res.json({
                            data: 1
                        })
                    } else {
                        res.status(201);
                        res.json({
                            data: 0
                        })
                    }
                }
            }
        }
    } catch (err) {
        throw new Error('Cant Get APT');
    }
})



module.exports = router;