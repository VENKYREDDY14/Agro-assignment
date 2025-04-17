import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  gmail: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  number: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Define roles
    default: 'user', // Default role is 'user'
  },
  otp: {
    type: String, // OTP will be stored as a string
    required: false, // Optional field
  },
  otpExpiresAt: {
    type: Date, // Expiry time for the OTP
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userModel=mongoose.model.user || mongoose.model('user',userSchema);

export default userModel;