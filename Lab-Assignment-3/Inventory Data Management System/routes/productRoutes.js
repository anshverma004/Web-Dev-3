const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  adjustStock,
  deleteProduct,
  getLowStockProducts,
  getCategorySummary
} = require('../controllers/productController');
const {
  validateCreateProduct,
  validateStockChange
} = require('../middleware/validationMiddleware');

// Report & Aggregation Routes (placed before /:id to prevent route conflicts)
router.get('/low-stock', getLowStockProducts);
router.get('/summary', getCategorySummary);

// Collection Routes
router.route('/')
  .get(getProducts)
  .post(validateCreateProduct, createProduct);

// Stock Adjustment Route
router.patch('/:id/stock', validateStockChange, adjustStock);

// Single Resource Routes
router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
