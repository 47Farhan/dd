import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// If an appsettings.json exists, load its keys as a fallback (keeps .env priority)
try {
  const appSettingsPath = path.join(__dirname, 'config', 'appsettings.json');
  if (fs.existsSync(appSettingsPath)) {
    const raw = fs.readFileSync(appSettingsPath, 'utf8');
    const appSettings = JSON.parse(raw);
    ['PAYPAL_CLIENT_ID', 'PAYPAL_CLIENT_SECRET', 'PAYPAL_MODE'].forEach((key) => {
      if (!process.env[key] && appSettings[key]) {
        process.env[key] = appSettings[key];
      }
    });
    console.log('Loaded appsettings.json');
  }
} catch (err) {
  console.error('Failed to load appsettings.json:', err.message);
}

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);

app.get('/favicon.ico', (req, res) => {
  const favPath = path.join(__dirname, '../frontend/public/favicon.ico');
  if (fs.existsSync(favPath)) {
    return res.sendFile(favPath);
  }
  return res.status(404).end();
});

// Home route (optional)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

// Log masked PayPal env info to help debug credential loading
const _mask = (s, head = 6, tail = 4) => {
  if (!s) return '<missing>';
  const str = String(s);
  if (str.length <= head + tail) return `${str.slice(0, head)}...${str.slice(-tail)}`;
  return `${str.slice(0, head)}...${str.slice(-tail)}`;
};
const paypalId = process.env.PAYPAL_CLIENT_ID || '';
const paypalSecret = process.env.PAYPAL_CLIENT_SECRET || '';
console.log('PAYPAL_MODE:', process.env.PAYPAL_MODE || '<not set>');
console.log('PAYPAL_CLIENT_ID (masked, len, trimmedLen):', _mask(paypalId), paypalId.length, paypalId.trim().length);
console.log('PAYPAL_CLIENT_SECRET (masked, len, trimmedLen):', _mask(paypalSecret), paypalSecret.length, paypalSecret.trim().length);
