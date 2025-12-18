import paypal from '@paypal/checkout-server-sdk';

const environment = process.env.PAYPAL_MODE === 'sandbox'
  ? new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_CLIENT_SECRET
    )
  : new paypal.core.LiveEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_CLIENT_SECRET
    );

const client = new paypal.core.PayPalHttpClient(environment);

export const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'GBP', description = 'TDB' } = req.body;

    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');

    const payload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
          description,
        },
      ],
      application_context: {
        brand_name: 'TDB',
        user_action: 'PAY_NOW',
        shipping_preference: 'NO_SHIPPING',
        return_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/order-success`,
        cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/cart`,
      },
    };

    console.log('PayPal createOrder payload:', JSON.stringify(payload));
    request.requestBody(payload);

    const order = await client.execute(request);
    console.log('PayPal createOrder response:', order && order.result ? JSON.stringify(order.result) : order);
    return res.status(201).json({ id: order.result.id });
  } catch (error) {
    console.error('PayPal createOrder error:', error);
    if (error?.statusCode) console.error('PayPal statusCode:', error.statusCode);
    const errMsg = error?.message || 'Failed to create PayPal order';
    return res.status(500).json({ message: 'Failed to create PayPal order', error: errMsg });
  }
};

export const captureOrder = async (req, res) => {
  try {
    const { orderID } = req.body;
    if (!orderID) {
      return res.status(400).json({ message: 'orderID is required' });
    }

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});
    const capture = await client.execute(request);
    return res.json(capture.result);
  } catch (error) {
    console.error('PayPal captureOrder error:', error);
    const errMsg = error?.message || 'Failed to capture PayPal order';
    return res.status(500).json({ message: 'Failed to capture PayPal order', error: errMsg });
  }
};
