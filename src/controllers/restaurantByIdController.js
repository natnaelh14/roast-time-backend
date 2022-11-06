const client = require('../config/connection');
require('dotenv').config();

const handleRestaurantById = async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || !id) {
    res.status(404).json({ message: 'The restaurant id is incorrect.' });
  }
  await client.query(
    'SELECT * FROM restaurants WHERE id = $1',
    [id],
    (error, results) => {
      if (error) {
        res.status(401);
        res.json(error.message);
      }
      res.status(200).json(results?.rows[0]);
    }
  );
};

module.exports = { handleRestaurantById };
