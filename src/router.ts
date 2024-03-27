/* eslint-disable @typescript-eslint/no-misused-promises */
import { param } from "express-validator";
import { Router } from "express";
import {
	handleNewUser,
	handleSignIn,
	validateEmail,
	validatePhoneNumber,
	handleNewRestaurantUser,
	updateUser,
	getUser,
} from "~/controllers/user";
import {
	getRestaurantById,
	handleNewRestaurant,
	updateRestaurant,
	deleteRestaurant,
	getRestaurants,
	handleSaveRestaurant,
	handleRemoveSavedRestaurant,
	getSavedRestaurant,
} from "~/controllers/restaurant";
import {
	handleNewReservation,
	getReservations,
	updateReservation,
	deleteReservation,
	getReservationsHistory,
	getReservationForRestaurant,
	deleteReservationForRestaurant,
	updateReservationForRestaurant,
} from "~/controllers/reservation";
import { handleInputErrors } from "~/modules/middleware";
import {
	validateRegisterUserInputs,
	validateSignInInputs,
	validateRestaurantInputs,
	validateCreateReservationInputs,
} from "~/modules/validate-inputs";
import { protectRoute } from "~/modules/auth";

const router = Router();

// Restaurant
router.post("/restaurant", protectRoute, validateRestaurantInputs, handleNewRestaurant);
router.get("/search/restaurant/:id", getRestaurantById);
router.get("/restaurants/:pageCount*?:name*?", getRestaurants);
router.put("/restaurant/:accountId/update/:restaurantId", protectRoute, updateRestaurant);
router.delete("/restaurant/:accountId/delete/:restaurantId", protectRoute, deleteRestaurant);
router.post("/save/:accountId/restaurant/:restaurantId", protectRoute, handleSaveRestaurant);
router.delete("/delete/:accountId/restaurant/:restaurantId", protectRoute, handleRemoveSavedRestaurant);
router.get("/saved-restaurants/:accountId", protectRoute, getSavedRestaurant);

// Reservation
router.post("/reservation", protectRoute, validateCreateReservationInputs, handleInputErrors, handleNewReservation);
router.get("/reservations/:accountId", protectRoute, getReservations);
router.get("/reservations/history/:accountId", protectRoute, getReservationsHistory);
router.put("/reservation/:accountId/update/:reservationId", protectRoute, updateReservation);
router.delete("/reservation/:accountId/delete/:reservationId", protectRoute, deleteReservation);
router.get(
	"/reservations/:accountId/restaurant/:restaurantId/:reservationDate*?",
	protectRoute,
	getReservationForRestaurant,
);
router.put("/reservation/:reservationId/restaurant/:restaurantId", protectRoute, updateReservationForRestaurant);
router.delete("/reservation/:reservationId/restaurant/:restaurantId", protectRoute, deleteReservationForRestaurant);

// User
router.post(
	"/restaurant/register",
	validateRegisterUserInputs,
	validateRestaurantInputs,
	handleInputErrors,
	handleNewRestaurantUser,
);
router.post("/register", validateRegisterUserInputs, handleInputErrors, handleNewUser);
router.post("/login", validateSignInInputs, handleInputErrors, handleSignIn);
router.get("/account/:accountId", protectRoute, getUser);
router.put("/account/:accountId/update", protectRoute, updateUser);
router.get("/validate/email/:email", param("email").isEmail(), handleInputErrors, validateEmail);
router.get(
	"/validate/phoneNumber/:phoneNumber",
	param("phoneNumber").not().isEmpty().trim().escape(),
	handleInputErrors,
	validatePhoneNumber,
);

export default router;
