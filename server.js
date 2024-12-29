const express = require('express');
const dotenv = require('dotenv');
var cors = require('cors');
const stripe = require('stripe');
const path = require('path'); // Import path for serving static files

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS
const corsOptions = {
  origin: ['http://localhost:3000', process.env.REACT_APP_BACKEND_URL], // Make sure to replace this with correct frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow headers needed for your requests
};
app.use(cors(corsOptions));

// Parse incoming JSON requests
app.use(express.json());

// Stripe instance
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY); // Correctly initialize Stripe with the secret key

// Product data
const productsArray = [
  {
    id: process.env.COFFEE_PRICE_ID,
    title: 'Coffee',
    price: 4.99,
  },
  {
    id: process.env.SUNGLASSES_PRICE_ID,
    title: 'Sunglasses',
    price: 9.99,
  },
  {
    id: process.env.CAMERA_PRICE_ID,
    title: 'Camera',
    price: 39.99,
  },
];

// Serve frontend static files
const frontendPath = path.join(__dirname, 'store/build');
app.use(express.static(frontendPath));

// API Routes
app.get('/api/products', (req, res) => {
  res.json(productsArray);
});

app.get('/api/products/:id', (req, res) => {
  const product = productsArray.find((prod) => prod.id === req.params.id);

  if (!product) {
    return res.status(404).send('Product not found');
  }
  res.json(product);
});

app.post('/checkout', async (req, res) => {
  console.log(req.body);

  const items = req.body.items;
  let lineItems = items.map((item) => ({
    price: item.id,
    quantity: item.quantity,
  }));

  try {
    const session = await stripeInstance.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.REACT_APP_BACKEND_URL}/success`, // For success page
      cancel_url: `${process.env.REACT_APP_BACKEND_URL}/cancel`, // For cancel page
    });

    res.send(
      JSON.stringify({
        url: session.url,
      })
    );
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Fallback route to serve React frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));
