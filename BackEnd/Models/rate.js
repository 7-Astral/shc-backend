const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rateSchema = new Schema({
  review: { type: String, required: true },
  rate: { type: Number, required: true, default: 0 },
  users: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }],
  doctors: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Doctor' }],
 
}, {
  timestamps: true
});

module.exports = mongoose.model('Rate', rateSchema);
