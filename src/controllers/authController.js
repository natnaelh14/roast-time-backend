// const usersDB = {
//   users: require('../models/users.json'),
//   setUsers: function (data) {
//     this.users = data;
//   },
// };
const bcrypt = require('bcrypt');
const client = require('../config/connection');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// const fsPromises = require('fs').promises;
// const path = require('path');

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: 'Username and password are required.' });
  client.query(
    `Select * from users where username='${username}'`,
    async (err, result) => {
      if (!err) {
        console.log(result.rows);
        // Evaluate password
        await bcrypt.compare(
          password,
          result?.rows[0]?.password,
          function (err, match) {
            if (err) {
              res.status(401).json({
                message: 'Incorrect username or password. please try again',
              });
            } else {
              // Create JWTs (The first thing you pass is the payload.)
              const accessToken = jwt.sign(
                { username: result?.rows[0]?.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30m' }
              );
              // const refreshToken = jwt.sign(
              //   { username: foundUser.username },
              //   process.env.REFRESH_TOKEN_SECRET,
              //   { expiresIn: '1d' }
              // );
              // // Saving refreshToken with current user
              // const otherUsers = usersDB.users.filter(
              //   (person) => person.username !== foundUser.username
              // );
              // const currentUser = { ...foundUser, refreshToken };
              // usersDB.setUsers([...otherUsers, currentUser]);
              // await fsPromises.writeFile(
              //   path.join(__dirname, '..', 'models', 'users.json'),
              //   JSON.stringify(usersDB.users)
              // );
              // res.cookie('jwt', refreshToken, {
              //   httpOnly: true, //httponly is not available to JavaScript.
              //   sameSite: 'None',
              //   secure: true,
              //   maxAge: 24 * 60 * 60 * 1000, //You are setting it for one day.
              // });
              res.json({ accessToken });
            }
          }
        );
        // if (match) {
        // } else {
        //   res.status(401);
        //   res.json({
        //     message: 'Incorrect username or password. please try again',
        //   });
        // }
      } else {
        res.status(401);
        res.json({
          message: 'Incorrect username or password. please try again',
        });
      }
    }
  );
  client.end;
};

module.exports = { handleLogin };
