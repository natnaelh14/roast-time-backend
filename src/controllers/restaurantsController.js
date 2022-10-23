const client = require('../config/connection');
require('dotenv').config();

const handleGetAllRestaurants = async (req, res) => {
  await client.query(
    'SELECT * FROM restaurants ORDER BY id ASC',
    (error, results) => {
      if (error) {
        res.status(401);
        res.json(error.message);
      }
      res.status(200).json(results.rows);
    }
  );
};

module.exports = { handleGetAllRestaurants };
