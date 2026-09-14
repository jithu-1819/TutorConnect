const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getBookingById, updateBookingStatus, updateMeetingLink } = require('../controllers/bookingController');
const { createBookingValidation, updateBookingStatusValidation } = require('../validators/bookingValidators');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

// All booking routes require auth
router.use(auth);

router.post('/', authorize('student'), createBookingValidation, validate, createBooking);
router.get('/me', getMyBookings);
router.get('/:id', getBookingById);
router.put('/:id/status', updateBookingStatusValidation, validate, updateBookingStatus);
router.put('/:id/meeting-link', authorize('tutor'), updateMeetingLink);

module.exports = router;
