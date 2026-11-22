const Product = require('../models/Product');

// @desc    Create a new product
// @route   POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products with Filtering, Sorting & Pagination
// @route   GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      supplier,
      search,
      minPrice,
      maxPrice,
      inStock,
      sort,
      sortBy,
      order,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};

    // Filter by category (case-insensitive)
    if (category) {
      filter.category = { $regex: `^${category}$`, $options: 'i' };
    }

    // Filter by supplier (case-insensitive partial match)
    if (supplier) {
      filter.supplier = { $regex: supplier, $options: 'i' };
    }

    // Search by product name or SKU
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    // Filter by stock availability
    if (inStock !== undefined) {
      if (inStock === 'true') {
        filter.quantity = { $gt: 0 };
      } else if (inStock === 'false') {
        filter.quantity = 0;
      }
    }

    // Sorting configuration
    let sortOption = { createdAt: 1 };
    if (sort) {
      sortOption = sort.split(',').join(' ');
    } else if (sortBy) {
      const sortDirection = order && order.toLowerCase() === 'desc' ? -1 : 1;
      sortOption = { [sortBy]: sortDirection };
    }

    // Pagination calculation
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update product details
// @route   PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Adjust stock level safely (restock or sale)
// @route   PATCH /api/products/:id/stock
const adjustStock = async (req, res, next) => {
  try {
    const { change } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const updatedQuantity = product.quantity + change;
    if (updatedQuantity < 0) {
      res.status(400);
      throw new Error(
        `Insufficient stock. Current quantity is ${product.quantity}, cannot decrement by ${Math.abs(change)}`
      );
    }

    product.quantity = updatedQuantity;
    await product.save();

    res.status(200).json({
      message: 'Stock updated',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.status(200).json({
      message: 'Product deleted',
      id: product._id
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get low-stock alert report (quantity <= reorderLevel)
// @route   GET /api/products/low-stock
const getLowStockProducts = async (req, res, next) => {
  try {
    const lowStockItems = await Product.find({
      $expr: { $lte: ['$quantity', '$reorderLevel'] }
    });

    res.status(200).json({
      count: lowStockItems.length,
      lowStockItems
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category-wise inventory summary using Aggregation Pipeline
// @route   GET /api/products/summary
const getCategorySummary = async (req, res, next) => {
  try {
    const summary = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          totalStockValue: {
            $sum: { $multiply: ['$price', '$quantity'] }
          },
          avgPrice: { $avg: '$price' }
        }
      },
      {
        $project: {
          _id: 1,
          totalItems: 1,
          totalQuantity: 1,
          totalStockValue: 1,
          avgPrice: { $round: ['$avgPrice', 2] }
        }
      }
    ]);

    res.status(200).json({
      categories: summary.length,
      summary
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  adjustStock,
  deleteProduct,
  getLowStockProducts,
  getCategorySummary
};
