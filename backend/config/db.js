const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});

connection.connect((err) => {
    if (err) {
        console.error("Database Connection Failed:", err);
    } else {
        console.log("Connected to MySQL Database");
    }
});

connection.query(`
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`, (err) => {
    if (err) {
        console.log("Users table error:", err);
    } else {
        console.log("Users table ready");
    }
});

connection.query(`
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    category VARCHAR(100),
    price VARCHAR(50),
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`, (err) => {
    if (err) {
        console.log("Services table error:", err);
    } else {
        console.log("Services table ready");
    }
});


connection.query(`
INSERT INTO services (title, description, category, price, image)
SELECT * FROM (
    SELECT
    'House Cleaning',
    'Professional home cleaning service',
    'Cleaning',
    '499',
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952'
) AS temp
WHERE NOT EXISTS (
    SELECT title FROM services WHERE title = 'House Cleaning'
) LIMIT 1;
`);

connection.query(`
INSERT INTO services (title, description, category, price, image)
SELECT * FROM (
    SELECT
    'Electrician',
    'Expert electrical repair and installation',
    'Electrical',
    '699',
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4'
) AS temp
WHERE NOT EXISTS (
    SELECT title FROM services WHERE title = 'Electrician'
) LIMIT 1;
`);

connection.query(`
INSERT INTO services (title, description, category, price, image)
SELECT * FROM (
    SELECT
    'Plumbing',
    'Professional plumbing solutions',
    'Plumbing',
    '599',
    'https://images.unsplash.com/photo-1585704032915-c3400ca199e7'
) AS temp
WHERE NOT EXISTS (
    SELECT title FROM services WHERE title = 'Plumbing'
) LIMIT 1;
`);
module.exports = connection;