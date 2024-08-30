const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const driverSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  licenseNumber: {
    type: String,
    required: true,
  },
  // Add other fields if necessary
});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
