import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';

const router = express.Router();

router.route('/categories')
  .get(getAllCategories);

router.route('/categories/:categoryId')
  .get(getCategoryById)
  .put(updateCategory)
  .delete(deleteCategory);

router.route('/categories/create')
  .post(createCategory);

export default router;
