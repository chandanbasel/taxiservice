const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: String,
  age: Number,
  work: String,
  mobile: String,
  email: String,
  salary: Number
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
