const bcrypt = require('bcrypt');
const client = require('../config/connection');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleNewUser = async (req, res) => {
  const { email, password, first_name, last_name, phone_number, account_type } =
    req.body;
  if (
    !email ||
    !password ||
    !first_name ||
    !last_name ||
    !phone_number ||
    !account_type
  )
    return res
      .status(400)
      .json({ message: 'Email and password are required.' });
  // // check for duplicate usernames in the db
  // const duplicate = usersDB.users.find((person) => person.username === user);
  // if (duplicate)
  //   return res.status(409).json({ message: 'Account already exists.' }); //Conflict
  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);
    //store the new user
    let insertQuery = `insert into users(email, password, first_name, last_name, phone_number, account_type) 
                       values('${email}', '${hashedPwd}', '${first_name}', '${last_name}', '${phone_number}', '${account_type}')`;

    client.query(insertQuery, (err, result) => {
      if (!err) {
        const accessToken = jwt.sign({}, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '30m',
        });
        res.status(201).json({
          accessToken,
          account: { first_name, last_name, email, phone_number, account_type },
        });
      } else {
        res.status(401).json({ message: 'unable to register user.' });
      }
    });
    // client.end;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
