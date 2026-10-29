import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

//configuration of cors, in general sirf ek line ein ho jata h, but lets see some main parameters
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))

app.use(cookieParser()) //ye toh same h cors ki trh, options h but not that much useful


//routes import
import userRouter from './routes/user.router.js'


//router declaration
app.use("api/v1/users", userRouter)



//aise dikhegi route - http://localhost:8000/api/v1/users/register kyunki users ke baad control user.router ke pass chla jaega

export { app }