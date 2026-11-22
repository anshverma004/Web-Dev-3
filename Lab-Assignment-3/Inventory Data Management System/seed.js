const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Product = require('./models/Product');

dotenv.config();

const sampleProducts = [
  {
    name: 'Study Table',
    sku: 'FURN-TB-812',
    category: 'Furniture',
    price: 3999,
    quantity: 2,
    reorderLevel: 4,
    supplier: 'IKEA India'
  },
  {
    name: 'Ergonomic Office Chair',
    sku: 'FURN-CH-204',
    category: 'Furniture',
    price: 7499,
    quantity: 12,
    reorderLevel: 5,
    supplier: 'Featherlite'
  },
  {
    name: 'Wooden Bookshelf',
    sku: 'FURN-BS-310',
    category: 'Furniture',
    price: 4599,
    quantity: 3,
    reorderLevel: 5,
    supplier: 'IKEA India'
  },
  {
    name: 'Wireless Mechanical Keyboard',
    sku: 'ELEC-KB-101',
    category: 'Electronics',
    price: 3996,
    quantity: 18,
    reorderLevel: 10,
    supplier: 'Logitech India'
  },
  {
    name: '27-inch 4K IPS Monitor',
    sku: 'ELEC-MN-205',
    category: 'Electronics',
    price: 15002,
    quantity: 10,
    reorderLevel: 5,
    supplier: 'LG Electronics'
  },
  {
    name: 'USB-C Multiport Hub',
    sku: 'ELEC-HB-309',
    category: 'Electronics',
    price: 1747,
    quantity: 8,
    reorderLevel: 8,
    supplier: 'Anker Direct'
  },
  {
    name: 'Bluetooth Noise-Cancelling Mouse',
    sku: 'ELEC-MS-412',
    category: 'Electronics',
    price: 1801,
    quantity: 60,
    reorderLevel: 15,
    supplier: 'Logitech India'
  },
  {
    name: 'Cotton Crew Neck T-Shirt',
    sku: 'APPR-TS-501',
    category: 'Apparel',
    price: 799,
    quantity: 67,
    reorderLevel: 15,
    supplier: 'Raymond Apparel'
  },
  {
    name: 'Denim Regular Fit Jacket',
    sku: 'APPR-JK-502',
    category: 'Apparel',
    price: 1999,
    quantity: 11,
    reorderLevel: 10,
    supplier: 'Levis India'
  },
  {
    name: 'Spiral Notebook A4 Pack of 5',
    sku: 'STNY-NB-601',
    category: 'Stationery',
    price: 350,
    quantity: 5,
    reorderLevel: 10,
    supplier: 'Classmate'
  },
  {
    name: 'Whiteboard Marker Set',
    sku: 'STNY-MK-602',
    category: 'Stationery',
    price: 220,
    quantity: 35,
    reorderLevel: 12,
    supplier: 'Camlin Kokuyo'
  },
  {
    name: 'Stainless Steel Water Bottle 1L',
    sku: 'KTCH-WB-701',
    category: 'Kitchenware',
    price: 699,
    quantity: 30,
    reorderLevel: 10,
    supplier: 'Milton India'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Product.deleteMany();
    console.log('Cleared existing products.');

    const created = await Product.insertMany(sampleProducts);
    console.log(`Seeded ${created.length} products successfully.`);

    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
