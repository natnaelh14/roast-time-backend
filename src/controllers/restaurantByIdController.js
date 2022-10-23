const client = require('../config/connection');
require('dotenv').config();

const handleRestaurantById = async (req, res) => {
  const id = req.params.id;
  console.log('TWO', id);
  client.query(
    'SELECT * FROM restaurants WHERE id = $1',
    [id],
    (error, results) => {
      if (error) {
        res.status(401);
        res.json(error.message);
      }
      res.status(200).json(results);
    }
  );
};

module.exports = { handleRestaurantById };
