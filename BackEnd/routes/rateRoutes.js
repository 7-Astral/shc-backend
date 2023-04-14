const express = require('express');

const rateController = require('./rate-controllers');

const router = express.Router();
router.get('/:rid', rateController.getreviewByDoctorId);
router.post(
    '/createRate',
    rateController.createRate
  );
module.exports = router; 


 