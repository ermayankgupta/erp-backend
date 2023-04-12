const express = require('express');
const holidayController = require('../controller/holidayController');
const router = express.Router()

router.route('/').post(holidayController.addHoliday).get(holidayController.getHolidays)

module.exports = router