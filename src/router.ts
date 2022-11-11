import { Router } from 'express';
import {
  createNewUser,
  signIn,
  validateEmail,
  validatePhoneNumber,
} from './handlers/user';
import { getAllRestaurants, getRestaurant } from './handlers/restaurant';
import { body } from 'express-validator';

const router = Router();

router.get('/restaurants', getAllRestaurants);
router.get('/restaurant/:id', getRestaurant);

// User
router.post('/restaurant/register', () => {});
router.post(
  '/register',
  body('email').isEmail(),
  body('password')
    .isLength({ min: 10 })
    .withMessage('Password must be at least 10 characters long')
    .matches(/\d/)
    .withMessage('Password must contain a number'),
  body('firstName').not().isEmpty().trim().escape(),
  body('lastName').not().isEmpty().trim().escape(),
  body('phoneNumber').not().isEmpty().trim().escape(),
  body('accountType').not().isEmpty().trim().escape(),
  createNewUser
);
router.post(
  '/login',
  body('email').isEmail(),
  body('password')
    .isLength({ min: 10 })
    .withMessage('Password must be at least 10 characters long')
    .matches(/\d/)
    .withMessage('Password must contain a number'),
  signIn
);
router.delete('/logout', () => {});
router.get('/validate/email', body('email').isEmail(), validateEmail);
router.get(
  '/validate/phonenumber',
  body('phoneNumber').not().isEmpty().trim().escape(),
  validatePhoneNumber
);

export default router;
