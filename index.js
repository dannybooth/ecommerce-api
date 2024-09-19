const pool = require('./config/db'); // Adjust the path based on your file structure

// Example: Query the database
pool.query('SELECT * FROM users', (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log(res.rows);
  }
});
