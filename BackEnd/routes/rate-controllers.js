const Rate = require('../Models/rate');
const getreviewByDoctorId = async (req, res) => {
  const rId = req.params.rid;
  let rate;
  try {
    rate = await Rate.find({ doctors: rId }).populate('users','name');
  } catch (err) {
    const error = new HttpError(
      '.',
      500
    );
    throw new Error('Something went wrong, could not find a Rate');
  }

  if (!rate) {
    throw new Error('Something went wrong, could not find a Rate');
  }
  res.json(rate);
};

const createRate = async (req, res) => {

  const { rate, review, users, doctors } = req.body;
  if (!users || !doctors) {
    res.status(400);
    throw new Error('Please add all details.');
  }
  console.log("HRY")
  const createdRate = new Rate({
    review,
    rate,
    users,
    doctors
  });
  try {
    await createdRate.save();
  }
  catch (err) {
    throw new Error('Something went wrong, could not find a Rate2');
  }

  res.status(201).json({ rate: createdRate });
};


exports.getreviewByDoctorId = getreviewByDoctorId;
exports.createRate = createRate;
