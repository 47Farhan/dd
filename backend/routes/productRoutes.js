import express from 'express';
import path from 'path';
import multer from 'multer';
import Product from '../models/Product.js';
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
} from '../controllers/productController.js';

const router = express.Router();

//////////////////////
// Multer Config
//////////////////////
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

//////////////////////
// Existing GET Routes
//////////////////////
router.route('/').get(getProducts);
router.route('/featured').get(getFeaturedProducts);
router.route('/:id').get(getProductById);
router.route('/category/:category').get(getProductsByCategory);

//////////////////////
// NEW: Upload Product Image
//////////////////////
router.put('/upload-image/:id', upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const imageObj = {
      url: '/uploads/' + req.file.filename,
      alt: req.body.alt || product.name,
    };

    product.images.push(imageObj); // Add image to images array
    await product.save();

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
