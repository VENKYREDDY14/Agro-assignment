import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoute.js'
import mongoose from 'mongoose'
import adminRouter from './routes/adminRouter.js'
import connectCloudinary from './config/cloudinary.js'



const app=express()
const port=process.env.PORT || 4000
connectDB()
connectCloudinary()

app.use(express.json())
app.use(cors())

app.use('/api/user/',userRouter)
app.use('/api/admin',adminRouter);

app.get('/',(req,res)=>{
    res.send('API WORKING ')
})

app.listen(port,()=>console.log("Server Started",port))
