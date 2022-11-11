import { body } from 'express-validator';

export const validateRegisterInputs = [
  body('email').isEmail(),
  body('password')
    .isLength({ min: 10 })
    .withMessage('Password must be at least 10 characters long')
    .matches(/\d/)
    .withMessage('Password must contain a number'),
  body('firstName').not().isEmpty().trim().escape(),
  body('lastName').not().isEmpty().trim().escape(),
  body('phoneNumber').not().isEmpty().trim().escape(),
  body('accountType').isIn(['GUEST', 'RESTAURANT']).optional(),
];

export const validateSignInInputs = [
  body('email').isEmail(),
  body('password')
    .isLength({ min: 10 })
    .withMessage('Password must be at least 10 characters long')
    .matches(/\d/)
    .withMessage('Password must contain a number'),
];
