// const bcrypt = require('bcrypt');

// async function registerUser (client, { email, password, firstName, lastName, role }) {
//   // Check if the user already exists
//   const existingUser  = await client.query('SELECT * FROM users WHERE email = $1', [email]);
//   if (existingUser .rows.length > 0) {
//     throw new Error('User  already exists');
//   }

//   // Hash the password
//   const hashedPassword = await bcrypt.hash(password, 10);

//   // Insert the new user into the database
//   const result = await client.query(
//     'INSERT INTO users (email, password, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
//     [email, hashedPassword, firstName, lastName, role]
//   );

//   return result.rows[0]; // Return the newly created user
// }

// module.exports = registerUser ;


const bcrypt = require('bcrypt');

async function registerUser (client, { email, password, firstName, lastName, role }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Insert user into the users table
  const result = await client.query(
    'INSERT INTO users (email, password, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
    [email, hashedPassword, firstName, lastName, role]
  );

  const userId = result.rows[0].id;

  // Create a new table for the user
  await client.query(`CREATE TABLE IF NOT EXISTS user_cart_${userId} (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL
  );`);

  return { id: userId, email, firstName, lastName, role };
}

module.exports = registerUser ;
