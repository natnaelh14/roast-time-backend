const express = require('express');
const router = express.Router();
const restaurantByIdController = require('../controllers/restaurantByIdController');

router.get('/', restaurantByIdController.handleRestaurantById);

module.exports = router;
