const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
require("dotenv").config;





//SENDOTP
exports.sendOTP = async (req,res) => {

    try{
        //fetch email from request
        const {email} = req.body;

        //check if user already exist
        const checkUserPresent = await User.findOne({email}); 

        //if user already exist return response
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User already exists "
            })
        }
        //generate OTP
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("otp generated",otp);
        
        //check unique otp or not
        var result = await OTP.findone({otp:otp});

        while(result){
            otp = otpGenerator(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result = await OTP.findone({otp:otp});
            
        }

        const otpPayload = {email,otp};

        //create an entry for otp
        const otpbody = await OTP.create(otpPayload);
        console.log(otpbody);

        //return response successful
        res.status(200).json({
            success:true,
            message:"otp sent successfully",
            otp
        })


    }catch(error){
        console.log(error);
        return res.status(401).json({
            success:false,
            message:error.message,
        })
    }
}


//SIGNUP
exports.signup = async (req,res) => {

    try{

        //fetch data from request
        const{
            firstNname,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;
        //validate
        if(!fistName || !lastName || !email || !password || !confirmPassword ||!otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            })
        }

        //2 password matching
        if(password != confirmPassword){
            return res.status(400).json({
                success:false,
                message:"password and confirm pasword does not match"
            })
        }
     
        //check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({ 
                success:false,
                message:"User already exists "
            })
        }
        //find recent otp stored by user
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);
    
        //validate otp
        if(recentOtp.length == 0){
            //otp not found
            return res.status(400).json({
                success:false,
                message:"otp not found"
            })
        }else if(otp != recentOtp.OTP){
            //invalid otp
            return res.status(400).json({
                success:false,
                message:"otp does not match"
            })
        }


        //hash password
        const hashedPassword = await bcrypt.hash(password);
        
        //create entry in db
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            details:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstNname} ${lastName}`,

        })
        //return res
        return res.status(200).json({
            success:true,
            message:"User signed up ",
            user
        })



    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"user not singed up"
        })

    }


}



//LOGIN

exports.login = async (req,res) => {

    try{
        //fetch data from request
        const {email,password} = req.body;

        //validate data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            })
        }
    
        //check user exist or not
        const user = await User.findone({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not singned up "
            })
        }
    
        //generate JWT after matching the password 
        if(await bcrypt.compare(password,user.password)){
            const payload = {
                email: user.email,
                id: user.id,
                role: user.role,
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            });
        
            user.token = token;
            user.password = undefined;

            //create cookie and send response
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true, 
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:"LogedIn"
            });
        }
        else{
            return res.status(401).json({
                success:false,
                message:"password incorrect",
            })
        }
        
    }catch(error){
        console.log(error);
        return res.status(500) .json({
            success:false,
            message:"Login faliure"
        })
    }
}

//CHANGE PASSWORD
exports.changePassword = async (req, res) => {
    try{
        //fetch data from request
        
        
        //get oldPassword, newPassword, confirmNewPassword
        //validate
        //update password in DB
        //send mail for updated password
        //return response
    
    
    
    }catch(error){

    }




}
