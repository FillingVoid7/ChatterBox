import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true , 
        unique : true
    },
    password:{
        type:String , 
        required:true 
    },
    firstName:{
        type:String , 
        required:true
    },
    lastName:{
        type:String , 
        required:true
    },
    lastLogin:{
        type:Date,
        default :Date.now
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    userProfileIcon : {
        type:String, 
        default :'',
    },
    chatList: [{type: mongoose.Schema.Types.ObjectId , ref:'User'}],
    resetPasswordToken : String , 
    resetPasswordExpiresAt : Date , 
    verificationToken : String , 
    verificationTokenExpiresAt : Date ,
    joinCode:{
        type:String,
        unique:true,
        sparse:true
    }
},
{timestamps:true})


export const User = mongoose.model('User' , userSchema)