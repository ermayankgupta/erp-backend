const express = require("express");

const router = express.Router();
const attendenceController = require("../controller/attendenceController");
const authMiddleware = require('../middleware/authMiddleware');

router.get("/clockin", authMiddleware, attendenceController.clockIn);
router.get("/clockout", authMiddleware, attendenceController.clockOut);
router.get("/status", authMiddleware, attendenceController.attendenceStatus);
router.get("/getattendence", authMiddleware, attendenceController.getAttendence);
router.put("/edit", authMiddleware, attendenceController.editAttendence);
router.get("/attendencerequest", authMiddleware, attendenceController.attendencerequest);
router.get("/updateattendence", authMiddleware, attendenceController.updateAttendenceRequest);



module.exports =  router