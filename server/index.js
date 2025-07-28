// imports for request handling, token handling, and encryption.
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cookieParser());

// Index.js: Where most of our logic is stored, routing for calls to the backend

// allow frontend to access the backend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// 🧠 In-memory "database"; an array of users and their contacts. temporarily holds only a test email.
const users = [
  {
    email: "test@example.com",
    password: bcrypt.hashSync("letmein", 7), // hashed password
    contacts: [
     
    ]
  }
];

const SECRET = 'super_secret_key'; // authorization key

// Middleware: protect private routes
function authMiddleware(req, res, next) {
  const token = req.cookies.token; // request the cookie that holds the token
  if (!token) return res.status(401).send("Unauthorized"); // should there be no token, output a console msg.

  try {
    req.user = jwt.verify(token, SECRET); // decode email from token
    next();
  } catch (err) {
    res.status(401).send("Invalid token");
  }
}

// 🔐 Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body; // request for the email and password.
  const user = users.find(u => u.email === email); // loop through and find a corresponding email
  if (!user || !bcrypt.compareSync(password, user.password)) { // test password.
    return res.status(401).send("Invalid credentials"); // failed login
  }

  const token = jwt.sign({ email }, SECRET); // create a token on successful login
  res.cookie('token', token, { httpOnly: true }).send(); // secure session
});

// Logout logic
app.post('/api/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true }); //delete token on log out
  res.sendStatus(200); // confirm success
});


// 🔎 Who is logged in?
app.get('/api/me', authMiddleware, (req, res) => {
  const user = users.find(u => u.email === req.user.email); //loop through, find the logged in user
  res.json({ email: user.email }); // establish the user's email as the current user.
});

// 📥 Get user's contacts
app.get('/api/contacts', authMiddleware, (req, res) => {
  const user = users.find(u => u.email === req.user.email); // find the user
  res.json(user.contacts); // set the user's contacts as pulled from the "database"
});

// ➕ Save new contact
app.post('/api/contacts', authMiddleware, (req, res) => {
  const user = users.find(u => u.email === req.user.email); // find user (to add contact)

  // ✅ Normalize incoming phone number
  const newPhone = req.body.phone.trim().replace(/[\s\-()]/g, ''); // removes hyphens and spaces.

  // ✅ Validate inputs again
  if (!req.body.name.trim() || !newPhone) {
    return res.status(400).send("Both name and phone are required."); // confirm fields are not empty
  }

  // ✅ Normalize and check existing phones
  const duplicate = user.contacts.some(
    c => c.phone?.trim().replace(/[\s\-()]/g, '') === newPhone // check the entered number to all existing numbers.
  );

  //console.log("Raw phone from client:", req.body.phone);
  //console.log("Normalized phone:", req.body.phone.trim().replace(/[\s\-()]/g, ''));

  //console.log("Existing phones:");
  //user.contacts.forEach(c => {
    //console.log("-", c.phone, "→", c.phone.trim().replace(/[\s\-()]/g, ''));
  //});


  if (duplicate) { // handle duplicate logic
    return res.status(401).send("You already have this number in your phonebook.");
  }

  // ✅ Add new contact
  const contact = {
    id: Date.now(),
    name: req.body.name.trim(),
    phone: req.body.phone.trim() // store as typed
  };

  user.contacts.push(contact); // push to the "top" of the array
  res.status(201).json(contact);
});


/*
app.post('/api/contacts', authMiddleware, (req, res) => {
  const user = users.find(u => u.email === req.user.email);
  const contact = { id: Date.now(), ...req.body };
  user.contacts.push(contact);
  res.status(201).json(contact);
});
*/




if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// 🧿 Start the server
app.listen(3001, () => console.log('Server running on http://localhost:3001'));
