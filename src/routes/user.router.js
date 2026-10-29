//ab yahan hum router bnaenge aur kaise export krenge - very imp

import { Router } from "express";
import { registerUser } from "../controllers/users.controllers";
import {upload} from "../middlewares/multer.middleware.js"

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


export default router