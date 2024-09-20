const express = require('express');
const passport = require('passport');
const userController = require('../controllers/userController');
const ensureAuthenticated = require('../middleware/auth');
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.json({ message: 'Login successful', user: { username: user.username, email: user.email, userId: user.id } });
        });
    })(req, res, next);
});

router.get('/login-failure', (req, res) => {
    res.send('Login failed.');
});

router.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            username: req.user.username,
            email: req.user.email,
        });
    } else {
        res.status(401).json({ error: 'You are not authenticated' });
    }
});

router.get('/:userId', ensureAuthenticated, userController.getUserById);

router.put('/:userId', ensureAuthenticated, userController.updateUserById);

router.post('/logout', (req, res, next) => {
    if (req.isAuthenticated()) {
      req.logout(function(err) {
        if (err) { return next(err); }
        
        req.session.destroy(function(err) {
          if (err) return next(err);
          
          res.clearCookie('connect.sid');
          res.status(200).send({ message: 'Logged out successfully' });
        });
      });
    } else {
      res.status(400).send({ message: 'No active session' });
    }
});

module.exports = router;