import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        index:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avtar:{
        type:String, //cloudinary URL
        required:true
    },
    coverImage:{
        type:String,
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    freshToken:{
        type:String,
    },
    watchHistory:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },
},{timestamps:true})

// convert into hash
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password=bcrypt.hash(this.password,12)
})

//chech password and inject this method in db
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=async function(){
    return await jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRETE
        ,{
            expiresIn:ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken=async function(){
    return await jwt.sign(
        {
            _id:this._id,
        },
        process.env.ACCESS_REFRESH_SECRETE
        ,{
            expiresIn:ACCESS_REFRESH_EXPIRY
        }
    )
}

export const User=mongoose.model("User",userSchema)