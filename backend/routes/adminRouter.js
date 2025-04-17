import express from 'express';
import multer from 'multer';
import { bulkUploadProducts,deleteProduct,addProduct,getAllProducts,getAllOrders,updateProduct} from '../controllers/adminController.js';

const adminRouter=express.Router();

const upload = multer({ dest: 'uploads/' });

adminRouter.post('/products/bulk-upload', upload.single('file'), bulkUploadProducts);
adminRouter.delete('/products/:id', deleteProduct);
adminRouter.post('/add-products', addProduct);
adminRouter.get('/products', getAllProducts);
adminRouter.get('/orders', getAllOrders);
adminRouter.put('/update-product/:id', updateProduct);

export default adminRouter