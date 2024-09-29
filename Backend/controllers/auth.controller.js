import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { generateTokenAndSetcookie } from "../utils/generateTokenAndSetCookies.js"
import { 
    sendVerificationEmail , 
    sendWelcomeEmail ,
    sendPasswordResetEmail,
    sendResetSuccessEmail
} from "../Nodemailer/emails.js"


export const signup = async(req,res) =>{
    const {email,password, firstName , lastName} = req.body
    try{
        if(!email || !password || !firstName || !lastName){
           throw new Error('All fields are required')
        }

        const userAlreadyExists = await User.findOne({email})
        console.log('Query Email', email)
        console.log('Existing email' , userAlreadyExists)
        if(userAlreadyExists){
        return res.status(400).json({success:false , message: "User already exists"})
        } 
        
        const hashedpassword = await bcrypt.hash(password,12)
        const verificationToken  = Math.floor(100000 + Math.random() * 900000).toString()

        const user = new User({
            email , 
            password : hashedpassword , 
            firstName,
            lastName,
            verificationToken,
            verificationTokenExpiresAt : Date.now() + 24 * 60 * 60 * 1000
        })
        
        await user.save()

        console.log('Singup Response user Data:',{
            email:user.email,
            firstName:user.firstName,
            lastName:user.lastName
        })
         
        //jwt
        generateTokenAndSetcookie(res,user._id)
        await sendVerificationEmail(user.email , verificationToken)

        res.status(201).json({
            success : true , 
            message : "User created successfully " , 
            user :{
                ...user._doc , 
                password : undefined,    
          },
        })
        }catch(error){
            console.error('Signup Error:' , error)
           res.status(400).json({success:false , message:error.message})
        }
    
}

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    console.log(`Received verification code: ${code}`); 

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            console.log('No user found or token expired');
            return res.status(400).json({ success: false, message: "Invalid or Expired verification code!" });
        }

        console.log('User found:', user); 

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        console.log('User verified and saved:', user);

        console.log('Verified user Data:',{
            email:user.email,
            firstName:user.firstName,
            lastName:user.lastName
        })

        await sendWelcomeEmail(user.email, user.firstName, user.lastName);

        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.log('Error in verifyEmail', error); 
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const Login = async(req,res)=>{
    const {email ,password} = req.body 
    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({success:false , message:"Invalid credentials"})
        }
        const isPasswordValid = await bcrypt.compare(password , user.password)
        if(!isPasswordValid){
            return res.status(400).json({success:false , message:"Invalid credentials"})
        }

        generateTokenAndSetcookie(res , user._id) 

        user.lastLogin = new Date() 
        await user.save()

        console.log('Login Response User Data:', {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        });
        
        res.status(200).json({
            success : true , 
            message : "Logged in successfully",
            user :{
                ...user._doc , 
                password : undefined , 
            }
        })
    }catch(error){
        console.log("Login Error :" , error)
        res.status(400).json({success: false , message:error.message})
    }
}

export const Logout = async(req,res)=>{
    res.clearCookie("token")
    res.status(200).json({succes:true , message:"Logged out succsesfully"})
}


export const forgotPassword = async(req,res) =>{
    const {email} = req.body;
    try {
        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({success: false, message: 'User not found'});
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        console.log('Generated Reset URL:', resetURL);
        await sendPasswordResetEmail(user.email, resetURL);

        res.status(200).json({success: true, message: "Password reset link sent to your email."});
    } catch (error) {
        console.error('Error in ForgotPassword', error);
        res.status(400).json({success: false, message: error.message});
    }
};


export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

	try {
        
        console.log(token)
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

        console.log('Reset Password User Data:', {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        });
        
        await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};



export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};