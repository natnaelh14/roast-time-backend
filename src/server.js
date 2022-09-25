require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

//It lets the app use json form the body of the request.
app.use(express.json());

const posts = [
  {
    username: 'Bob',
    title: 'Post One',
  },
  {
    username: 'Aaron',
    title: 'Post Two',
  },
];

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  //It will Bearer {{token}}
  const token = authHeader && authHeader.split(' ')[1]; //If there is not token, it will be undefined.
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

app.listen(3002);
