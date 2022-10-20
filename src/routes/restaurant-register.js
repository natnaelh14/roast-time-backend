const express = require('express');
const router = express.Router();
const restaurantRegisterController = require('../controllers/restaurantRegisterController');

router.post('/', restaurantRegisterController.handleNewRestaurantUser);

module.exports = router;
