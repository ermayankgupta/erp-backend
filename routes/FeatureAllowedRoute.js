const express = require('express');
const router = express.Router()
const featureAllowedController = require('../controller/featureAllowedController');

router.route('/add').post(featureAllowedController.addFeatureAllowedData)
router.get('/',featureAllowedController.getFeatures)
router.patch('/update/:id',featureAllowedController.updateFeature)
module.exports = router