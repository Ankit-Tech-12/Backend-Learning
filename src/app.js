import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
})) //use for to take form data and extended use for take nested obj
app.use(express.json({limit:"16kb"})) // take json data
app.use(express.static("public")) //file,folder,img,pdf store on public
app.use(cookieParser()) //use to perform CURD operation cookie

// test route (temporary)
// app.get("/", (req,res)=>{
//    res.send("SERVER WORKING");
// });

//routes import
import userRouter from "./routes/user.routes.js"

//route declaration

app.use("/api/v1/users",userRouter)  //https://localhost:8000/api/v1/users/register or login

export default app;