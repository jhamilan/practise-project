//require('dotenv').config({path: './env'})    - isse bhi ho jaeg MediaKeyStatusMap, sab chlega, but ye purana tareeka h

import dotenv from "dotenv" 

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
import ConnectDB from "./db";

dotenv.config({
    path: './env'
})
//ab chal jaega aur consistency bhi aa gyi - modern solution

ConnectDB()
//import aur execute ho gya uss file se ye

//jis method se humne db cnnect kiya, vo promises return krta h, toh neeche ki lines technically zaroori h likhna

.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port: ${process.env.PORT}`);
        
    })
})
.catch((err) => {
    console.log("MONGODB connection failed OOPS!!", err);
    
})





















/*
import express from 'express'
const app = express()

//database connect krne ka behtar approach - ab yahan se connection start h

( async () => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`) 
       //"Internet par is address (URL) par jao, aur wahan is naam (DB_NAME) ka ek folder ya database kholo."

       app.on("error", (error) => {
        console.log("ERRR!: ", error);
        throw error 
       })

       app.listen(process.env.PORT, () => {
        console.log(`App is listening on port ${process.env.PORT}`);
       })

       
    } catch (error) {
        console.error("ERROR: ", error)
        throw error
    }
})()*/