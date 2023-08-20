const jwt = require("jsonwebtoken");
require("dotenv").config
const User = require("../models/User");


//AUTH
exports.auth = async (req,res,next) => {
    try{
        //extract token
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer","");
        //if token missing, then return response 
        if(!token){
            return res.status(401).json({
                success:false,
                message:"token is missing",
            })
        }
        //verify the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            console.log(decode);
            res.user = decode; 
        }catch(error){
            //verification failure
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            });
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"someting went wrong while validating the token"
         });
    }
}


//isSTUDENT
exports.isStudent = async (req, res, next) =>{
    try{
             if(req.user.accountType != "Student"){
                return res.status(401).json({
                    success:false,
                    message:"This is students route only"
                });
             }
             next();
        }
        
        catch(error){
            return res.status(500).json({
            success:false,
            message:"user role not verified"
        });
    }
}

//isINSTRUCTOR
exports.isInstructor = async (req, res, next) =>{
    try{
             if(req.user.accountType != "Instructor"){
                return res.status(401).json({
                    success:false,
                    message:"This is Instructor route only"
                });
             }
             next();
        }
        
        catch(error){
            return res.status(500).json({
            success:false,
            message:"user role not verified"
        });
    }
}


//ADMIN
exports.isAdmin = async (req, res, next) =>{
    try{
             if(req.user.accountType != "Admin"){
                return res.status(401).json({
                    success:false,
                    message:"This is Admin route only"
                });
             }
             next();
        }
        
        catch(error){
            return res.status(500).json({
            success:false,
            message:"user role not verified"
        });
    }
}