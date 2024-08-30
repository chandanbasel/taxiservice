const bcrypt = require('bcryptjs');

const password = 'bhumika81458'; // Replace with your actual password
const hashedPassword = bcrypt.hashSync(password, 10);

console.log('Hashed Password:', hashedPassword);
