import https from 'https';
import { URLSearchParams } from 'url';

// PayPal credentials should be provided via environment variables.
// Required: PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET, PAYPAL_MODE ('sandbox' or 'live')

const getHost = () => (process.env.PAYPAL_MODE === 'live' ? 'api-m.paypal.com' : 'api-m.sandbox.paypal.com');

const getClientCreds = () => {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new Error('Missing PayPal credentials in environment');
  return { id, secret };
};

const requestAccessToken = async (clientId, clientSecret) => {
  const host = getHost();
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const body = new URLSearchParams({ grant_type: 'client_credentials' }).toString();

  return await new Promise((resolve, reject) => {
    const opts = {
      hostname: host,
      path: '/v1/oauth2/token',
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const r = https.request(opts, (resp) => {
      let data = '';
      resp.on('data', (c) => (data += c));
      resp.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ statusCode: resp.statusCode, body: parsed });
        } catch (e) {
          reject(e);
        }
      });
    });
    r.on('error', (e) => reject(e));
    r.write(body);
    r.end();
  });
};

const createOrderDirect = async (accessToken, payload) => {
  const host = getHost();
  const body = JSON.stringify(payload);
  return await new Promise((resolve, reject) => {
    const opts = {
      hostname: host,
      path: '/v2/checkout/orders',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const r = https.request(opts, (resp) => {
      let data = '';
      resp.on('data', (c) => (data += c));
      resp.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ statusCode: resp.statusCode, body: parsed });
        } catch (e) {
          reject(e);
        }
      });
    });
    r.on('error', (e) => reject(e));
    r.write(body);
    r.end();
  });
};

const captureOrderDirect = async (accessToken, orderID) => {
  const host = getHost();
  return await new Promise((resolve, reject) => {
    const opts = {
      hostname: host,
      path: `/v2/checkout/orders/${orderID}/capture`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };
    const r = https.request(opts, (resp) => {
      let data = '';
      resp.on('data', (c) => (data += c));
      resp.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ statusCode: resp.statusCode, body: parsed });
        } catch (e) {
          reject(e);
        }
      });
    });
    r.on('error', (e) => reject(e));
    r.end();
  });
};

export const createOrder = async (req, res) => {
  // Validate input and build payload outside try so fallback can reuse it
  const { amount, currency = 'GBP', description = 'TDB' } = req.body || {};

  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

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

  try {
    // Use explicit OAuth + Orders API for robust, predictable behavior
    const { id: clientId, secret: clientSecret } = getClientCreds();
    const tokenResp = await requestAccessToken(clientId, clientSecret);
    if (!tokenResp || tokenResp.statusCode !== 200) {
      console.error('Access token request failed', tokenResp);
      return res.status(500).json({ message: 'Failed to obtain PayPal access token', error: tokenResp });
    }

    const accessToken = tokenResp.body.access_token;
    const orderResp = await createOrderDirect(accessToken, payload);
    console.log('Direct PayPal order response:', orderResp);
    if (orderResp && orderResp.statusCode >= 200 && orderResp.statusCode < 300) {
      return res.status(201).json({ id: orderResp.body.id, raw: orderResp.body });
    }

    return res.status(500).json({ message: 'PayPal order creation failed', error: orderResp });
  } catch (error) {
    console.error('createOrder error:', error);
    return res.status(500).json({ message: 'Failed to create PayPal order', error: error?.message || error });
  }
};

export const captureOrder = async (req, res) => {
  try {
    const { orderID } = req.body;
    if (!orderID) {
      return res.status(400).json({ message: 'orderID is required' });
    }

    // Request access token and capture order directly
    const { id: clientId, secret: clientSecret } = getClientCreds();
    const tokenResp = await requestAccessToken(clientId, clientSecret);
    if (!tokenResp || tokenResp.statusCode !== 200) {
      console.error('Access token request failed', tokenResp);
      return res.status(500).json({ message: 'Failed to obtain PayPal access token', error: tokenResp });
    }
    const accessToken = tokenResp.body.access_token;
    const capResp = await captureOrderDirect(accessToken, orderID);
    if (capResp && capResp.statusCode >= 200 && capResp.statusCode < 300) {
      return res.json(capResp.body);
    }
    return res.status(500).json({ message: 'Failed to capture PayPal order', error: capResp });
  } catch (error) {
    console.error('PayPal captureOrder error:', error);
    const errMsg = error?.message || 'Failed to capture PayPal order';
    return res.status(500).json({ message: 'Failed to capture PayPal order', error: errMsg });
  }
};

// Debug: request OAuth token directly to verify client id/secret and endpoint
export const debugToken = async (req, res) => {
  try {
    const mode = process.env.PAYPAL_MODE === 'live' ? 'live' : 'sandbox';
    const host = mode === 'live' ? 'api-m.paypal.com' : 'api-m.sandbox.paypal.com';
    // Build request body
    const body = new URLSearchParams({ grant_type: 'client_credentials' }).toString();

    // Helper to perform token request given credentials
    const doTokenRequest = async (clientId, clientSecret) => {
      const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      const options = {
        hostname: host,
        path: '/v1/oauth2/token',
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(body),
        },
      };

      return await new Promise((resolve, reject) => {
        const reqp = https.request(options, (resp) => {
          let data = '';
          resp.on('data', (chunk) => { data += chunk; });
          resp.on('end', () => {
            try {
              const parsed = JSON.parse(data);
              resolve({ statusCode: resp.statusCode, body: parsed, authPreview: auth.slice(0, 12) + '...' });
            } catch (err) {
              reject(err);
            }
          });
        });
        reqp.on('error', (e) => reject(e));
        reqp.write(body);
        reqp.end();
      });
    };

    // Credentials from environment (what the server would normally use)
    const envClientId = process.env.PAYPAL_CLIENT_ID || '';
    const envClientSecret = process.env.PAYPAL_CLIENT_SECRET || '';

    // Temporary hardcoded credentials used by the SDK in this file
    const hardClientId = PAYPAL_CLIENT_ID;
    const hardClientSecret = PAYPAL_CLIENT_SECRET;

    // Run both requests in parallel and return both results for comparison
    const [envResult, hardResult] = await Promise.all([
      doTokenRequest(envClientId, envClientSecret).catch((e) => ({ error: e?.message || String(e) })),
      doTokenRequest(hardClientId, hardClientSecret).catch((e) => ({ error: e?.message || String(e) })),
    ]);

    return res.json({ host, env: { clientIdPreview: (envClientId || '').slice(0, 12) + '...', result: envResult }, hard: { clientIdPreview: (hardClientId || '').slice(0, 12) + '...', result: hardResult } });
  } catch (error) {
    console.error('debugToken error:', error);
    return res.status(500).json({ message: 'Failed to fetch token', error: error?.message });
  }
};
