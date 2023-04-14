const express = require('express');
const router = express.Router();
//const Slote = require('../Models/slotModel');
const asyncHandler = require('express-async-handler');
const protect = require('../MiddeleWare/authMiddeleware');
var moment = require('moment'); // require
const sgMail = require('@sendgrid/mail')

router.post('/sendMail', asyncHandler(async (req, res) => {
    console.log(req.body)
    sgMail.setApiKey("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");
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
    var code = generateCode(10);
    console.log(code);
    const msg = 
    {
        "from": "patelprince2181@gmail.com",
        "template_id": "d-053c444d91a44d92b28459f4759ca30f",
        "personalizations": [
          {
            "to": [
              {
                "email": "19itubs007@ddu.ac.in"
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
            res.json({ data: "MAil is Send" });
        })
        .catch((error) => {
            console.error(error)
        })

}
));

router.get('/getAllSlots/:id', asyncHandler(async (req, res) => {
    // const slot = await Slote.find({ doctorId: req.params.id });

    // res.status(200);
    // res.json({ data: slot });
})
)



module.exports = router;