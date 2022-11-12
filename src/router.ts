import { Router } from 'express';
import {
  handleNewUser,
  handleSignIn,
  validateEmail,
  validatePhoneNumber,
  handleNewRestaurantUser,
} from './handlers/user';
import {
  handleGetAllRestaurants,
  handleGetRestaurant,
  handleNewRestaurant,
  handleUpdateRestaurant,
  handleDeleteRestaurant,
} from './handlers/restaurant';
import { body } from 'express-validator';
import { handleInputErrors } from './modules/middleware';
import {
  validateRegisterInputs,
  validateSignInInputs,
  validateRestaurantInputs,
} from './modules/validate-inputs';
import { protectRoute } from './modules/auth';

const router = Router();

// Restaurant
router.post(
  '/restaurant',
  protectRoute,
  validateRestaurantInputs,
  handleNewRestaurant
);
router.get('/restaurants', handleGetAllRestaurants);
router.get('/restaurant/:id', handleGetRestaurant);
router.put(
  '/restaurant/:accountId/update/:restaurantId',
  protectRoute,
  handleUpdateRestaurant
);
router.delete(
  '/restaurant/:accountId/delete/:restaurantId',
  protectRoute,
  handleDeleteRestaurant
);

// User
router.post(
  '/restaurant/register',
  validateRegisterInputs,
  validateRestaurantInputs,
  handleInputErrors,
  handleNewRestaurantUser
);
router.post(
  '/register',
  validateRegisterInputs,
  handleInputErrors,
  handleNewUser
);
router.post('/login', validateSignInInputs, handleInputErrors, handleSignIn);
router.delete('/logout', () => {});
router.get(
  '/validate/email',
  body('email').isEmail(),
  handleInputErrors,
  validateEmail
);
router.get(
  '/validate/phonenumber',
  body('phoneNumber').not().isEmpty().trim().escape(),
  handleInputErrors,
  validatePhoneNumber
);

export default router;
