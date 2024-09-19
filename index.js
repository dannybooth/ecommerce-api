const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');

// Middleware
app.use(express.json()); // To parse JSON request bodies

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the E-commerce API!');
});

// Use auth routes
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});