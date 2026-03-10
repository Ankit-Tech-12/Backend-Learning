// const asyncHandler=(requestHandler)=>{
//     return (req,res,next)=>{
//         Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
//     }
// }

const asyncHandler=(requestHandler)=>async (req,res,next)=>{
    try {
        await requestHandler(req,res,next)
    } catch (error) {
        next(error)
    }
}

export default asyncHandler;
