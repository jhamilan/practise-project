import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from "fs";


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ,
    api_key: process.env.CLOUDINARY_API_KEY ,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// ************* FILE UPLOADING ***************************
//a method to use the cloudinary   : get the url and give that to multer or something
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null

        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload (localFilePath, {  
            //cloudinary.uploader.upload is a built-in method provided by the official Cloudinary Node.js SDK
            resource_type: "auto"  //konse type ki file h, in-built function
        })
        //file has been uploaded successfully
        console.log("File is uploaded successfully on cloudinary ", response.url );
        // yahan ek msg type hoga aur console mein msg ke sath ek url milega vahi main h hamare liye
        return response;   //ye humne though pura response hi return kra diya user ke liye but of no use
        
        //file jo cloudinary pe upload hui h, uska agar source wagera chahiye toh uske liye maine yahan pe "response" mein 
        //usse hold kiya h taki url ka access kr sakun main

    } catch (error) {
        fs.unlinkSync(localFilePath) 
        //this removes the locally saved temporary file as the upload operation got failed, so to protect our server from messy corrupted files
        return null;
    }
}


export {uploadOnCloudinary};