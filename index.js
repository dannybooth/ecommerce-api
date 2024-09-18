const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Define a basic route
app.get('/', (req, res) => {
  res.send('Welcome to the E-Commerce API');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});