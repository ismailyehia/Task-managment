const User = require("../models/User");
const Task = require("../models/Task");
const bcrypt = require("bcryptjs");


const getUsers = async (req , res)=> {
    try {
        const users = await User.find({role:"member"}).select("-password");

        //Add task counts to each user
        const userWithTaskCounts = await Promise.all(users.map(async (user)=>{
            const pendingtasks = await Task.countDocuments({assignedTo:user._id , status:"Pending"});
            const inProgresstasks = await Task.countDocuments({assignedTo:user._id , status:"Inprogress"});
            const completedtasks = await Task.countDocuments({assignedTo:user._id , status:"Completed"});


            return{
                ...user._doc , //include all exsitsing user data
                pendingtasks ,
                inProgresstasks ,
                completedtasks ,
            };

        }));
        res.json({userWithTaskCounts});
    } catch (error) {
        res.status(500).json({message: "Server error" , error:error.message});
    }
};


///////////
const getUserById= async (req , res)=> {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({message: "Server error" , error:error.message});
    }
};

/////////////////
// const deleteUser = async (req , res)=> {
//     try {
        
//     } catch (error) {
//         res.status(500).json({message: "Server error" , error:error.message});
//     }
// };


module.exports = {getUsers , getUserById };