import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
//import ApiError
import jwt from "jsonwebtoken"

//ek kya mst shortcut pta lga vscode ka. agar sab kuchh likhne ke baad realise kiya ki isko toh try catch mein wrap krna tha
//just select kro portion jisko wrap krna tha aur bina kuchh dabaye try likhna shuru krdo, try catch pe enter krte hi automatically wrap ho jaega pura

export const VerifyJWT = asyncHandler(async (req, _ , next) => {  //yahan res ka koi use nhi tha toh uske badle _ likhna allowed h
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        //yahan se hamein token mila, bearer wale ko exchange krke empty string mtlb sirf token return hoga hamare pass
    
        if (!token) {
            throw new ApiError(401, "Unauthorized access")
        }
    
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        //decodedToken se hamein id mil jaega
    
        if (!user) {
            throw new ApiError(401, "Invalid User Token")
        }
    
    
        //ab hum request ke andar naya object add kr dete h jo ki issmiddleware aur aage aane wale method ka instance wala user hoga
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
        //ya toh error ka messgae print hoga ya nhi mila toh humne jo typ ekiya h vo msg aaega
    }
})