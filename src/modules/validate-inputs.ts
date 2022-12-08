import { body } from 'express-validator';
import { isInt16Array } from 'util/types';

export const validateRegisterUserInputs = [
  body('email').isEmail(),
  body('password')
    .isLength({ min: 10 })
    .withMessage('Password must be at least 10 characters long')
    .matches(/\d/)
    .withMessage('Password must contain a number'),
  body('firstName').not().isEmpty().trim().escape(),
  body('lastName').not().isEmpty().trim().escape(),
  body('phoneNumber').not().isEmpty().trim().escape(),
  body('accountType').isIn(['GUEST', 'RESTAURANT']).isUppercase().optional(),
];

export const validateSignInInputs = [
  body('email').isEmail(),
  body('password')
    .isLength({ min: 10 })
    .withMessage('Password must be at least 10 characters long')
    .matches(/\d/)
    .withMessage('Password must contain a number'),
];

export const validateRestaurantInputs = [
  body('name').not().isEmpty(),
  body('address').not().isEmpty(),
  body('latitude').not().isEmpty(),
  body('longitude').not().isEmpty(),
  body('category').not().isEmpty(),
];

export const validateCreateReservationInputs = [
  body('userId').not().isEmpty(),
  body('restaurantId').not().isEmpty(),
  body('partySize').isInt().not().isEmpty(),
  body('reservationDate').not().isEmpty(),
  body('reservationTime').not().isEmpty(),
];
