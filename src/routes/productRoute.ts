import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController';

const router = express.Router();

router.route('/products')
  .get(getAllProducts);

router.route('/products/:productId')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

router.route('/products/create')
  .post(createProduct);

export default router;
