import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {

    //step 1 - get input data from users/frontend
    const { username, fullname, email, password } = req.body
    console.log("email: ", email);

    //validation - checking empty feilds


    //case 1 - one by one checking by if condition


    //case 2- more advanced, by using some method
    if (
        [fullname, email, username, password].some((fields) => fields?.trim() === "")
        //iska mtlb h ki agar fields h aur agar empty h toh error throw krega jo neeche likhenge, {} ye nhi lgaya callback mein bcoz direct hi condition likh diya one liner
    ) {
        throw new ApiError(400, "All fields are required")
        //ApiError ko import krna h yahan fir use hoga, utils mein bnao bhai
    }



    //check User already toh exist nhi krta - imported User for this purpose
    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")    
    }


    //image handling
    const avatarLocalPath = req.files?.avatar[0]?.path; 
    //doubt
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    //compulsory checking for avatar
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    ////upload them on cloudinary - step 5
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    //check krlo avatar gya ya nhi sahi se vrna dbase fatega mtlb eroor aa jaega
    if (!avatar) {
        throw new ApiError(400, "Avatar is required")
    }

    
    //ab sara kaam ho gya toh database mein daal do aur sirf User hi h jo dbase se baat kr rha h toh uske through object bnake dalenge dbase mein
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        //yahan ek precaution rkha h bcoz coverimage necessaril check nhi kiya h toh what if nhi mila ye toh fir error na aaye isliye "" de diya OR operator lgake
        email,
        password,
        username: username.toLowerCase()
    })

    //just making sure user is created, also using .select method
    const isUserCreated = await User.findById(user._id).select(  //findbyid ek method h aur _id database khud dega
        "-password -refreshToken"  //syntax h ye
    )

    //ab check krenge
    if (!isUserCreated) {
        throw new ApiError(500, "Something went wrong while registering the user")  //server ki glti isliye 500
    }

    //last step which is response dena 
    return res.status(201).json(
        new ApiResponse(200, isUserCreated, "User registered Successfully")
    )


})

export { registerUser }