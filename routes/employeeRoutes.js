const express = require("express");
const employeeController = require("../controller/employeeController");
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/add", employeeController.addEmployee);
router.get("/", authMiddleware,employeeController.getEmployees);

module.exports = router