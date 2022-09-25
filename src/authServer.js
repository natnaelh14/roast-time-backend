require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

//It lets the app use json form the body of the request.
app.use(express.json());

let refreshTokens = [];

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.SECRET_TOKEN, {
    expiresIn: '30m',
  });
};

app.post('/token', (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.statusCode(401);
  if (!refreshTokens.includes(refreshToken)) return res.statusCode(403);
  jwt.verify(refreshToken, process.env.REFRESH_SECRET_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    //You just need to pass the raw user object.
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken });
  });
});

//Log Out
app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

//Log In
app.post('/login', (req, res) => {
  //Authenticate User

  const username = req.body.username;
  const user = { name: username };
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET_TOKEN);
  refreshTokens.push(refreshToken);
  res.json({ accessToken, refreshToken });
});

app.listen(3003);
