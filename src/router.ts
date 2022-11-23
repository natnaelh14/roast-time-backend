import {
  handleNewUser,
  handleSignIn,
  validateEmail,
  validatePhoneNumber,
  handleNewRestaurantUser,
  updateUser,
  getUser,
} from './controllers/user';
import {
  getRestaurantById,
  handleNewRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurants,
} from './controllers/restaurant';
import { handleInputErrors } from './modules/middleware';
import {
  validateRegisterInputs,
  validateSignInInputs,
  validateRestaurantInputs,
} from './modules/validate-inputs';
import { protectRoute } from './modules/auth';
import { body } from 'express-validator';
import { Router } from 'express';

const router = Router();

// Restaurant
router.post(
  '/restaurant',
  protectRoute,
  validateRestaurantInputs,
  handleNewRestaurant,
);
router.get('/search/restaurant/:id', getRestaurantById);
router.get('/restaurants/:name*?', getRestaurants);
router.put(
  '/restaurant/:accountId/update/:restaurantId',
  protectRoute,
  updateRestaurant,
);
router.delete(
  '/restaurant/:accountId/delete/:restaurantId',
  protectRoute,
  deleteRestaurant,
);

// User
router.post(
  '/restaurant/register',
  validateRegisterInputs,
  validateRestaurantInputs,
  handleInputErrors,
  handleNewRestaurantUser,
);
router.post(
  '/register',
  validateRegisterInputs,
  handleInputErrors,
  handleNewUser,
);
router.post('/login', validateSignInInputs, handleInputErrors, handleSignIn);
router.get('/account/:accountId', protectRoute, getUser);
router.put('/account/:accountId/update', protectRoute, updateUser);
router.get(
  '/validate/email',
  body('email').isEmail(),
  handleInputErrors,
  validateEmail,
);
router.get(
  '/validate/phonenumber',
  body('phoneNumber').not().isEmpty().trim().escape(),
  handleInputErrors,
  validatePhoneNumber,
);

export default router;
