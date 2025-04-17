import mongoose from "mongoose";

const connectDB=async()=>{
    mongoose.connection.on('connected',()=>console.log("Database Connectced"))
     await mongoose.connect(`${process.env.MONGODB_URI}/agro`);
}

export default connectDB;