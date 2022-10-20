const bcrypt = require('bcrypt');
const client = require('../config/connection');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleNewRestaurantUser = async (req, res) => {
  const {
    email,
    password,
    first_name,
    last_name,
    phone_number,
    account_type,
    restaurant_name,
    restaurant_street_name,
    restaurant_city,
    restaurant_state,
    restaurant_zip_code,
  } = req.body;
  if (
    !email ||
    !password ||
    !first_name ||
    !last_name ||
    !phone_number ||
    !account_type ||
    !restaurant_name ||
    !restaurant_street_name ||
    !restaurant_city ||
    !restaurant_state ||
    !restaurant_zip_code
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
    let restaurantQuery = `INSERT INTO restaurants(restaurant_name, restaurant_street_name, restaurant_city, restaurant_state, restaurant_zip_code) VALUES('${restaurant_name}', '${restaurant_street_name}', '${restaurant_city}', '${restaurant_state}', '${restaurant_zip_code}')  RETURNING *`;
    //Store restaurant data
    const { rows } = await client.query(restaurantQuery);
    const restaurantData = rows[0];
    //Store user information
    const userQuery = `INSERT INTO users(email, password, first_name, last_name, phone_number, account_type, restaurant_id) VALUES('${email}', '${hashedPwd}', '${first_name}', '${last_name}', '${phone_number}', '${account_type}', '${restaurantData?.id}')  RETURNING *`;
    await client.query(userQuery, (err, result) => {
      if (!err) {
        const accessToken = jwt.sign({}, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '30m',
        });
        res.status(201).json({
          accessToken,
          account: {
            id: result?.rows[0]?.id,
            first_name: result?.rows[0]?.first_name,
            last_name: result?.rows[0]?.last_name,
            email: result?.rows[0]?.email,
            phone_number: result?.rows[0]?.phone_number,
            account_type: result?.rows[0]?.account_type,
          },
          restaurant: {
            id: restaurantData?.id,
            restaurant_name: restaurantData?.restaurant_name,
            restaurant_street_name: restaurantData?.restaurant_street_name,
            restaurant_city: restaurantData?.restaurant_city,
            restaurant_state: restaurantData?.restaurant_state,
            restaurant_zip_code: restaurantData?.restaurant_zip_code,
          },
        });
      } else {
        res.status(401).json({ message: err.message });
      }
    });
    // await client.query(
    //   'SELECT * FROM restaurants WHERE restaurant_name = $1',
    //   [restaurant_name]
    // );
    // client.end;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewRestaurantUser };
