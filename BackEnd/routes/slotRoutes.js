const express = require('express');
const router = express.Router();
const Slote = require('../Models/slotModel');
const asyncHandler = require('express-async-handler');
const protect = require('../MiddeleWare/authMiddeleware');
var moment = require('moment'); // require

router.post('/newSlote', asyncHandler(async (req, res) => {
    const { weekday, startTime, endTime, doctorId } = req.body;

    try {
        if (!startTime || !endTime) {
            res.status(400);
            throw new Error('Please add all details.');
        }


        const slot = await Slote.find({ doctorId: doctorId, weekday: weekday });
        console.log(slot, "Ds")
        if (slot !== null &&slot.length > 0  && slot[0].slote.length > 0) {

            // console.log("s", req.body)
            const ds = slot[0].slote.concat({ startTime: startTime, endTime: endTime })
            const result = await Slote.findByIdAndUpdate({ _id: slot[0]._id }, {
                $set: {
                    slote: ds,
                }
            }, {
                useFindAndModify: false,
            });
            

            res.status(201);
            res.json({
                data:"Slot Created"
            })
        }
        else {
            const slote = await Slote.create({
                weekday,
                doctorId,
                slote: [{ startTime: startTime, endTime: endTime }],
            });
            res.status(201);
            res.json({
                data: slote
            })
        }
    } catch (err) {
        console.log(err)
    }

})
)

router.get('/getAllSlots/:id', asyncHandler(async (req, res) => {
    const slot = await Slote.find({doctorId:req.params.id});

    res.status(200);
    res.json({ data: slot });
})
)



module.exports = router;