//This line loads environment variables from a file called .env into your app.//It keeps sensitive info (like database passwords, API keys) secret and not hard-coded in your code.
require("dotenv").config();
const express = require("express");
//This line imports the CORS middleware.
//So, if you try to fetch data from localhost:5000 while on localhost:3000, the browser will block it unless your backend says:
// ✅ "Yes, I allow requests from 3000."
// That’s what CORS does — it lets your backend give permission to specific origins to access its data.
const cors = require("cors");
const path = require("path");
const { connect } = require("http2");
const connectDB = require("./config/db");



const authRoutes= require("./routes/authRoutes");
const userRoutes= require("./routes/userRoutes");
const taskRoutes= require("./routes/taskRoutes");
const reportRoutes= require("./routes/reportRoutes");



const app = express();


//middleware to handle cors

//You are telling your backend: “Allow the frontend from CLIENT_URL, and let it make GET, POST, PUT, DELETE requests — as long as it uses only Content-Type or Authorization headers.”


app.use(
    cors({
        origin: process.env.CLIENT_URL || "*" , 
        methods : ["GET" , "POST", "PUT" , "DELETE"],
        allowedHeaders : ["Content-Type" , "Authorization"],
    })

);


//Connect Database
connectDB();

//MiddleWare
app.use(express.json());



    
//server uploads folder 
app.use("/uploads" , express.static(path.join(__dirname ,"uploads")));

//Routes

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/tasks",taskRoutes);
app.use("/api/routes",reportRoutes);




//start server

const Port = process.env.PORT || 5000;

app.listen(Port , ()=> console.log(`server is runing on port ${Port}`) );



