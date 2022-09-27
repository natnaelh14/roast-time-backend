require('dotenv').config();
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.PORT || 3500;
const credentials = require('./middleware/credentials');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT');
const errorHandler = require('./middleware/errorHandler');
const client = require('./config/connection');

// custom middleware logger
// app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

//It lets the app use json form the body of the request.
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   //It will Bearer {{token}}
//   const token = authHeader && authHeader.split(' ')[1]; //If there is not token, it will be undefined.
//   if (token == null) return res.sendStatus(401);
//   jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };

// app.use(verifyJWT);

// routes
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/post', require('./routes/post'));

// app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

client.connect();
