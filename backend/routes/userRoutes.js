const express = require("express");
const { adminonly, protect } = require("../middlewares/authMiddleware");
const { getUsers, getUserById, deleteUser } = require("../controllers/userController");

const router = express.Router();



//User managment Routes

router.get("/" , protect , adminonly , getUsers)//get all users admin only
router.get("/:id" , protect , getUserById)//Get specifc user
// router.delete("/:id" , protect , adminonly , deleteUser); //delete user


module.exports = router;