const express  = require("express");
const { default: mongoose } = require("mongoose");
const { registerUser, loginUser, getUserProifle, updateUserProfile,  } = require("../controllers/authContoller");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");


const router = express.Router();


//Auth Routes

router.post("/register" , registerUser); //Register User
router.post("/login" , loginUser); //Login User|
router.get("/profile" , protect , getUserProifle); //Get user profile 
router.put("/profile" , protect , updateUserProfile); //update user profile 

router.post("/uploadimage" , upload.single("image") , (req , res)=>{
    if(!req.file){
        return res.status(400).json({message:"no file uploaded"});
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
    }`;
    res.status(200).json({imageUrl});
});






module.exports = router;

