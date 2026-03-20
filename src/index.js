import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";   

dotenv.config({
    path: './.env'
});

const port = process.env.PORT || 8000;

connectDB()
.then(() => {

    app.listen(port, () => {
        console.log(`App is listening on port ${port}`);
    });

})
.catch((err) => {
    console.log("MongoDB Connection ERROR !!!!!", err);
});

// import dotenv from "dotenv"
// import connectDB from "./db/index.js";
// import express from "express"

// const app=express();

// const port=process.env.PORT || 3000;

// dotenv.config({
//     path:'./env'   
// })

// connectDB()
// .then(()=>{
    
//     app.on("error",(error)=>{
//         console.log("ERROR !!",error)
//     })

//     app.listen(port,()=>{
//         console.log(`App is listening on port ${port}`)
//     })
// })
// .catch((err)=>{
//     console.log("MongoDB Connection ERROR !!!!!", err)
// })






/*
;(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        app.on("error",(error)=>{
            console.log("ERRROR:",error)
            throw(error)
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on Port ${process.env.PORT}`)
        })

    } catch (error) {
        console.error("ERROR:",error)
        throw(error)
    }
})()
*/


