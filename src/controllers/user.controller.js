import asyncHandler from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        console.log("REAL TOKEN ERROR 👉", error);
        throw error;
    }
}

const registerUser=asyncHandler(async (req,res)=>{
    //get user data from frontend
    //validation if form is empty
    //check if user is already exist:username and email
    //check for img,check for avtar
    //upload them on cloudinary,avtar
    //create user object- create entry in db
    //remove password and refrest token from filed
    //check for user creation
    //return res

    //getting user data
    const {fullName,email,username,password}=req.body
    // console.log("email : ",email)
    // console.log(req.body);
    //check if data is empty?
    if([fullName,email,username,password].some((field)=>field?.trim()=="")){
        throw new ApiError(400,"All field are required")
    } 

    //checking if user already exist or not
    const existUser=await User.findOne({
        $or:[{username},{email}]
    })
    if(existUser){
        throw new ApiError(409,"User already exists")
    }

    //checking img and avtar
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    //checking avatar path 
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is not there!!!")
    }

    //uploading on cloudinary
    const avatar=await uploadOnCloudinary(avatarLocalPath);
    const coverImage=await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400,"Avatar is not there!!")
    }

    //creating Object
    const user=await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    //removing pass and refreshToken
    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //chech registeration
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registration ")
    }

    return res.status(201).json(
        new ApiResponse(201,createdUser,"Successful user registration")
    )
})

const logInUser=asyncHandler(async (req,res)=>{
    //get data
    //check for user or email
    //find user
    //check pass
    //access and refresh token  
    //send cookie
    // console.log(req.body)
    const {username,email,password}=req.body;

    if(!(username || email)){
        throw new ApiError(400,"Enter username or email")
    }

    const user=await User.findOne({
        $or:[{email},{username}]
    })

    if(!user){
        throw new ApiError(400,"username does not exist")
    }

    // console.log("entered:",password)
    // console.log("stored:",user.password)

    const isPasswordValid=await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401,"Password is invalid")
    }

    const {accessToken,refreshToken}=await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

    const option={
        httpOnly:true,
        secure:true //temp
    }
    //printing user
    console.log(user)
    return res
    .status(200)
    .cookie("refreshToken",refreshToken,option)
    .cookie("accessToken",accessToken,option)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "The user loggIn successful"
        )
    )

})

const logOutUser = asyncHandler(async (req , res, next) => {
    console.log(req.user);
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

const option = {
    httpOnly:true,
    secure:true //temp
}

return res
.status(200)
.clearCookie("accessToken",option)
.clearCookie("refreshToken",option)
.json(new ApiResponse(200,{},"User logged out"))
})

export  {registerUser,logInUser,logOutUser};
