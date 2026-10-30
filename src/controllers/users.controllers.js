import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js"
//import ApiError
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";



//method of creating access and refresh token 
const generateAccessAndRefreshToken = async(userId) => {
    try {

        const user = await User.findById(userId)  //instance bna liya, neeche use krenge
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        //ab object ke andar add krvaenge mtlb refresh token toh database mein save hoga n
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}
        //method complete ho gya ab kahin bhi call krke use kr skte h

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens")
    }
}


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


//*******************LOGIN A USER ************************** 


const loginUser = asyncHandler(async (req, res) => {

    const { email, username, password } = req.body
    
    if (!(email || username)) {
        throw new ApiError(400, "Email or Username is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
        //ye bta rha h ki inn dono mein se koi ek toh for sure hona hi chahiye
    })

    //ab agar dono mein se kuchh bhi nhi mila toh fir error show krega
    if (!user) {
        throw new ApiError(404, "User is not registered")
    }

    //checking for password if user has login up

    const isPasswordValid = await user.isPasswordCorrect(password)
    //ye true ya false dega value
    
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")  
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    //yahan maine method ko call kiya, parameter userId bhi de di, aur time lag skta h isliye await lga diya
    //isse hamein 2 cheezein milengi vo maine variable emina ccess kr liya h

    const loggedinUser = await User.findById(user._id).select("-password -refreshToken") //reassuring

    //ab hum last step dekhenge send cookie
    const options = {
        httpOnly: true,
        secure: true
    }

    //ab return krna h ek response
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {  //ye pura data h ApiResponse ka
                user: loggedinUser, accessToken, refreshToken //last ke 2 not neceessary
            },
            "User logged in successfully"  //message
        )
    )

})


//logout bhi bnaenge hehe!
const logOutUser = asyncHandler(async(req, res) => {
    //pehle hamare pass user ki info ya access nhi tha - prblm
    //ab humne middleware bna liya aur route mein bhi lga diya toh logoutuser pe aane se pehle user ka access already 
    //h hamare pass toh ab udhar se hum id nikal skte h ---- prblm solved yayy!!
    await User.findByIdAndUpdate(
        req.user._id, //ye query h mtlb yahan se id mil jaega current loggedin user ka
        {
            $set: {
                refreshToken: undefined  //this will delete the current refreshToken after logout
            }
        },
        {
            new: true   //ye new updated info return krega after deleting agar return kiya toh
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User LoggedOut Successfully"))


})




export { registerUser, loginUser, logOutUser}