const express = require('express');
const router = express.Router();
const restaurantByIdController = require('../controllers/restaurantByIdController');

router.get('/:id', restaurantByIdController.handleRestaurantById);

module.exports = router;
