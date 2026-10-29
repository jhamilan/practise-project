import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb (null, "./public/temp")
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname) //though original name is not a good option - study about it later
    }
})

export const upload = multer({
    storage
})