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
    //Encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10);
    //Store the new user
    let insertQuery = `INSERT INTO users(email, password, first_name, last_name, phone_number, account_type) VALUES ('${email}', '${hashedPwd}', '${first_name}', '${last_name}', '${phone_number}', '${account_type}') RETURNING *`;

    client.query(insertQuery, (err, { rows }) => {
      if (!err) {
        const accessToken = jwt.sign({}, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '30m',
        });
        res.status(201).json({
          accessToken,
          account: {
            id: rows[0]?.id,
            first_name: rows[0]?.first_name,
            last_name: rows[0]?.last_name,
            email: rows[0]?.email,
            phone_number: rows[0]?.phone_number,
            account_type: rows[0]?.account_type,
          },
        });
      } else {
        res.status(401).json({ message: err.message });
      }
    });
    // client.end;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
