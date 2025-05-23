const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware.verifyToken, bookingController.bookSeat);
router.get('/:id', authMiddleware.verifyToken, bookingController.getBooking);

module.exports = router;