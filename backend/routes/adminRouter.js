import express from 'express';
import multer from 'multer';
import { uploadSingleImage, uploadCSV } from '../middlewares/multer.js';
import { bulkUploadProducts,deleteProduct,addProduct,getAllProducts,getAllOrders,updateProduct} from '../controllers/adminController.js';

const adminRouter=express.Router();



adminRouter.post('/products/bulk-upload', uploadCSV.single('file'), bulkUploadProducts);
adminRouter.delete('/products/:id', deleteProduct);
adminRouter.post('/add-products',uploadSingleImage.single('img'), addProduct);
adminRouter.get('/products', getAllProducts);
adminRouter.get('/orders', getAllOrders);
adminRouter.put('/update-product/:id', updateProduct);

export default adminRouter