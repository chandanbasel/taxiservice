const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const session = require('express-session');

const Employee = require("./model/employee");
const Driver = require("./model/driver");

const db = require('./db');
require ('dotenv').config();

const PORT = process.env.PORT || 3000;

// Session middleware
app.use(session({
  secret: 'your-secret-key', // Replace with a strong secret
  resave: false,
  saveUninitialized: false
}));

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

//  admin credentials
const adminCredentials = {
  username: "admin",
  password: "$2a$10$6/euqARjnl1t6WwTx1Pn8.0CgowZo2OLMKGthERoo/mwDu1bnsWTu" // Hash the password using bcrypt
};

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.redirect('/zmyadmin');
  }
}

// Render login page
app.get('/zmyadmin', (req, res) => {
  res.render('zmyadmin.ejs');  // Create login.ejs form for admin login
});

// Handle login form submission
app.post('/zmyadmin', async (req, res) => {
  const { username, password } = req.body;
  
  if (username === adminCredentials.username && bcrypt.compareSync(password, adminCredentials.password)) {
    req.session.user = username;
    res.redirect('/admin'); // Redirect to admin dashboard after login
  } else {
    res.render('zmyadmin.ejs', { error: 'Invalid username or password' });
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/zmyadmin');
});

app.get("/admin", isAuthenticated, async (req, res) => {
  try {
    const totalDrivers = await Driver.countDocuments();  // Count total drivers
    const employees = await Employee.find();  // Fetch employees if needed
    res.render("admin", { totalDrivers, employees });  // Pass totalDrivers to the view
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("An error occurred while fetching data");
  }
});




// Protect the admin route with authentication
app.get("/admin", isAuthenticated, async (req, res) => {
  try {
    const employees = await Employee.find();
    const drivers = await Driver.find();
    res.render("admin", { employees, drivers });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching data");
  }
});







app.get("/manageDriver", isAuthenticated, async (req, res) => {
  try {
    const drivers = await Driver.find();
    const totalDrivers = await Driver.countDocuments(); // Get the total number of drivers
    res.render("manageDriver", { drivers, totalDrivers });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching data");
  }
});


app.get("/manageemployee", isAuthenticated, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.render("manageemployee", { employees});
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching data");
  }
});









// Protect the home route with authentication
app.get('/submit', isAuthenticated, function (req, res) {
  res.render('submit.ejs');
});

app.get("/submit-driver", isAuthenticated, (req, res) => {
  res.render('drv.ejs');
});

app.post("/submit", isAuthenticated, async (req, res) => {
  try {
    const data = new Employee(req.body);
    await data.save();
    // Redirect back to the form after saving data
    res.redirect('/submit');
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while saving data");
  }
});

app.post("/submit-driver", isAuthenticated, async (req, res) => {
  try {
    const data = new Driver(req.body);
    await data.save();
    res.redirect('/submit-driver');
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while saving driver data");
  }
});

// Employee edit and driver edit routes
app.get('/edit-employee/:id', isAuthenticated, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    res.render('edit-employee.ejs', { employee });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching employee data');
  }
});

app.post('/edit-employee/:id', isAuthenticated, async (req, res) => {
  try {
    await Employee.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while updating employee data');
  }
});

app.get('/edit-driver/:id', isAuthenticated, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    res.render('edit-driver.ejs', { driver });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching driver data');
  }
});

app.post('/edit-driver/:id', isAuthenticated, async (req, res) => {
  try {
    await Driver.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while updating driver data');
  }
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
