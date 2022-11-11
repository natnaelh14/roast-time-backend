import { Router } from 'express';
import {
  createNewUser,
  signIn,
  validateEmail,
  validatePhoneNumber,
} from './handlers/user';
import { getAllRestaurants, getRestaurant } from './handlers/restaurant';
import { body } from 'express-validator';
import { handleInputErrors } from './modules/middleware';
import {
  validateRegisterInputs,
  validateSignInInputs,
} from './modules/validate-inputs';

const router = Router();

router.get('/restaurants', getAllRestaurants);
router.get('/restaurant/:id', getRestaurant);

// User
router.post('/restaurant/register', () => {});
router.post(
  '/register',
  validateRegisterInputs,
  handleInputErrors,
  createNewUser
);
router.post('/login', validateSignInInputs, handleInputErrors, signIn);
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
