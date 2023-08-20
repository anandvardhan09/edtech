const User = require("../models/User");
const mailsender = require("../utils/mailSender");
const bcrypt = require("bcrypt");


//RESET PASSWORD TOKEN
exports.resetPasswordToken = async (req, res,) => {
    try{
        //fetch email from req
        const email = req.body.email;
        //check user from this email, email validation
        const user = await User.findOne({email: email});
        if(!user){
            return res.json({
                success: false,
                message: "email is not registerd"
            })
        }
        //generatetoken
        const token = crypto.randomUUID();
        //update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate({email:email}, {
                                                                            token,
                                                                            resetPasswordExpires: Date.now() + 5*60*1000,
                                                                        },
                                                                        {new:true});  
        //create url 
        const url = `http://localhost:3000/update-password/${token}`
        //send mail containing the url
        await mailsender(email,
                        "password reset",
                        `password reset link: ${url}`);
        //return response
        return res.json({
            success:true,
            message:"email to reset password sent successfully"
        });
    }
    catch(error){
        console.log(error);
        return res.status().json({
            success:false,
            message:"something went wrong while sending mail "
        });

    }
}


//RESET PASSWORD
exports.resetPassword = async (req,res) => {
    try{
        //fetch data from req
        const{password, confirmpassword, token} = req.body;
        //validation
        if(!password != confirmPassword){
                return res.json({
                    success:false,
                    messsage:"password is not matching",
                });
        }
        //get userdetails from DB using token
            const userDetails = await User.findOne({token:token});
        //if no entry - invalid token
        if(!user){
            return res.json({
                success:false,
                message:"token is invalid",
            });
        }
        //token time check
        if (UserDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:"token is expired,please regenrate token",
            }); 
        }  
        //hash paswoard
        const hashedPassword = await bcrypt.hash(password,10)
        //update password
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true},
        );
        //return response
        return res.status(200).json({
            success:true,
            message:"password reset successfully",
        });
    }
    catch(error){
        console.log(error);
        return res.status().json({
            success:false,
            message:""
        });

    }
}