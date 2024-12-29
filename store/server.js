const express = require('express');
const dotenv = require('dotenv');
var cors = require('cors');
const stripe = require('stripe');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

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

// Get all products
app.get('/api/products', (req, res) => {
  res.json(productsArray);
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
  const product = productsArray.find((prod) => prod.id === req.params.id);

  if (!product) {
    return res.status(404).send('Product not found');
  }
  res.json(product);
});

// Checkout route (existing logic)
app.post('/checkout', async (req, res) => {
  console.log(req.body);

  const items = req.body.items; // Items sent from client
  let lineItems = items.map((item) => ({
    price: item.id, // Use price IDs from the client
    quantity: item.quantity,
  }));

  try {
    const session = await stripeInstance.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
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

app.listen(4000, () => console.log('Listening on port 4000!'));
