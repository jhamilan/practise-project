//ye humne database connect krne ke dusre approach ke liye bnaya h file
import mongoose from "mongoose";
import { DB_NAME } from "../constants";
import { app } from "../app.js";

const ConnectDB =  async () => {
    try {
        //yahan pe hum database conect krwenge
        const connectionInstance = await mongoose.conect (`${process.env.MONGODB_URL}/ ${DB_NAME}`)
//connectionInstance is the name of the variable which is used here to store the return value of await

        console.log(`\n MONGODB Connected !! DB Host: ${connectionInstance.connection.host}`);
        //iska consle ka output dekh lena ek baar ki kya aaega
        
    } catch (error) {
        console.log("MONGODB Connection error!", error);
        process.exit(1) 
    }
}

export default ConnectDB