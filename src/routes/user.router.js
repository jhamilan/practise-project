//ab yahan hum router bnaenge aur kaise export krenge - very imp

import { Router } from "express";
import { loginUser, logOutUser, registerUser } from "../controllers/users.controllers";
import {upload} from "../middlewares/multer.middleware.js"
import { VerifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },{
            name: "coverImage",
            maxCount: 1
        }
    ]),

    registerUser
)

router.route("/login").post(loginUser)

//secure routes - middleware ka kuchh lafda h
router.route("/logout").post(VerifyJWT, logOutUser)
//ab kyun,i isko run hone se pehle mujhe apna middleware inject krna h jo ki h VerufyJWT, toh uska syntax kuchh aisa hoga


export default router