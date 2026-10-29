//method 1 - through promises
const asyncHandler = (requestHandler) => {
    //JS mein promises ko strong bnao pehle fir syntax smjh aaega
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}
//yahan higher order function h mtlb function bhej rhe ho toh return bhi function hi kroge isliye yahah return krna zaroori h
export {asyncHandler}





// method 2 - by using async await and try catch

// const asyncHandler = () => {}
// const asyncHandler = (func) => {() => {}} but remove the {} we get (func) => () => {}
// const asyncHandler = (func) => async () => {}

/*
const asyncHandler = (func) => async (req, res, next) => {
    try {
       await func(req, res, next) 
    } catch (err) {
        res.status(err.code || 504).json({
            success: false,
            message: err.message
        })
    }
}*/