import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET || '6b9b2155a53b11e0fb0555df22255a7f44535a088c9dba5b7647e699f35adcbb46265684962b3fb195959cf72074cbbe6df4c3a540989aee8be7c11a2a4d2641', {
    expiresIn: '30d',
  });

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
    });

    return res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    if (error?.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid user data' });
    }
    return res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
console.log(email, password);
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log(user, "user found");
    // if (!user || !(await user.matchPassword(password))) {
    //   return res.status(401).json({ message: 'Invalid email or password' });
    // }

    return res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Server error during login:', error?.message || error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching profile' });
  }
};

export const bootstrapAdmin = async (req, res) => {
  try {
    const key = req.headers['x-admin-bootstrap-key'];
    if (!process.env.ADMIN_BOOTSTRAP_KEY || key !== process.env.ADMIN_BOOTSTRAP_KEY) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { email, password, name } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });
    if (user) {
      user.role = 'admin';
      user.name = name || user.name || 'Admin User';
      user.password = password;
      await user.save();
    } else {
      user = await User.create({
        name: name || 'Admin User',
        email: normalizedEmail,
        password,
        role: 'admin',
      });
    }

    return res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error bootstrapping admin' });
  }
};

