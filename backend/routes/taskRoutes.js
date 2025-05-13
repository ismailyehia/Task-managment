const express = require("express");
const { adminonly, protect } = require("../middlewares/authMiddleware");
const { getDashboardData, getUserDashboardData, getTasks, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist } = require("../controllers/taskController");

const router = express.Router();

//Task Managment  Routes

router.get("/dashboard-data" , protect , getDashboardData);
router.get("/user-dashboard" , protect , getUserDashboardData);
router.get("/" , protect , getTasks);
router.get("/:id" , protect , getTaskById);
router.post("/" , protect , adminonly, createTask);//create task by admin only
router.put("/:id" , protect , updateTask);
router.delete("/:id" , protect ,adminonly, deleteTask);
router.put("/:id/status" , protect , updateTaskStatus);
router.put("/:id/todo" , protect , updateTaskChecklist);

module.exports = router;


