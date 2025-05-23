const express = require('express');
const router = express.Router();
const trainController = require('../controllers/train.controller');
const apiKeyMiddleware = require('../middleware/adminAuth');

router.post('/', apiKeyMiddleware, trainController.createTrain);
router.get('/availability', trainController.getAvailability);

module.exports = router;
