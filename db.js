const mongoose = require('mongoose');

// define MongoDB connection URL
const mongoURL = 'mongodb://localhost:27017/employeedata';

// Setup MongoDB connection
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// get the default connection
const db = mongoose.connection;

// define event listeners for database connection
db.on('connected', () => {
    console.log('Connected to MongoDB server');
});

db.on('error', (err) => {
    console.log('MongoDB connection error:', err);
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// export the database connection
module.exports = db;

