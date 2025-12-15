import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js'; // import User model
import connectDB from '../config/database.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Remove existing data
    await Product.deleteMany();
    await User.deleteMany();

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: '123456',
      role: 'admin',
    });

    // Products array with user field
    const products = [
      {
        user: adminUser._id,
        name: 'Classic White Shirt',
        description: 'Premium quality cotton shirt for men with perfect fit and comfort.',
        price: 45.99,
        originalPrice: 55.99,
        category: 'men',
        subcategory: 'Shirts',
        images: [
          { url: 'https://images.unsplash.com/photo-1596755094514-87e34085b2c?w=500&h=600&fit=crop', alt: 'Classic White Shirt' }
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [{ name: 'White', code: '#FFFFFF' }],
        inventory: 50,
        sku: 'MEN-SHIRT-001',
        brand: 'Classic Wear',
        rating: { average: 4.5, count: 128 },
        features: ['100% Cotton', 'Machine Washable'],
        isFeatured: true,
        tags: ['shirt', 'casual', 'cotton']
      },
      {
        user: adminUser._id,
        name: 'Floral Summer Dress',
        description: 'Beautiful floral pattern dress perfect for summer occasions.',
        price: 55.99,
        originalPrice: 69.99,
        category: 'women',
        subcategory: 'Dresses',
        images: [
          { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=600&fit=crop', alt: 'Floral Summer Dress' }
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        colors: [{ name: 'Floral', code: '#FF69B4' }],
        inventory: 35,
        sku: 'WOMEN-DRESS-001',
        brand: 'Summer Style',
        rating: { average: 4.7, count: 89 },
        features: ['Lightweight', 'Breathable'],
        isFeatured: true,
        tags: ['dress', 'summer', 'floral']
      },
      {
        user: adminUser._id,
        name: 'Kids Cartoon T-Shirt',
        description: 'Comfortable cotton t-shirt with fun cartoon prints for kids.',
        price: 19.99,
        originalPrice: 24.99,
        category: 'kids',
        subcategory: 'T-Shirts',
        images: [
          { url: 'https://images.unsplash.com/photo-1622290291468-2f3766aa2c47?w=500&h=600&fit=crop', alt: 'Kids Cartoon T-Shirt' }
        ],
        sizes: ['4Y', '5Y', '6Y', '7Y'],
        colors: [{ name: 'Blue', code: '#4169E1' }],
        inventory: 75,
        sku: 'KIDS-TSHIRT-001',
        brand: 'Kids Fun',
        rating: { average: 4.6, count: 45 },
        features: ['100% Cotton', 'Kid Safe'],
        isFeatured: true,
        tags: ['kids', 't-shirt', 'cartoon']
      }
    ];

    // Insert products
    await Product.insertMany(products);

    console.log('✅ Sample data imported successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

importData();
