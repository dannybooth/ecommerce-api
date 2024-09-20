exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
      // Fetch user from the database
      const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);

      if (result.rows.length === 0) {
          return res.status(404).json({ message: 'User not found' });
      }

      const user = result.rows[0];

      // Log the fetched user and password comparison
      console.log('Fetched user:', user);
      console.log('Comparing password:', password, 'with hash:', user.password);

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      // If login is successful
      res.json({
          message: 'Login successful',
          user: {
              id: user.id,
              username: user.username,
              email: user.email
          }
      });
  } catch (err) {
      console.error('Error during login', err);
      res.status(500).json({ message: 'Server error' });
  }
};
