// Input validation middleware for creating a product
const validateCreateProduct = (req, res, next) => {
  const { name, sku, category, price, quantity, reorderLevel } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push('Product name is required');
  }

  if (!sku || typeof sku !== 'string' || !sku.trim()) {
    errors.push('SKU is required');
  }

  if (!category || typeof category !== 'string' || !category.trim()) {
    errors.push('Category is required');
  }

  if (price === undefined || price === null || Number.isNaN(Number(price))) {
    errors.push('Valid price is required');
  } else if (Number(price) < 0) {
    errors.push('Price cannot be negative');
  }

  if (quantity !== undefined && (Number.isNaN(Number(quantity)) || Number(quantity) < 0)) {
    errors.push('Quantity must be a non-negative number');
  }

  if (reorderLevel !== undefined && (Number.isNaN(Number(reorderLevel)) || Number(reorderLevel) < 0)) {
    errors.push('Reorder level must be a non-negative number');
  }

  if (errors.length > 0) {
    res.status(400);
    return next(new Error(errors.join(', ')));
  }

  next();
};

// Input validation middleware for stock adjustments (PATCH /api/products/:id/stock)
const validateStockChange = (req, res, next) => {
  const { change } = req.body;

  if (change === undefined || change === null || typeof change !== 'number' || Number.isNaN(change)) {
    res.status(400);
    return next(new Error('Please provide a valid numeric "change" value (e.g., { "change": 10 } or { "change": -5 })'));
  }

  if (change === 0) {
    res.status(400);
    return next(new Error('Stock change value cannot be zero'));
  }

  next();
};

module.exports = {
  validateCreateProduct,
  validateStockChange
};
