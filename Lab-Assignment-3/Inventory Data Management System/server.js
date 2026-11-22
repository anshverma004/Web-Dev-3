const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root health-check route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Inventory and Data Management System API is running',
    endpoints: {
      getAllProducts: 'GET /api/products',
      createProduct: 'POST /api/products',
      getSingleProduct: 'GET /api/products/:id',
      updateProduct: 'PUT /api/products/:id',
      adjustStock: 'PATCH /api/products/:id/stock',
      deleteProduct: 'DELETE /api/products/:id',
      lowStockReport: 'GET /api/products/low-stock',
      categorySummary: 'GET /api/products/summary'
    }
  });
});

// Product API routes
app.use('/api/products', productRoutes);

// Centralized Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
