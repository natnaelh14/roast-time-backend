const bcrypt = require('bcrypt');
const client = require('../config/connection');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: 'Email and password are required.' });
  await client.query(
    `SELECT * FROM users WHERE email='${email}'`,
    async (err, { rows }) => {
      if (!err) {
        // Evaluate password
        await bcrypt.compare(
          password,
          rows[0]?.password,
          async function (err, match) {
            if (err) {
              res.status(401).json({
                message: 'Incorrect email or password. please try again',
              });
            } else {
              // Create JWTs (The first thing you pass is the payload.)
              const accessToken = jwt.sign(
                {},
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
              let userResponse = {
                accessToken,
                account: {
                  id: rows[0].id,
                  first_name: rows[0].first_name,
                  last_name: rows[0].last_name,
                  email: rows[0].email,
                  phone_number: rows[0].phone_number,
                  account_type: rows[0].account_type,
                },
              };
              if (rows[0].account_type === 'restaurant') {
                await client.query(
                  'SELECT * FROM restaurants WHERE id = $1',
                  [rows[0].restaurant_id],
                  (error, results) => {
                    if (error) {
                      res.status(401).json({
                        message: error.message,
                      });
                    }
                    res
                      .status(201)
                      .json({ ...userResponse, restaurant: results.rows[0] });
                  }
                );
              } else {
                res.status(201).json(userResponse);
              }
            }
          }
        );
      } else {
        res.status(401);
        res.json({
          message: 'Incorrect username or password. please try again',
        });
      }
    }
    // client.end()
  );
};

module.exports = { handleLogin };
