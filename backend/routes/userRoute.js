import express from 'express'
import { registerUser,verifyOtp,deleteUnverifiedUser,loginUser,placeOrder,getAllProducts,getUserOrders} from '../controllers/authController.js'
import authUser from '../middlewares/authUser.js'

const userRouter=express.Router()

userRouter.post('/register',registerUser);
userRouter.post('/verify-user',verifyOtp);
userRouter.delete('/users/:gmail', deleteUnverifiedUser);
userRouter.post('/login/',loginUser)
userRouter.post('/place-order',authUser,placeOrder)
userRouter.get('/products',getAllProducts)
userRouter.get('/orders',authUser,getUserOrders)

export default userRouter;