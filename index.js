const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./config/passport');
const routes = require('./routes/index');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        httpOnly: true,
        sameSite: 'lax' 
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Add a root route
app.get('/', (req, res) => {
    res.send('Welcome to the E-commerce API!');
});

// Use your routes
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
