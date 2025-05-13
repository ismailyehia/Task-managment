
const express = require("express");
const { protect, adminonly } = require("../middlewares/authMiddleware");
const { exportTasksReport, exportUsersReport } = require("../controllers/reportController");


const router = express.Router();


router.get("/export/tasks" , protect, adminonly ,exportTasksReport );//export all tasks as a excell/pdf
router.get("/export/users" , protect, adminonly ,exportUsersReport );//export user-task report


module.exports = router;

