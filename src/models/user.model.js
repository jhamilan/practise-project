import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jsonwebtoken, { JsonWebTokenError } from "jsonwebtoken";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    fullname: {
        type: String,
        required: true,
        index: true
    },
    avatar: {
        type: String, //cloudinary se lekr aaenge string iska
        required: true,
    },
    coverImage: {
        type: String
    },
    watchHistory: [ //its an array of lots of entries
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, "Password is required"]  //custom msg is given 
    },
    refreshToken: {
        type: String
    }
}, {timestamps: true})


userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) return next()
        // ye condition taki ye puri cheez bs password ke modify hone pe hi change ho

    this.password = await bcrypt.hash(this.password, 10)
    //hash ek method h and iske parameters mein pehla jisko hash krna h, aur dusra 10 - rounds h ya salts
    next()
    
})
//yahan pe save is operation jiske liye hook chalna hai, and ye callback deta h ye hook but we can not use arrow function 
//bcoz arrow function mein this krke hum reference nhi le skte, isliye use function(){}


userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id:  this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
            //ye payloads h
        },
        process.env.ACCESS_TOKEN_SECRET,
        //access token lgta h jo humne diya tha env file mein isliye process.env use kiya
        {
            expiresIn: ACCESS_TOKEN_EXPIRY 
            //aur ek object jiske andar expiry likhte h
        }
    )
}
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id:  this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: REFRESH_TOKEN_EXPIRY 
        }
    )
}
export const User = mongoose.model("User", userSchema)