import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    // Ensure required `image` field exists on each order item. If missing,
    // try to load it from the referenced Product (use first image url).
    const normalizedOrderItems = await Promise.all(
      orderItems.map(async (item) => {
        const normalized = { ...item };
        if (!normalized.image || String(normalized.image).trim() === '') {
          try {
            const product = await Product.findById(normalized.product).lean();
            if (product) {
              if (product.images && product.images.length && product.images[0].url) {
                normalized.image = product.images[0].url;
              } else if (product.image) {
                normalized.image = product.image;
              } else {
                normalized.image = '';
              }
            } else {
              normalized.image = '';
            }
          } catch (err) {
            normalized.image = '';
          }
        }
        return normalized;
      })
    );

    const order = new Order({
      orderItems: normalizedOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('addOrderItems error:', error);
    res.status(500).json({ message: 'Server Error', error: error?.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('getOrderById error:', error);
    res.status(500).json({ message: 'Server Error', error: error?.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('updateOrderToPaid error:', error);
    res.status(500).json({ message: 'Server Error', error: error?.message });
  }
};