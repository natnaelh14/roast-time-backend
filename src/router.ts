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
  handleSaveRestaurant,
} from './controllers/restaurant';
import {
  handleNewReservation,
  getReservations,
  updateReservation,
  deleteReservation,
  getReservationsHistory,
} from './controllers/reservation';
import { handleInputErrors } from './modules/middleware';
import {
  validateRegisterUserInputs,
  validateSignInInputs,
  validateRestaurantInputs,
  validateCreateReservationInputs,
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
router.get('/restaurants/:pageCount*?:name*?', getRestaurants);
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
router.post(
  '/restaurant/:accountId/save/:restaurantId',
  protectRoute,
  handleSaveRestaurant,
);

// Reservation
router.post(
  '/reservation',
  protectRoute,
  validateCreateReservationInputs,
  handleInputErrors,
  handleNewReservation,
);
router.get('/reservations/:accountId', protectRoute, getReservations);
router.get(
  '/reservations/history/:accountId',
  protectRoute,
  getReservationsHistory,
);
router.put(
  '/reservation/:accountId/update/:reservationId',
  protectRoute,
  updateReservation,
);
router.delete(
  '/reservation/:accountId/delete/:reservationId',
  protectRoute,
  deleteReservation,
);

// User
router.post(
  '/restaurant/register',
  validateRegisterUserInputs,
  validateRestaurantInputs,
  handleInputErrors,
  handleNewRestaurantUser,
);
router.post(
  '/register',
  validateRegisterUserInputs,
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
