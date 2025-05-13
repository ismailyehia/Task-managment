const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Generate JWt Token

const generatetoken = (userId)=> {
    return jwt.sign({id:userId} , process.env.JWT_SECRET, {expiresIn: "7d"});
};


//register new user
const registerUser = async (req , res)=> {
    try {
        const {name  , email , password,profileImageUrl,adminInviteToken} =
        req.body;
        //Check if user exists
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({msg: "User already exists"});
        }
        //Determine user role : Admin if correct token is provided , otherwise Member
        let role = "member";
        if(adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN){
            role = "admin";
        }

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);

        //create new user

        const user = await User.create({
            name ,
            email,
            password : hashedPassword,
            profileImageUrl,
            role,
        });

        //return user data with JWT
        res.status(201).json({
            id:user._id ,
            name:user.name ,
            email:user.email ,
            profileImageUrl:user.profileImageUrl ,
            role:user.role ,
            token: generatetoken(user._id),
        })
    } catch (error) {
        res.status(500).json({message: "Server error" , error:error.message});
    }
};


///////

const loginUser = async (req , res)=> {
    try {
        const {email , password} = 
        req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({msg: "Invalid email or password"});
        }
            //compare paassword
            const isMatch = await bcrypt.compare(password , user.password);
            if(!isMatch){
                return res.status(401).json({msg: "Invalid email or password"});
            }

            //return user with data

            res.json({
                id:user._id ,
                name:user.name ,
                email:user.email ,
                role:user.role,
                profileImageUrl:user.profileImageUrl,
                token:generatetoken(user._id),
            });

        
    } catch (error) {
        res.status(500).json({message: "Server error" , error:error.message});
    }
};



//////


const getUserProifle = async (req , res)=> {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
            res.status(404).json({message:"User not found"});
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({message: "Server error" , error:error.message});
    }
};




//////////

const updateUserProfile = async (req , res)=> {
    try {
        const user = await User.findById(req.body.id);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.profileImageUrl = req.body.profileImageUrl || "";

        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
        }
        const updatedUser = await user.save();
        res.json({
            _id:updatedUser._id,
            name:updatedUser.name,
            image: updatedUser.profileImageUrl,
            email:updatedUser.email,
            role:updatedUser.role,
            token:generatetoken(updatedUser._id),
        });
    } catch (error) {
        res.status(500).json({message: "Server error" , error:error.message});
    }
};


module.exports = { registerUser , loginUser , getUserProifle , updateUserProfile};