import express from 'express'
import { registerUser,verifyOtp,deleteUnverifiedUser,loginUser,placeOrder} from '../controllers/authController.js'
import {authUser} from '../middlewares/authUser.js'

const userRouter=express.Router()

userRouter.post('/register',registerUser);
userRouter.post('/verify-user',verifyOtp);
userRouter.delete('/users/:gmail', deleteUnverifiedUser);
userRouter.post('/login/',loginUser)
userRouter.post('/place-order',authUser,placeOrder)

export default userRouter;